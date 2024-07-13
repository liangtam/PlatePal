import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  ChakraProvider,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure
} from "@chakra-ui/react";
import api from "../../api";


const CreateRecipe = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const userId = useParams('userId').userId;

  const handleCreate = async () => {
    try {
      const response = await api.post('/recipes/', {name, ingredients, instructions, userId});
      if (response.status === 201) {
          alert('Successfully created');
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
    setIngredients("");
    setInstructions("");
  };

  return (
    <>

<ChakraProvider>
      <Button onClick={onOpen} w="100%" p={3} my={5} border="1px solid grey" background="none" borderRadius="25px" disabled>
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
              <Textarea
                placeholder="Enter each ingredient on a new line"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Instructions</FormLabel>
              <Textarea
                placeholder="Enter each instruction on a new line"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
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
