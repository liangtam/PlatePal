import React from 'react';
import { Flex, Card, CardBody, CardFooter, Image, Stack, Heading, Text, Divider, ButtonGroup, Button } from '@chakra-ui/react'


const RecipeSnippet = ({ recipe, onClick }) => {

    return (
        <div>
            <Card maxW='sm' onClick={() => onClick()}>
                <CardBody>
                    <Image
                        src={recipe.image}
                        width={200}
                        height={200}
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
                <CardFooter >
                    <Flex justify="flex-end" w="100%">
                        <ButtonGroup spacing='2' >
                            <Button onClick={() => onClick()} variant='solid' colorScheme='blue'>
                                Save it
                            </Button>
                            <Button variant='ghost' colorScheme='blue'>
                                I don't like it
                            </Button>
                        </ButtonGroup>
                    </Flex>
                </CardFooter>
            </Card>
        </div>
    );
}

export default RecipeSnippet;
