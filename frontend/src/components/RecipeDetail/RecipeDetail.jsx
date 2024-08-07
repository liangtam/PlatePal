import React from 'react';
import {
    Box,
    Button,
    Checkbox,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text
} from '@chakra-ui/react';
import './RecipeDetail.css';

const RecipeDetail = ({selectFood, isModalOpen, handleClose}) => {
    const ingredients = selectFood.ingredients;
    const instructions = selectFood.instructions;

    return (
        <div>
            <Modal isOpen={isModalOpen} onClose={handleClose}>
                <ModalOverlay/>
                <ModalContent className="modal-content">
                    <ModalHeader className="modal-header bg-blue-400">{selectFood.name}</ModalHeader>
                    <ModalCloseButton/>
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
                                    instruction &&
                                    <Checkbox key={index} colorScheme="orange">{instruction.trim()}</Checkbox>
                                ))}
                            </Stack>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={handleClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default RecipeDetail;
