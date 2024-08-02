import React, { useEffect, useState } from "react";
import { Box, ChakraProvider, Heading, Text, Image } from "@chakra-ui/react";
import { ExploreBox, ExploreCardDetail } from "../../components";
import api from "../../api";
import './Explore.css';
import whiteLogo from "../../assets/455-platepal-logo-white.png";
import io from 'socket.io-client';
import { motion, AnimatePresence } from "framer-motion";

const Explore = () => {
    const [fetchingData, setFetchingData] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [showCardDetail, setShowCardDetail] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [shouldFavorite, setShouldFavorite] = useState(false);

    const handleCardClick = (food, favorite = false) => {
        setSelectedFood(food);
        setShowCardDetail(true);
        setShouldFavorite(favorite);
    };

    const fetchUserRecipes = async () => {
        try {
            const response = await api.get('recipes/public');
            if (response.status >= 200 && response.status < 300) {
                console.log('Request was successful:', response.data);
                setRecipes(response.data);
            } else {
                alert("An error occurred")
            }
        } catch (err) {
            alert("Could not load user recipes.")
        }
    }

    useEffect(() => {
        fetchUserRecipes();

        const socket = io(process.env.REACT_APP_BACKEND_URL, {
            transports: ['websocket', 'polling'],
            secure: true,
            rejectUnauthorized: false,
            reconnection: true,
            reconnectionAttempts: 5
        });

        socket.on('newRecipe', ({newRecipe}) => {
            console.log('Received new recipe:', newRecipe);
            setRecipes((prevRecipes) => [newRecipe, ...prevRecipes]);
        });

        socket.on('favoriteUpdate', ({ recipeId, favoriteCount }) => {
            console.log(`Received update for recipe ${recipeId}: new count ${favoriteCount}`);
            setRecipes((prevRecipes) =>
                prevRecipes.map((recipe) =>
                    recipe._id === recipeId ? { ...recipe, favoriteCount } : recipe
                )
            );
        });

        return () => {
            socket.off('newRecipe');
            socket.off('favoriteUpdate');
        };
    }, [fetchingData]);

    const handleFavoriteUpdate = (recipeId, newCount) => {
        setRecipes((prevRecipes) =>
            prevRecipes.map((recipe) =>
                recipe._id === recipeId ? { ...recipe, favoriteCount: newCount } : recipe
            )
        );
    };

    return (
        <div className="bg-radial">
            <ChakraProvider>
                <Heading>
                    <Box>
                        <Image className="image" src={whiteLogo} alt="PlatePal Logo" />
                        <Text color="white">Exploring Other users' Recipes...</Text>
                    </Box>
                </Heading>

                <motion.div layout className="cards">
                    <AnimatePresence>
                        {recipes && recipes.map((recipe) => (
                            <motion.div
                                key={recipe._id}
                                layout
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{
                                    opacity: { duration: 0.2 },
                                    layout: { duration: 0.3 },
                                    y: { type: "spring", stiffness: 300, damping: 30 }
                                }}
                            >
                                <ExploreBox
                                    recipe={recipe}
                                    onClick={() => handleCardClick(recipe)}
                                    onLike={() => handleCardClick(recipe, true)}
                                    favoriteCount={recipe.favoriteCount}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
                {showCardDetail && (
                    <ExploreCardDetail
                        selectFood={selectedFood}
                        isModalOpen={showCardDetail}
                        handleClose={() => {
                            setShowCardDetail(false);
                            setShouldFavorite(false);
                        }}
                        onFavoriteUpdate={(newCount) => handleFavoriteUpdate(selectedFood._id, newCount)}
                        shouldFavorite={shouldFavorite}
                    />
                )}
            </ChakraProvider>
        </div>
    );
};

export default Explore;
