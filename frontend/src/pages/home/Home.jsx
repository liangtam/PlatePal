import React, { useState } from 'react';
import { ChakraProvider, Flex, Box, Text } from '@chakra-ui/react';
import { RecipeSnippet, RecipeDetail, SearchBar } from "../../components";
import { dummyRecipe1, dummyRecipe2 } from '../../constants/dummyData';
import landingImg from "../../assets/455-landing-bg.png";
import './Home.css';

const Home = () => {
    // test food data 
    const foodData = [
        dummyRecipe1,
        dummyRecipe2
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [recipeData, setRecipeData] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleCardClick = (food) => {
        setSelectedFood(food);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleGenerateRecipe = () => {
        // 
        setIsGenerating(true);
        // Simulate an API call
        setTimeout(() => {
            //apiCall(ingredients)
            setIsGenerating(false);
            setRecipeData(foodData);
           // alert('Recipe generated!');
           
        }, 5000);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
          setIngredients([...ingredients, inputValue.trim()]);
          setInputValue('');
        }
    };

    return (
<ChakraProvider>
            <SearchBar handleGenerateRecipe={handleGenerateRecipe} isGenerating={isGenerating} />
            <Flex wrap="wrap" justify="center" >
                {recipeData.length === 0 &&  
                <Box className="dialog-container">
                    <Text className="dialog-text animated-text">Let PlatePal helping you getting a recipe by entering your available ingredients!</Text>
                    <img src={landingImg} alt="plate pal" className="landing-image" />
                </Box>
                }
                {recipeData && recipeData.map((recipe, index) => (
                    <RecipeSnippet key={index} recipe={recipe} onClick={() => handleCardClick(recipe)} handleClose={handleModalClose} />
                ))}
            </Flex>
            {selectedFood && <RecipeDetail selectFood={selectedFood} isModalOpen={isModalOpen} handleClose={handleModalClose} />}
        </ChakraProvider>
    );
}

export default Home;
