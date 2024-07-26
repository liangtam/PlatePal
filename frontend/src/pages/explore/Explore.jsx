import React, { useContext, useEffect, useState } from "react";
import { Box, ChakraProvider, Flex, Text, Button, Home, CardFooter, CardBody, IconButton, Avatar, Heading, Card, CardHeader, Image } from "@chakra-ui/react";
import { BiLike, BiShare} from "react-icons/bi";

import { RecipeDetail, RecipeSnippet, SearchBar } from "../../components";
// import {
//   dummyRecipe1,
//   dummyRecipe2,
//   dummyRecipe3,
//   dummyRecipe4,
// } from "../../constants/dummyData";
import landingImg from "../../assets/455-landing-bg.png";
import { useDispatch, useSelector } from "react-redux";
import { deleteRecipe, setRecipes } from "../../redux/recipes/recipesSlice";
import { setUserRecipes } from "../../redux/users/userSlice";
import api from "../../api";
import './Explore.css';
import { IngredientsContext } from "../../components/context/IngredientsContext";

const Explore = () => {
    // test food data
    //   const foodData = [dummyRecipe1, dummyRecipe2, dummyRecipe3, dummyRecipe4];
    const dispatch = useDispatch();

    const fetchUserRecipes = async (userId) => {
        try {
          const response = await api.get(`/users/recipes/${userId}`);
          if (response.status >= 200 && response.status < 300) {
            dispatch(setUserRecipes(response.data));
          } else {
            console.error(
              "Request was not successful. Status code:",
              response.status
            );
            dispatch(setUserRecipes([]));
          }
        } catch (error) {
          console.error("An error occurred:", error);
          dispatch(setUserRecipes([]));
        }
      };

    


    return (
        <div className="bg-radial">
            <ChakraProvider>
                <Card maxW='md'>
                    <CardHeader>
                        <Flex spacing='4'>
                            <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                              

                                <Box>
                                    <Heading size='sm'>Segun Adebayo</Heading>
                                    <Text>Creator, Chakra UI</Text>
                                </Box>
                            </Flex>
                            {/* <IconButton
                                variant='ghost'
                                colorScheme='gray'
                                aria-label='See menu'
                                icon={<BsThreeDotsVertical />}
                            /> */}
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <Text>
                            With Chakra UI, I wanted to sync the speed of development with the speed
                            of design. I wanted the developer to be just as excited as the designer to
                            create a screen.
                        </Text>
                    </CardBody>
                    <Image
                        objectFit='cover'
                        src='https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                        alt='Chakra UI'
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
                        <Button flex='1' variant='ghost' leftIcon={<BiShare />}>
                            Share
                        </Button>
                    </CardFooter>
                </Card>
            </ChakraProvider>
        </div>
    );
};

export default Explore;
