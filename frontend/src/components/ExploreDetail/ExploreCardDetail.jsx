import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalOverlay, Heading, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text, Box, Image, Checkbox, Stack } from '@chakra-ui/react';
import '../RecipeDetail/RecipeDetail.css';
import { BiLike, BiShare } from "react-icons/bi";
import api from "../../api";
import io from 'socket.io-client';

const ExploreCardDetail = ({ selectFood, isModalOpen, handleClose }) => {
    const ingredients = selectFood.ingredients;
    const instructions = selectFood.instructions;

    const [favoritesCount, setFavoritesCount] = useState(selectFood.favoriteCount || 0);
   const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const socket = io(process.env.REACT_APP_BACKEND_URL);
        // Listen for favorite updates
        socket.on('favoriteUpdate', (data) => {
            if (data.recipeId === selectFood._id) {
                setFavoritesCount(data.favoriteCount);
                setIsFavorite(!isFavorite);
            }
        });

        // Clean up on component unmount
        return () => {
            socket.off('favoriteUpdate');
        };
    }, [selectFood._id]);

    const handleFavorite = async () => {
        const authToken = localStorage.getItem('authToken');
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user ? user.id : null;

        if (!userId) {
            console.error('User not found in localStorage');
            return;
        }

        try {
            await api.post('/users/favorite', {
                userId,
                recipeId: selectFood._id
            }, {
                headers: {
                    'auth-token': authToken
                }
            });

            // Toggle the favorite state locally
        //  setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Error favoriting recipe:', error);
        }
    };

    return (
        <div>
            <Modal isOpen={isModalOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent className="modal-content">
                    <ModalHeader className="modal-header bg-blue-400">
                    <Heading size='sm'>{ selectFood.name}</Heading>
                    <Text>{"shared from:" + selectFood.userEmail}</Text>

                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            <Image
                                src={selectFood.image}
                                borderRadius="full"
                                mb={4}
                                className="animated-image"
                            />
                            <Text fontWeight="bold" mb={2} className="section-title">Ingredients:</Text>
                            <Stack spacing={1} mb={4} className="ingredient-list">
                                {ingredients.map((ingredient, index) => (
                                    <Checkbox key={index} colorScheme="green">{ingredient}</Checkbox>
                                ))}
                            </Stack>

                            <Text fontWeight="bold" mb={2} className="section-title">Instructions:</Text>
                            <Stack spacing={1} className="instruction-list">
                                {instructions.map((instruction, index) => (
                                    instruction && <Checkbox key={index} colorScheme="orange">{instruction.trim()}</Checkbox>
                                ))}
                            </Stack>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Text mr={3}>Favorites: {favoritesCount}</Text>
                        <Button colorScheme="orange" mr={3} onClick={handleClose}>
                            Close
                        </Button>
                        <Button leftIcon={<BiLike />} style={{color: 'white', backgroundColor: "rgb(86, 193, 255)"}} onClick={handleFavorite}>
                            {isFavorite ? 'Unfavorite' : 'Favorite'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default ExploreCardDetail;