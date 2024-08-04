import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  ChakraProvider,
  Flex,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import {
  DislikedRecipes,
  FoodPreferences,
  RecipeDetail,
  RecipeSnippet,
  SearchBar,
} from "../../components";
import homeImg from "../../assets/455-home.png";
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
  const { ingredients, setIngredients } = useContext(IngredientsContext);
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
          dislikedRecipes: dislikedRecipes,
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
      console.log(response.data);
    } catch (err) {
      alert("Error occurred updating disliked recipes: ", err.message);
    }
  };

  const handleTagClose = (ingredientToRemove) => {
    setIngredients(
      ingredients.filter((ingredient) => ingredient !== ingredientToRemove)
    );
  };

  useEffect(() => {
    if (user) {
      fetchUser(user.id);
    }
  }, []);

  return (
    <div
      className="flex-col align-items-center bg-base-100 padT-4"
      style={{ height: "100vh" }}
    >
      <ChakraProvider>
        <Flex style={{ width: "85%" }} className="home-container">
          <Flex direction="column">
            <Flex
              direction="column"
              className="generate-container bg-radial soft-light-shadow"
              justify={"flex-end"}
            >
              <SearchBar
                handleGenerateRecipe={handleGenerateRecipe}
                isGenerating={isGenerating}
              />
              {recipeData && recipeData.length > 0 && (
                <Wrap mt={4} className="tag-container">
                  {ingredients.map((ingredient, index) => (
                    <WrapItem key={index}>
                      <Tag size="lg" borderRadius="full" className="tag">
                        <TagLabel>{ingredient}</TagLabel>
                        <TagCloseButton
                          onClick={() => handleTagClose(ingredient)}
                          className="tag-close-button"
                        />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              )}
              <Flex wrap="wrap" justify="center">
                {recipeData.length === 0 && (
                  <Box className="dialog-container">
                    {!ingredients || ingredients.length === 0 ? (
                      <img
                        src={landingImg}
                        alt="plate pal"
                        className="landing-image"
                      />
                    ) : (
                      <img
                        src={homeImg}
                        alt="plate pal"
                        className="landing-image"
                      />
                    )}
                    {!ingredients || ingredients.length === 0 ? (
                      <div className="dialog-text animated-text ">
                        Let PlatePal help you get a recipe by entering your
                        available ingredients!
                      </div>
                    ) : (
                      <div className="dialog-text">
                        <b>
                          You've entered {ingredients.length} ingredient
                          {ingredients.length > 1 ? "s" : ""}:
                        </b>
                        <Wrap mt={4} className="tag-container">
                          {ingredients.map((ingredient, index) => (
                            <WrapItem key={index}>
                              <Tag
                                size="lg"
                                borderRadius="full"
                                className="tag"
                              >
                                <TagLabel>{ingredient}</TagLabel>
                                <TagCloseButton
                                  onClick={() => handleTagClose(ingredient)}
                                  className="tag-close-button"
                                />
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </div>
                    )}
                  </Box>
                )}
              </Flex>
              <Wrap justify={"center"}>
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
              </Wrap>
              {selectedFood && (
                <RecipeDetail
                  selectFood={selectedFood}
                  isModalOpen={isModalOpen}
                  handleClose={handleModalClose}
                />
              )}
            </Flex>
           <FoodPreferences/>
          </Flex>
          <Flex direction="column" style={{ width: "30%" }} gap={4}>
            <div className="warningInfo pad-3 soft-light-shadow">
              Recipes that contain the following allergies or is any one of the
              disliked recipes will not show up. {`\n`}
              <b>
                Warning: Please still double check the ingredients in case of AI
                error.
              </b>
            </div>
            {allergies && <div className="flex-col gap-2">
              <Allergies handleSave={handleSaveAllergies} />
              </div>}
            {dislikedRecipes && (
              <DislikedRecipes handleSave={handleSaveDislikedRecipes} />
            )}
          </Flex>
        </Flex>
      </ChakraProvider>
    </div>
  );
};

export default Home;
