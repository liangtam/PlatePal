import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../api";
import './Explore.css';
import { ChakraProvider, Flex, Box, Text, Button, Image } from "@chakra-ui/react";
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const Explore = () => {
    const [recipes, setRecipes] = useState([]);
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useSelector((state) => state.user.value);
    const [processingFavorites, setProcessingFavorites] = useState({});

    useEffect(() => {
        fetchAllRecipes();
        fetchFavoriteRecipes();

        socket.on('favoriteUpdate', ({ recipeId, favoriteCount }) => {
            console.log(`Received update for recipe ${recipeId}: new count ${favoriteCount}`);
            setRecipes((prevRecipes) =>
                prevRecipes.map((recipe) =>
                    recipe._id === recipeId ? { ...recipe, favoriteCount } : recipe
                )
            );
        });

        return () => {
            socket.off('favoriteUpdate');
        };
    }, [user?.id]);

    const fetchAllRecipes = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/recipes/all');
            setRecipes(response.data);
        } catch (error) {
            console.error("Error fetching recipes:", error);
            setError("Failed to fetch recipes. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFavoriteRecipes = async () => {
        if (!user) {
            return;
        }
        try {
            const response = await api.get(`/users/favorites/${user.id}`,
                {headers: {'auth-token': localStorage.getItem('authToken')}});
            setFavoriteRecipes(response.data);
        } catch (error) {
            console.error("Error fetching favorite recipes:", error);
        }
    };

    const handleFavorite = async (recipeId) => {
        if (processingFavorites[recipeId]) {
            return; // prevent spam clicking
        }
        try {
            setProcessingFavorites(prev => ({ ...prev, [recipeId]: true }));
            // Optimistic update
            if (favoriteRecipes.includes(recipeId)) {
                setFavoriteRecipes(prev => prev.filter(id => id !== recipeId));
                setRecipes(prev => prev.map(recipe =>
                    recipe._id === recipeId ? { ...recipe, favoriteCount: recipe.favoriteCount - 1 } : recipe
                ));
            } else {
                setFavoriteRecipes(prev => [...prev, recipeId]);
                setRecipes(prev => prev.map(recipe =>
                    recipe._id === recipeId ? { ...recipe, favoriteCount: recipe.favoriteCount + 1 } : recipe
                ));
            }

            // API call
            await api.post('/users/favorite', {userId: user.id, recipeId: recipeId},
                {headers: {'auth-token': localStorage.getItem('authToken')}});

            // The server will emit the update via socket.io, so we don't need to update the state here again
        } catch (error) {
            console.error("Error favoriting recipe:", error);
            // Revert the optimistic update if the API call fails
            fetchFavoriteRecipes();
            fetchAllRecipes();
        } finally {
            setProcessingFavorites(prev => ({ ...prev, [recipeId]: false }));
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="bg-radial">
            <ChakraProvider>
                <Flex wrap="wrap" justify="center">
                    {recipes.map((recipe) => (
                        <Box key={recipe._id} m={4} p={4} borderWidth={1} borderRadius="lg">
                            <Text fontSize="xl">{recipe.name}</Text>
                            {recipe.image && (
                                <Image
                                    src={recipe.image}
                                    alt={recipe.name}
                                    borderRadius="lg"
                                    mb={4}
                                    objectFit="cover"
                                    w="100%"
                                    h="200px"
                                />
                            )}
                            <Text>Favorites: {recipe.favoriteCount}</Text>
                            {user && <Button onClick={() => handleFavorite(recipe._id)}>
                                {favoriteRecipes.includes(recipe._id) ? 'Unfavorite' : 'Favorite'}
                            </Button>}
                        </Box>
                    ))}
                </Flex>
            </ChakraProvider>
        </div>
    );
};

export default Explore;
