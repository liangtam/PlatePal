import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
    Button,
    ChakraProvider,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    IconButton,
    HStack,
    VStack, useDisclosure
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import api from "../../api";

const CreateRecipe = ({ fetchingData, setFetchingData }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState("");
    const [ingredients, setIngredients] = useState([""]);
    const [instructions, setInstructions] = useState([""]);
    const [image, setImage] = useState("");
    const {userId} = useParams();

    const handleCreate = async () => {
        const filteredIngredients = ingredients.filter(item => item.trim() !== "");
        const filteredInstructions = instructions.filter(item => item.trim() !== "");

        try {
            const response = await api.post('/recipes/',
                { name, ingredients: filteredIngredients, instructions: filteredInstructions, image, userId },
                {
                    headers: {
                        'auth-token': localStorage.getItem('authToken')
                    }
                }
            );
            if (response.status === 201) {
                alert('Successfully created');
                setFetchingData(!fetchingData);
                onClose();
            } else {
                alert(response.data.error);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status >= 400 && error.response.status < 500) {
                    alert(error.response.data.error || 'An error occurred.');
                } else {
                    alert('Internal Server Error');
                }
            } else {
                alert('Network error or server is not reachable.');
            }
        }
        setName("");
        setIngredients([""]);
        setInstructions([""]);
    };

    const handleInputChange = (index, value, setter, state) => {
        const newState = [...state];
        newState[index] = value;
        setter(newState);
    };

    const addField = (setter, state) => {
        setter([...state, ""]);
    };

    const removeField = (index, setter, state) => {
        if (state.length > 1) {
            const newState = state.filter((_, i) => i !== index);
            setter(newState);
        }
    };

    return (
        <>
            <ChakraProvider>
                <Button onClick={onOpen} w="100%" p={3} my={5} border="1px solid grey" borderRadius="25px">
                    Create Recipe
                </Button>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent className="modal-content">
                        <ModalHeader className="modal-header">Create Recipe</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl isRequired>
                                <FormLabel>Recipe Name</FormLabel>
                                <Input
                                    placeholder="Recipe Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </FormControl>

                            <FormControl mt={4} isRequired>
                                <FormLabel>Ingredients</FormLabel>
                                <VStack spacing={2}>
                                    {ingredients.map((ingredient, index) => (
                                        <HStack key={index} spacing={2} width="100%">
                                            <Input
                                                placeholder={`Ingredient ${index + 1}`}
                                                value={ingredient}
                                                onChange={(e) => handleInputChange(index, e.target.value, setIngredients, ingredients)}
                                            />
                                            <IconButton
                                                icon={<MinusIcon />}
                                                onClick={() => removeField(index, setIngredients, ingredients)}
                                                isDisabled={ingredients.length === 1}
                                                aria-label={"Remove Ingredient"}/>
                                        </HStack>
                                    ))}
                                    <Button onClick={() => addField(setIngredients, ingredients)} leftIcon={<AddIcon />}>
                                        Add Ingredient
                                    </Button>
                                </VStack>
                            </FormControl>

                            <FormControl mt={4} isRequired>
                                <FormLabel>Instructions</FormLabel>
                                <VStack spacing={2}>
                                    {instructions.map((instruction, index) => (
                                        <HStack key={index} spacing={2} width="100%">
                                            <Input
                                                placeholder={`Instruction ${index + 1}`}
                                                value={instruction}
                                                onChange={(e) => handleInputChange(index, e.target.value, setInstructions, instructions)}
                                            />
                                            <IconButton
                                                icon={<MinusIcon />}
                                                onClick={() => removeField(index, setInstructions, instructions)}
                                                isDisabled={instructions.length === 1}
                                                aria-label={'Remove Instruction'}/>
                                        </HStack>
                                    ))}
                                    <Button onClick={() => addField(setInstructions, instructions)} leftIcon={<AddIcon />}>
                                        Add Instruction
                                    </Button>
                                </VStack>
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Image</FormLabel>
                                <Input
                                    placeholder="URL to the recipe image"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                />
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme="blue" onClick={handleCreate}>
                                Create
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </ChakraProvider>
        </>
    );
};

export default CreateRecipe;
