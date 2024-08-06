import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Modal,
  ModalOverlay,
  Heading,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Box,
  Image,
  Checkbox,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import "../RecipeDetail/RecipeDetail.css";
import "./ExploreCardDetail.css";
import api from "../../api";
import io from "socket.io-client";
import noMedia from "../../assets/455-no-media.png";

const ExploreCardDetail = ({
  selectFood,
  isModalOpen,
  handleClose,
  shouldFavorite,
  onFavoriteToggle,
}) => {
  const ingredients = selectFood.ingredients;
  const instructions = selectFood.instructions;

  const [favoritesCount, setFavoritesCount] = useState(
    selectFood.favoriteCount || 0
  );
  const [previousFavoritesCount, setPreviousFavoritesCount] = useState(
    selectFood.favoriteCount || 0
  );
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [processingFavorite, setProcessingFavorite] = useState(false);
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_BACKEND_URL, {
      transports: ["websocket", "polling"],
      secure: true,
      rejectUnauthorized: false,
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socket.on("favoriteUpdate", (data) => {
      if (data.recipeId === selectFood._id) {
        setPreviousFavoritesCount(favoritesCount);
        setFavoritesCount(data.favoriteCount);
      }
    });

    if (user) {
      fetchFavoriteRecipes();
    }

    return () => {
      socket.off("favoriteUpdate");
    };
  }, [selectFood._id, user]);

  const fetchFavoriteRecipes = async () => {
    if (!user) {
      return;
    }
    try {
      const response = await api.get(`/users/favorites/${user.id}`, {
        headers: { "auth-token": localStorage.getItem("authToken") },
      });
      setFavoriteRecipes(response.data);
    } catch (error) {
      console.error("Error fetching favorite recipes:", error);
    }
  };

  const handleFavorite = async () => {
    if (processingFavorite || !user) return;

    setProcessingFavorite(true);
    const isFavorite = favoriteRecipes.includes(selectFood._id);

    try {
      // Optimistic update
      setPreviousFavoritesCount(favoritesCount);
      if (isFavorite) {
        setFavoriteRecipes((prev) =>
          prev.filter((id) => id !== selectFood._id)
        );
        setFavoritesCount((prev) => prev - 1);
      } else {
        setFavoriteRecipes((prev) => [...prev, selectFood._id]);
        setFavoritesCount((prev) => prev + 1);
      }

      // API call
      await api.post(
        "/users/favorite",
        {
          userId: user.id,
          recipeId: selectFood._id,
        },
        {
          headers: {
            "auth-token": localStorage.getItem("authToken"),
          },
        }
      );
      // The server will emit the update via socket.io, so we don't need to update the state here again
      await onFavoriteToggle();
    } catch (error) {
      console.error("Error favoriting recipe:", error);
      // Revert the optimistic update if the API call fails
      fetchFavoriteRecipes();
      setFavoritesCount(selectFood.favoriteCount);
    } finally {
      setProcessingFavorite(false);
    }
  };

  useEffect(() => {
    if (shouldFavorite && !isFavorite) {
      handleFavorite();
    }
  }, [shouldFavorite]);

  const isFavorite = favoriteRecipes.includes(selectFood._id);
  const direction = favoritesCount > previousFavoritesCount ? -10 : 10;

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent
          className="modal-content"
          style={{ border: "1px solid var(--orange-300)", width: "400px" }}
        >
          <ModalHeader
            className="modal-header bg-orange-300"
            style={{ borderTopRightRadius: "5px", borderTopLeftRadius: "5px" }}
          >
            <Heading size="sm">{selectFood.name}</Heading>
            <Text fontSize={15}>{"Shared from: " + selectFood.userEmail}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Flex justify={"center"}>
                <Image
                  src={selectFood.image || noMedia}
                  mb={4}
                  className="card-animated-image"
                />
              </Flex>
              <Text fontWeight="bold" mb={2} className="section-title">
                Ingredients:
              </Text>
              <Stack spacing={1} mb={4} className="ingredient-list">
                {ingredients.map((ingredient, index) => (
                  <Checkbox key={index} colorScheme="green">
                    {ingredient}
                  </Checkbox>
                ))}
              </Stack>

              <Text fontWeight="bold" mb={2} className="section-title">
                Instructions:
              </Text>
              <Stack spacing={1} className="instruction-list">
                {instructions.map(
                  (instruction, index) =>
                    instruction && (
                      <Checkbox key={index} colorScheme="orange">
                        {instruction.trim()}
                      </Checkbox>
                    )
                )}
              </Stack>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Flex align="center" mr={3}>
              <Text mr={2}>Favorites:</Text>
              <Box
                width="20px"
                height="24px"
                overflow="hidden"
                position="relative"
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={favoritesCount}
                    initial={{ opacity: 0, y: direction }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: direction }}
                    transition={{ duration: 0.3 }}
                    style={{ position: "absolute", width: "100%" }}
                  >
                    {favoritesCount}
                  </motion.div>
                </AnimatePresence>
              </Box>
            </Flex>
            <Button mr={3} onClick={handleClose}>
              Close
            </Button>
            {user && (
              <Button
                leftIcon={isFavorite ? <BiSolidHeart /> : <BiHeart />}
                style={{
                  color: "white",
                  backgroundColor: "rgb(86, 193, 255)",
                  width: "110px",
                }}
                onClick={handleFavorite}
                isDisabled={processingFavorite}
              >
                {isFavorite ? (
                  <span
                    style={{ visibility: isFavorite ? "visible" : "hidden" }}
                  >
                    Unfavorite
                  </span>
                ) : (
                  <span
                    style={{ visibility: isFavorite ? "hidden" : "visible" }}
                  >
                    Favorite
                  </span>
                )}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ExploreCardDetail;
