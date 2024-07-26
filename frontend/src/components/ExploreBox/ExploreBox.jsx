import React, { useContext, useEffect, useState } from "react";
import { Box, ChakraProvider, Flex, Text, Button, Home, CardFooter, CardBody, IconButton, Avatar, Heading, Card, Divider, ButtonGroup, CardHeader, Image, Stack, } from "@chakra-ui/react";
import { BiLike, BiShare } from "react-icons/bi";
import styles from "./ExploreBox.module.css";

const ExploreBox = ({ recipe, user, onClick, handleLike }) => {



    //TODO: call api calls to get user by id
    // const fetchShareRecipes = async (userId) => {
    //     try {
    //       const response = await api.get();
    //       if (response.status >= 200 && response.status < 300) {
    //        // dispatch(setUserRecipes(response.data));
    //       } else {
    //         console.error(
    //           "Request was not successful. Status code:",
    //           response.status
    //         );
    //         dispatch();
    //       }
    //     } catch (error) {
    //       console.error("An error occurred:", error);
    //       dispatch();
    //     }
    //   };


    return (
        <div className={`${styles.ExploreCard}`}>
            <ChakraProvider>
                {recipe && <Card maxW='sm' >
                    <CardHeader>
                        <Flex spacing='4'>
                            <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>


                                <Box>
                                    <Heading size='sm'>{user.name}</Heading>
                                </Box>
                            </Flex>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <Heading size='sm'>{recipe.name}</Heading>
                        <Text>
                            {/* {recipe.estimatedTime} */}
                        </Text>
                    </CardBody>
                    <Image
                        objectFit='cover'
                        src={recipe.image}
                    />

                    <CardFooter
                        justify='space-between'
                        flexWrap='wrap'
                        sx={{
                            '& > button': {
                                minW: '136px',
                            },
                        }}
                    >
                        <Button flex='1' variant='ghost' leftIcon={<BiLike />}>
                            Like
                        </Button>
                    </CardFooter>
                </Card>


                }

            </ChakraProvider>
        </div>
    );
};

export default ExploreBox;

