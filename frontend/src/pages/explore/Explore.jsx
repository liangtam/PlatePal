import React, { useContext, useEffect, useState } from "react";
import { Box, ChakraProvider, Heading, Flex, Text, Button, Home, CardFooter, CardBody, IconButton, Avatar, Card, CardHeader, Image } from "@chakra-ui/react";
import { BiLike, BiShare} from "react-icons/bi";

import { RecipeDetail, RecipeSnippet, SearchBar, ExploreBox, ExploreCardDetail } from "../../components";
import {
  dummyRecipe1,
  dummyRecipe2,
  dummyRecipe3,
  dummyRecipe4,
} from "../../constants/dummyData";
import landingImg from "../../assets/455-landing-bg.png";
import { useDispatch, useSelector } from "react-redux";
import { deleteRecipe, setRecipes } from "../../redux/recipes/recipesSlice";
import { setUserRecipes } from "../../redux/users/userSlice";
import api from "../../api";
import './Explore.css';
import { IngredientsContext } from "../../components/context/IngredientsContext";
import whiteLogo from "../../assets/455-platepal-logo-white.png";

const Explore = () => {
    // test food data
    const foodData = [dummyRecipe1, dummyRecipe2, dummyRecipe3, dummyRecipe4];
    //const dispatch = useDispatch();
    //const recipes = foodData;
    const [fetchingData, setFetchingData] = useState(false);
    const [recipes, setRecipes] = useState(foodData);
    const [showCardDetail, setShowCardDetail] = useState(false);

    const [selectedFood, setSelectedFood] = useState(null);
    const user = {name: "TestUser"};
    //const [user, setUser] = useState({name: "TestUser"});

    const handleCardClick = (food) => {
        setSelectedFood(food);
        setShowCardDetail(true);
      };


    //TODO: call api calls to get recipes
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

    const fetchUserRecipes = async () => {
        try {
          const response = await api.get('recipes/all');
          if (response.status >= 200 && response.status < 300) {
            console.log('Request was successful:', response.data);
            setRecipes(response.data);
          } else {
              alert("An error occurred")
          }
        } catch (err) {
          alert("Could not load user recipes.")
        }
      }


      useEffect(() => {
        fetchUserRecipes();
      }, [fetchingData]);



    console.log(recipes);
    console.log(selectedFood);


    return (
        <div className="bg-radial">
            <ChakraProvider>
            
               
                <Heading>
                    <Box>
                    <Image className="image" src={whiteLogo}></Image>
                <Text color="white">Exploring Other users' Recipes...</Text>
                </Box>
                </Heading>
                
            <div className="cards">
            { recipes && recipes.map((recipe, index) => (
               // console.log(recipe);
                <ExploreBox
                key={index}
                recipe={recipe}
                user={recipe}
                onClick={() => handleCardClick(recipe)}
                //onClick=
               // handleLike={}
                >
                </ExploreBox>

            ))

            }
            </div>
            {showCardDetail && (
                <ExploreCardDetail selectFood={selectedFood} isModalOpen={showCardDetail} handleClose={()=>setShowCardDetail(false)}></ExploreCardDetail>
            )}
            </ChakraProvider>
         
        </div>
    );
};

export default Explore;
