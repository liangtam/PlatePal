import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import api from "../../api";
import './Explore.css';
import {Box, Button, ChakraProvider, Flex, Text} from "@chakra-ui/react";
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // Replace with your server URL

const Explore = () => {
    const [recipes, setRecipes] = useState([]);
    const user = useSelector((state) => state.user.value);

    const fetchUserRecipes = async () => {
        try {
            const response = await api.get(`/recipes/all`);
            if (response.status >= 200 && response.status < 300) {
                setRecipes(response.data);
            } else {
                console.error("Request was not successful. Status code:", response.status);
                setRecipes([]);
            }
        } catch (error) {
            console.error("An error occurred:", error);
            setRecipes([]);
        }
    };

    useEffect(() => {
        fetchUserRecipes();

        // Listen for favorite updates
        socket.on('favoriteUpdate', ({recipeId, favoriteCount}) => {
            setRecipes(prevRecipes =>
                prevRecipes.map(recipe =>
                    recipe._id === recipeId ? {...recipe, favoriteCount} : recipe
                )
            );
        });

        return () => {
            socket.off('favoriteUpdate');
        };
    }, []);

    const handleFavorite = async (recipeId) => {
        try {
            await api.post('/users/favorite', {userId: user.id, recipeId},
                {
                    headers:
                        {
                            'auth-token': localStorage.getItem('authToken')
                        }
                });
            // The server will emit the update, so we don't need to update the state here
        } catch (error) {
            console.error("Error favoriting recipe:", error);
        }
    };

    return (
        <div className="bg-radial">
            <ChakraProvider>
                <Flex wrap="wrap" justify="center">
                    {recipes.map((recipe) => (
                        <Box key={recipe._id} m={4} p={4} borderWidth={1} borderRadius="lg">
                            <Text fontSize="xl">{recipe.name}</Text>
                            <Text>Favorites: {recipe.favoriteCount}</Text>
                            <Button onClick={() => handleFavorite(recipe._id)}>
                                {'Favorite'}
                            </Button>
                        </Box>
                    ))}
                </Flex>
            </ChakraProvider>
        </div>
    );
};

export default Explore;
