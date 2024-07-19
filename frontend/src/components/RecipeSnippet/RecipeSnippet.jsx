import React from 'react';
import { Flex, Box, ChakraProvider, Card, CardBody, CardFooter, Image, Stack, Heading, Text, Divider, ButtonGroup, Button } from '@chakra-ui/react'
import './RecipeSnippet.css'
import { useDispatch, useSelector } from 'react-redux';

const RecipeSnippet = ({ recipe, onClick, handleSave, handleDislike }) => {

    return (
        <ChakraProvider>
        <Box className="card-container" onClick={() => onClick()}>
            <Card maxW='sm'>
                {recipe && <CardBody>
                    <Image
                        src={recipe.image}
                        className="card-image"
                        borderRadius='lg'
                    />
                    <Stack mt='6' spacing='3'>
                        <Heading size='md'>{recipe.name}</Heading>
                        <Text>
                            Estimated cooking time: {recipe.estimatedTime} mins
                        </Text>
                    </Stack>
                </CardBody>}
                <Divider />
                <CardFooter>
                    <Flex justify="flex-end" w="100%">
                        <ButtonGroup spacing='2'>
                            <Button onClick={handleSave} variant='solid' className="save-button">
                                Save it
                            </Button>
                            <Button onClick={handleDislike} variant='ghost' colorScheme='orange' className="ghost-button">
                                I don't like it
                            </Button>
                        </ButtonGroup>
                    </Flex>
                </CardFooter>
            </Card>
        </Box>
    </ChakraProvider>
    );
}

export default RecipeSnippet;
