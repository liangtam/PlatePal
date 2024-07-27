import React, { useContext, useEffect, useState } from "react";
import { Box, ChakraProvider, Flex, Text } from "@chakra-ui/react";
import {
  DislikedRecipes,
  RecipeDetail,
  RecipeSnippet,
  SearchBar,
} from "../../components";
import landingImg from "../../assets/455-landing-bg.png";
import "./Home.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteRecipe, setRecipes } from "../../redux/recipes/recipesSlice";
import { setUserRecipes } from "../../redux/users/userSlice";
import api from "../../api";
import { IngredientsContext } from "../../components/context/IngredientsContext";
import Allergies from "../../components/Allergies/Allergies";
import { AllergiesContext } from "../../components/context/AllergiesContext";
import { DislikedRecipesContext } from "../../components/context/DislikedRecipesContext";

const Home = () => {
  const recipeData = useSelector((state) => state.recipes.value);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const { ingredients } = useContext(IngredientsContext);
  const [isGenerating, setIsGenerating] = useState(false);
  const { allergies, setAllergies } = useContext(AllergiesContext);
  const { dislikedRecipes, setDislikedRecipes } = useContext(
    DislikedRecipesContext
  );

  const fetchUser = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      if (response.status >= 200 && response.status < 300) {
        dispatch(setUserRecipes(response.data.recipes));
        setAllergies(response.data.allergies || []);
        setDislikedRecipes(response.data.dislikedRecipes || []);
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

  const handleCardClick = (food) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleGenerateRecipe = async () => {
    setIsGenerating(true);
    try {
      const response = await api.get("/recipes/generate", {
        params: {
          ingredients: ingredients,
          allergies: allergies,
          dislikedRecipes: dislikedRecipes
        },
      });
      if (response.status >= 200 && response.status < 300) {
        dispatch(setRecipes(response.data));
        console.log(response.data);
      } else {
        alert("Error fetching recipes");
      }
      setIsGenerating(false);
    } catch (err) {
      alert("Error fetching recipes. Please try again.");
      setIsGenerating(false);
      console.log(err);
    }
  };

  const handleRecipeSave = async (e, recipe) => {
    e.stopPropagation();
    if (!user) {
      alert("Please log in");
      return;
    }
    try {
      const formData = new FormData();

      // Append all recipe data
      Object.keys(recipe).forEach((key) => {
        if (key !== "image") {
          formData.append(key, recipe[key]);
        }
      });

      formData.append("userId", user.id);

      // Fetch the image and append it to formData
      const imageResponse = await fetch(recipe.image);
      const imageBlob = await imageResponse.blob();
      formData.append("image", imageBlob, "recipe_image.jpg");

      const response = await api.post("/recipes/", formData, {
        headers: {
          "auth-token": localStorage.getItem("authToken"),
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        dispatch(deleteRecipe(recipe.generatedId));
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status >= 400 && error.response.status < 500) {
          alert(error.response.data.error || "An error occurred.");
        } else {
          alert("Internal Server Error");
        }
      } else {
        alert("Network error or server is not reachable.");
      }
    }
    dispatch(deleteRecipe(recipe._id));
  };

  const handleDislike = (e, recipe) => {
    e.stopPropagation();
    dispatch(deleteRecipe(recipe.generatedId));
    setDislikedRecipes([...dislikedRecipes, recipe.name]);
  };

  const handleSaveAllergies = async (e) => {
    try {
      const response = await api.patch(
        "/users/" + user.id,
        { allergies },
        {
          headers: {
            "auth-token": localStorage.getItem("authToken"),
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      alert("Error occurred updating allergies: ", err.message);
    }
  };

  
  const handleSaveDislikedRecipes = async (e) => {
    try {
      const response = await api.patch(
        "/users/" + user.id,
        { dislikedRecipes },
        {
          headers: {
            "auth-token": localStorage.getItem("authToken"),
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data)
    } catch (err) {
      alert("Error occurred updating disliked recipes: ", err.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser(user.id);
    }
  }, []);

  return (
    <div className="bg-radial flex-col align-items-center">
      <ChakraProvider>
        <Flex style={{ width: "85%" }} className="pad-3">
          <Flex direction="column" className="w-100">
            <SearchBar
              handleGenerateRecipe={handleGenerateRecipe}
              isGenerating={isGenerating}
            />
            <Flex wrap="wrap" justify="center">
              {recipeData.length === 0 && (
                <Box className="dialog-container">
                  <Text className="dialog-text animated-text">
                    Let PlatePal help you get a recipe by entering your
                    available ingredients!
                  </Text>
                  <img
                    src={landingImg}
                    alt="plate pal"
                    className="landing-image"
                  />
                </Box>
              )}
              {recipeData &&
                recipeData.map((recipe, index) => (
                  <RecipeSnippet
                    key={index}
                    recipe={recipe}
                    onClick={() => handleCardClick(recipe)}
                    handleSave={(e) => handleRecipeSave(e, recipe)}
                    handleDislike={(e) => handleDislike(e, recipe)}
                    handleClose={handleModalClose}
                  />
                ))}
            </Flex>
            {selectedFood && (
              <RecipeDetail
                selectFood={selectedFood}
                isModalOpen={isModalOpen}
                handleClose={handleModalClose}
              />
            )}
          </Flex>
          <Flex direction="column" style={{ width: "30%" }} gap={3} className="padT-4">
            <div className="warningInfo radius-5 pad-3">
              Recipes that contain the following allergies or is any one of the disliked recipes will not show up.
              <b> Warning: Please still double check the ingredients in case of AI error.</b>
            </div>
            {allergies && <Allergies handleSave={handleSaveAllergies}/>}
            {dislikedRecipes && <DislikedRecipes handleSave={handleSaveDislikedRecipes}/>}
          </Flex>
        </Flex>
      </ChakraProvider>
    </div>
  );
};

export default Home;
