import React from "react";
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    ChakraProvider,
    Divider,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
} from "@chakra-ui/react";
import "./RecipeSnippet.css";
import vegIcon from "../../assets/vegan_flaticon.png";
import lactoseFreeIcon from "../../assets/lactose-free_flaticon.png";
import spicyIcon from "../../assets/chili-pepper_flaticon.png";

const RecipeSnippet = ({recipe, onClick, handleSave, handleDislike}) => {
    return (
        <ChakraProvider>
            <Card maxW="sm" className="card-container" onClick={() => onClick()}>
                {recipe && (
                    <CardBody>
                        <Image
                            src={recipe.image}
                            className="card-image"
                            borderRadius="lg"
                        />
                        <Stack mt="4" align={'space-evenly'}>
                            <Heading size="md">{recipe.name}</Heading>
                            <Text>Estimated cooking time: {recipe.estimatedTime} mins</Text>
                            {recipe.foodProperties &&
                                (recipe.foodProperties.isVegan ||
                                    recipe.foodProperties.isSpicy ||
                                    recipe.foodProperties.isLactoseFree) && (
                                    <div className="w-100 flex-col align-items-center">
                                        <Flex
                                            className="recipe-snippet-properties "
                                            gap={4}
                                        >
                                            {recipe.foodProperties.isVegan && (
                                                <img
                                                    src={vegIcon}
                                                    className="recipe-snippet-icon"
                                                    aria-label="Vegan"
                                                />
                                            )}
                                            {recipe.foodProperties.isLactoseFree && (
                                                <img
                                                    src={lactoseFreeIcon}
                                                    className="recipe-snippet-icon"
                                                    aria-label="Lactose free"
                                                />
                                            )}
                                            {recipe.foodProperties.isSpicy && (
                                                <img
                                                    src={spicyIcon}
                                                    className="recipe-snippet-icon"
                                                    aria-label="spicy"
                                                />
                                            )}
                                        </Flex>
                                    </div>
                                )}
                        </Stack>
                    </CardBody>
                )}
                <Divider/>
                <CardFooter>
                    <Flex justify="flex-end" w="100%">
                        <ButtonGroup spacing="2">
                            <Button
                                onClick={handleSave}
                                variant="solid"
                                className="save-button"
                            >
                                Save it
                            </Button>
                            <Button
                                onClick={handleDislike}
                                variant="ghost"
                                colorScheme="orange"
                                className="ghost-button"
                            >
                                I don't like it
                            </Button>
                        </ButtonGroup>
                    </Flex>
                </CardFooter>
            </Card>
        </ChakraProvider>
    );
};

export default RecipeSnippet;
