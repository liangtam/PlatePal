import React, { useState } from 'react';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import { RecipeSnippet, RecipeDetail, SearchBar } from "../../components";

const SearchRecipe = () => {
    // test food data 
    const foodData = [
        { name: 'Pizza', image: 'https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg', ingredients:'salt, pepper', instructions:'put pizza in the oven' },
        { name: 'Chicken Caesar Salad', image: 'https://www.eatingwell.com/thmb/rmLlvSjdnJCCy_7iqqj3x7XS72c=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/chopped-power-salad-with-chicken-0ad93f1931524a679c0f8854d74e6e57.jpg', ingredients:'salt, pepper, chicken', instructions:'defroze chicken'  },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleCardClick = (food) => {
        setSelectedFood(food);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
          setIngredients([...ingredients, inputValue.trim()]);
          setInputValue('');
        }
    };

    return (
        <ChakraProvider>
            <SearchBar />
            <Flex justify="center" align="center" wrap="wrap" gap={6}>
            {foodData && foodData.map((recipe, index) => (
                <RecipeSnippet key={index} recipe={recipe} onClick={() => handleCardClick(recipe)} handleClose={handleModalClose} />
            ))}
            </Flex>
            {selectedFood && <RecipeDetail selectFood={selectedFood} isModalOpen={isModalOpen} handleClose={handleModalClose} />}
        </ChakraProvider>
    );
}

export default SearchRecipe;
