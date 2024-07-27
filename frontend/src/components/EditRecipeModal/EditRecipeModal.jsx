import React, { useState, useCallback, useEffect } from "react";
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
    VStack,
    useDisclosure
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useDropzone } from 'react-dropzone';
import { updateUserRecipe } from "../../redux/users/userSlice";
import { useDispatch } from "react-redux";
import api from "../../api";

const EditRecipeModal = ({ recipe, isModalShow, setIsModalShow, fetchingData, setFetchingData }) => {
    const [name, setName] = useState(recipe.name);
    const dispatch = useDispatch();
    const [ingredients, setIngredients] = useState(recipe.ingredients);
    const [instructions, setInstructions] = useState(recipe.instructions);
    const [image, setImage] = useState(recipe.image);
    const [estimatedTime, setEstimatedTime] = useState(recipe.estimatedTime);
    const { userId } = useParams();


    const handleEditRecipe = async () => {
        const filteredIngredients = ingredients.filter(item => item.trim() !== "");
        const filteredInstructions = instructions.filter(item => item.trim() !== "");
        const formData = new FormData();
        formData.append("name", name);
        formData.append("ingredients", filteredIngredients);
        formData.append("instructions", filteredInstructions);
        if (image) {
            formData.append("image", image);
        }
        formData.append("userId", userId);
        formData.append("estimatedTime", Number(estimatedTime));
        const data = {
            name:  name,
            ingredients: filteredIngredients,
            instructions: filteredInstructions,
            userId: userId,
            estimatedTime: Number(estimatedTime)

        }

        try {
            const response = await api.patch('/recipes/' + recipe._id, data, {
                headers: {
                    'auth-token': localStorage.getItem('authToken'),
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                setFetchingData(!fetchingData);
                alert('Successfully updated');
                dispatch(updateUserRecipe(recipe._id));
                setIsModalShow(false);
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
    }

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

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length > 0) {
            setImage(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false
    });

    return (
        <ChakraProvider>


            <Modal isOpen={isModalShow} onClose={()=>setIsModalShow(false)}>
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

                        <FormControl mt={4} isRequired>
                            <FormLabel>Estimated Time (minutes)</FormLabel>
                            <Input
                                type="number"
                                placeholder="Estimated Time in minutes"
                                value={estimatedTime}
                                onChange={(e) => setEstimatedTime(e.target.value)}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Image</FormLabel>
                            <div {...getRootProps()} style={{ border: "1px dashed grey", padding: "20px", textAlign: "center" }}>
                                <input {...getInputProps()} />
                                {image ? (
                                    <p>{image}</p>
                                ) : (
                                    <p>Drag & drop an image here, or click to select one</p>
                                )}
                            </div>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleEditRecipe}>
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </ChakraProvider>
    );
};

export default EditRecipeModal;

