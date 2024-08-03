import React, { useState, useCallback } from "react";
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
import saltIcon from '../../assets/saltIcon.png'
import { useDropzone } from 'react-dropzone';
import api from "../../api";

const AddDefaultIngredient = ({ fetchingData, setFetchingData, user }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [seasonings, setSeasonings] = useState(user.defaultIngredients ?? [""]);
    const { userId } = useParams();

    const handleUpdateSeasoning = async () => {
        const filteredSeasoning = seasonings.filter(item => item.trim() !== "");
        try {
            const response = await api.patch(
              "/users/" + userId,
              { defaultIngredients: filteredSeasoning },
              {
                headers: {
                  "auth-token": localStorage.getItem("authToken"),
                  "Content-Type": "application/json",
                },
              }
            );
            setFetchingData(!fetchingData);
            onClose();
          } catch (err) {
            alert("Error occurred updating allergies: ", err.message);
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

    return (
        <ChakraProvider>
            <Button onClick={onOpen} w="100%" p={3} my={5} border="1px solid grey" borderRadius="25px">
                <img  width="30px" p={3} my={5} src={saltIcon}></img>
                Add Seasoning
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent className="modal-content">
                    <ModalHeader className="modal-header">Create Recipe</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        <FormControl mt={4} isRequired>
                            <FormLabel>Seasoning</FormLabel>
                            <VStack spacing={2}>
                                {seasonings.map((seasoning, index) => (
                                    <HStack key={index} spacing={2} width="100%">
                                        <Input
                                            placeholder={`e.g.'Salt'`}
                                            value={seasoning}
                                            onChange={(e) => handleInputChange(index, e.target.value, setSeasonings, seasonings)}
                                        />
                                        <IconButton
                                            icon={<MinusIcon />}
                                            onClick={() => removeField(index, setSeasonings, seasonings)}
                                            isDisabled={seasonings.length === 1}
                                            aria-label={"Remove Ingredient"}/>
                                    </HStack>
                                ))}
                                <Button onClick={() => addField(setSeasonings, seasonings)} leftIcon={<AddIcon />}>
                                    Add Seasoning
                                </Button>
                            </VStack>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleUpdateSeasoning}>
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </ChakraProvider>
    );
};

export default AddDefaultIngredient;
