import React from 'react';
import { Flex, Box, ChakraProvider, Card, CardBody, CardFooter, Image, Stack, Heading, Text, Divider, ButtonGroup, Button } from '@chakra-ui/react'
import './RecipeSnippet.css'

const RecipeSnippet = ({ recipe, onClick }) => {

    return (
        <ChakraProvider>
        <Box className="card-container" onClick={() => onClick()}>
            <Card maxW='sm'>
                <CardBody>
                    <Image
                        src={recipe.image}
                        className="card-image"
                        borderRadius='lg'
                    />
                    <Stack mt='6' spacing='3'>
                        <Heading size='md'>{recipe.name}</Heading>
                        <Text>
                            PlaceHolder
                        </Text>
                    </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                    <Flex justify="flex-end" w="100%">
                        <ButtonGroup spacing='2'>
                            <Button onClick={() => onClick()} variant='solid' className="save-button">
                                Save it
                            </Button>
                            <Button variant='ghost' colorScheme='orange' className="ghost-button">
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
