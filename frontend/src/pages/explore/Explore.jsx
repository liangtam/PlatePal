import React, { useContext, useEffect, useState } from "react";
import { Box, ChakraProvider, Flex, Text, Button, Home, CardFooter, CardBody, IconButton, Avatar, Heading, Card, CardHeader, Image } from "@chakra-ui/react";
import { BiLike, BiShare} from "react-icons/bi";

import { RecipeDetail, RecipeSnippet, SearchBar, ExploreBox } from "../../components";
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

const Explore = () => {
    // test food data
    const foodData = [dummyRecipe1, dummyRecipe2, dummyRecipe3, dummyRecipe4];
    //const dispatch = useDispatch();
    const recipes = foodData;
    //const [recipes, setRecipes] = useState(foodData);
    const user = {name: "TestUser"};
    //const [user, setUser] = useState({name: "TestUser"});


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

    console.log(recipes);


    return (
        <div className="bg-radial">
            { recipes && recipes.map((recipe, index) => (
               // console.log(recipe);
                <ExploreBox
                key={index}
                recipe={recipe}
                user={user}
                //onClick=
               // handleLike={}
                >
                </ExploreBox>

            ))

            }
         
        </div>
    );
};

export default Explore;
