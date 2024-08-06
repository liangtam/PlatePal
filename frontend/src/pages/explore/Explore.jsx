import React, { useEffect, useState } from "react";
import { Box, ChakraProvider, Heading, Text } from "@chakra-ui/react";
import { ExploreBox, ExploreCardDetail } from "../../components";
import api from "../../api";
import './Explore.css';
import io from 'socket.io-client';
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

const Explore = () => {
    const [fetchingData, setFetchingData] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [showCardDetail, setShowCardDetail] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [processingFavorite, setProcessingFavorite] = useState(false);
    const user = useSelector((state) => state.user.value);

    const handleCardClick = (food) => {
        setSelectedFood(food);
        setShowCardDetail(true);
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

    const fetchFavoriteRecipes = async () => {
        if (!user) {
            return;
        }
        try {
            const response = await api.get(`/users/favorites/${user.id}`,
                { headers: { 'auth-token': localStorage.getItem('authToken') } });
            setFavoriteRecipes(response.data);
        } catch (error) {
            console.error("Error fetching favorite recipes:", error);
        }
    };

    const handleFavorite = async (recipeId) => {
        if (!user || processingFavorite) return;

        setProcessingFavorite(true);
        const isFavorite = favoriteRecipes.includes(recipeId);

        try {
            // Optimistic update
            setFavoriteRecipes(prev =>
                isFavorite ? prev.filter(id => id !== recipeId) : [...prev, recipeId]
            );
            setRecipes(prev => {
                const newRecipes = prev.map(recipe =>
                    recipe._id === recipeId
                        ? { ...recipe, favoriteCount: isFavorite ? recipe.favoriteCount - 1 : recipe.favoriteCount + 1 }
                        : recipe
                );

                // Update selectedFood if it's the one being favorited
                if (selectedFood && selectedFood._id === recipeId) {
                    setSelectedFood(newRecipes.find(r => r._id === recipeId));
                }

                return newRecipes;
            });

            // API call
            await api.post(
                "/users/favorite",
                {
                    userId: user.id,
                    recipeId: recipeId,
                },
                {
                    headers: {
                        "auth-token": localStorage.getItem("authToken"),
                    },
                }
            );
            // The server will emit the update via socket.io
        } catch (error) {
            console.error("Error favoriting recipe:", error);
            // Revert the optimistic update if the API call fails
            await fetchFavoriteRecipes();
            await fetchUserRecipes();
        } finally {
            setProcessingFavorite(false);
        }
    };

    useEffect(() => {
        fetchUserRecipes();
        fetchFavoriteRecipes();

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

        socket.on('recipeRemoved', ({ recipeId }) => {
            console.log(`Recipe removed: ${recipeId}`);
            setRecipes((prevRecipes) => prevRecipes.filter(recipe => recipe._id !== recipeId));
            if (selectedFood && selectedFood._id === recipeId) {
                setShowCardDetail(false);
            }
        });

        return () => {
            socket.off('newRecipe');
            socket.off('favoriteUpdate');
            socket.off('recipeRemoved');
        };
    }, [fetchingData]);

    return (
        <div className="flex-col align-items-center bg-base-100">
            <ChakraProvider>
                <Heading>
                    <Box>
                        <Text className='w-100 marB-4'>Recipe Plaza</Text>
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
                                {favoriteRecipes && <ExploreBox
                                    recipe={recipe}
                                    onClick={() => handleCardClick(recipe)}
                                    onFavorite={handleFavorite}
                                    isFavorite={favoriteRecipes.includes(recipe._id)}
                                />}
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
                        }}
                        onFavorite={handleFavorite}
                        isFavorite={favoriteRecipes.includes(selectedFood._id)}
                    />
                )}
            </ChakraProvider>
        </div>
    );
};

export default Explore;
