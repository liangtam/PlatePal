import React from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text, Box, Image } from '@chakra-ui/react';

const RecipeDetail = ({ selectFood, isModalOpen, handleClose }) => {

    return (
        <div>
            <Modal isOpen={isModalOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectFood.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            <Image
                                src={selectFood.image}
                                borderRadius="md"
                                mb={4}
                            />
                            <Text fontWeight="bold">Ingredients:</Text>
                            <Text mb={2}>- {selectFood.ingredients}</Text>

                            <Text fontWeight="bold">Instructions:</Text>
                            <Text mb={2}>{selectFood.instructions}</Text>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default RecipeDetail;
