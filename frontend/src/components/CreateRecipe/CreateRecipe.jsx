import React, { useState } from "react";
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

const CreateRecipe = ({ onCreate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleCreate = () => {
    const newRecipe = {
      name,
      ingredients: ingredients.split("\n"),
      instructions: instructions.split("\n"),
    };
    onCreate(newRecipe);
    onClose();
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
