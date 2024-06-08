import React, { useState } from 'react';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import { RecipeSnippet, RecipeDetail, SearchBar } from "../../components";
import { dummyRecipe1, dummyRecipe2 } from '../../constants/dummyData';

const Home = () => {
    // test food data 
    const foodData = [
        dummyRecipe1,
        dummyRecipe2
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

export default Home;
