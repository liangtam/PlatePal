import React, { createContext, useContext, useEffect, useState } from "react";
import { Box, ChakraProvider, Flex, Wrap, WrapItem, TagLabel, TagCloseButton, Tag, } from "@chakra-ui/react";
import {
  DislikedRecipes,
  FoodPreferences,
  RecipeDetail,
  RecipeSnippet,
  ResponseMessage,
  SearchBar,
} from "../../components";
import homeImg from "../../assets/455-home.png";
import landingImg from "../../assets/455-landing-bg.png";
import homeErrorImg from "../../assets/455-home-error.png";
import homeLoadingImg from "../../assets/455-home-loading.png";
import "./Home.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteRecipe, setRecipes } from "../../redux/recipes/recipesSlice";
import { setUserRecipes } from "../../redux/users/userSlice";
import api from "../../api";
import { IngredientsContext } from "../../components/context/IngredientsContext";
import Allergies from "../../components/Allergies/Allergies";
import { AllergiesContext } from "../../components/context/AllergiesContext";
import { DislikedRecipesContext } from "../../components/context/DislikedRecipesContext";
import { FoodPreferencesContext } from "../../components/context/FoodPreferencesContext";
import { MessageType } from "../../constants/constants";

const Home = () => {
  const recipeData = useSelector((state) => state.recipes.value);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorGenerating, setErrorGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { ingredients, setIngredients } = useContext(IngredientsContext);
  const [isGenerating, setIsGenerating] = useState(false);
  const { allergies, setAllergies } = useContext(AllergiesContext);
  const [ defaultIngredients, setDefaultIngredients ] = useState([]);
  const { dislikedRecipes, setDislikedRecipes } = useContext(
    DislikedRecipesContext
  );
  const { preferences, setPreferences } = useContext(FoodPreferencesContext);

  const fetchUser = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      if (response.status >= 200 && response.status < 300) {
        dispatch(setUserRecipes(response.data.recipes));
        setAllergies(response.data.allergies || []);
        setDislikedRecipes(response.data.dislikedRecipes || []);
        setDefaultIngredients(response.data.defaultIngredients || []);
        if (response.data.preferences) {
          setPreferences(response.data.preferences);
        }
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

  const showErrorMessage = (message) => {
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
    setErrorMessage(message);
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
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
    setErrorGenerating(false);
    const ingredientList = ingredients.concat(defaultIngredients);
    try {
      const response = await api.get("/recipes/generate", {
        params: {
          ingredients: ingredientList,
          allergies: allergies,
          dislikedRecipes: dislikedRecipes,
          preferences: preferences,
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
      setErrorGenerating(true);
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

  const handleSaveAllergies = async () => {
    setIsLoading(true);
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
      showSuccessMessage("Saved allergies/disliked ingredients!");
      setIsLoading(false);
    } catch (err) {
      showErrorMessage(`Error occurred updating allergies:  ${err.message}`);
      setIsLoading(false);
    }
  };

  const handleSaveDislikedRecipes = async () => {
    setIsLoading(true);
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
      showSuccessMessage("Saved disliked recipes!");
      setIsLoading(false);
    } catch (err) {
      showErrorMessage(
        `Error occurred updating disliked recipes:  ${err.message}`
      );
      setIsLoading(false);
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    console.log({ preferences });
    try {
      const response = await api.patch(
        "/users/" + user.id,
        { preferences },
        {
          headers: {
            "auth-token": localStorage.getItem("authToken"),
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      showSuccessMessage("Saved food preference settings!");
      setIsLoading(false);
    } catch (err) {
      showErrorMessage(
        `Error occurred updating user preferences:  ${err.message}`
      );
      setIsLoading(false);
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
    <ChakraProvider>
      <div
        className="flex-col align-items-center bg-base-100 padT-4 h-100"
        style={{ height: "90vh" }}
      >
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
                <Wrap mt={0} pb={3} className="tag-container">
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
                {recipeData.length === 0 && !isGenerating && !errorGenerating && (
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
                        available ingredients! Adjust your preferences below.
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
                {recipeData.length === 0 && isGenerating && !errorGenerating && (
                  <Box className="dialog-container">
                    <img
                      src={homeLoadingImg}
                      alt="plate pal"
                      className="landing-image"
                    />
                    <div className="dialog-text">
                      <b>Generating recipes with ingredients </b>
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
                    </div>
                  </Box>
                )}
                                {recipeData.length === 0 && !isGenerating && errorGenerating && (
                  <Box className="dialog-container">
                    <img
                      src={homeErrorImg}
                      alt="plate pal"
                      className="landing-image"
                    />
                    <div className="dialog-text">
                      <b>Error generating recipes. Please try again.</b>
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
                    </div>
                  </Box>
                )}
              </Flex>
              <Wrap justify={"center"} overflowY={"scroll"} maxHeight={"600px"}>
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
            <FoodPreferences handleSave={handleSavePreferences} />
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
            {isLoading && <div>Saving...</div>}
            {successMessage && (
              <ResponseMessage
                type={MessageType.SUCCESS}
                message={successMessage}
              />
            )}
            {errorMessage && (
              <ResponseMessage
                type={MessageType.ERROR}
                message={errorMessage}
              />
            )}
            {allergies && (
              <div className="flex-col gap-2">
                <Allergies handleSave={handleSaveAllergies} />
              </div>
            )}
            {dislikedRecipes && (
              <DislikedRecipes handleSave={handleSaveDislikedRecipes} />
            )}
          </Flex>
        </Flex>
      </div>
    </ChakraProvider>
  );
};

export default Home;
