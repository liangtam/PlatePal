import React from "react";
import {
    Box,
    Button,
    Checkbox,
    Flex,
    Heading,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
} from "@chakra-ui/react";
import {BiHeart, BiSolidHeart} from "react-icons/bi";
import "../RecipeDetail/RecipeDetail.css";
import "./ExploreCardDetail.css";
import noMedia from "../../assets/455-no-media.png";

const ExploreCardDetail = ({
                               selectFood,
                               isModalOpen,
                               handleClose,
                               onFavorite,
                               isFavorite
                           }) => {
    const ingredients = selectFood.ingredients;
    const instructions = selectFood.instructions;

    const handleFavorite = () => {
        onFavorite(selectFood._id);
    };

    return (
        <div>
            <Modal isOpen={isModalOpen} onClose={handleClose}>
                <ModalOverlay/>
                <ModalContent
                    className="modal-content"
                    style={{border: "1px solid var(--orange-300)", width: "400px"}}
                >
                    <ModalHeader
                        className="modal-header bg-orange-300"
                        style={{borderTopRightRadius: "5px", borderTopLeftRadius: "5px"}}
                    >
                        <Heading size="sm">{selectFood.name}</Heading>
                        <Text fontSize={15}>{"Shared from: " + selectFood.userEmail}</Text>
                    </ModalHeader>
                    <ModalCloseButton/>
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

                        <Button mr={3} onClick={handleClose}>
                            Close
                        </Button>
                        <Button
                            leftIcon={isFavorite ? <BiSolidHeart/> : <BiHeart/>}
                            style={{
                                color: "white",
                                backgroundColor: "rgb(86, 193, 255)",
                            }}
                            onClick={handleFavorite}
                        >
                            {isFavorite ? "Unfavorite" : "Favorite"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default ExploreCardDetail;
