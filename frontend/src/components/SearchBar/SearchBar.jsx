import React, {useContext, useState} from 'react';
import {Box, Button, ChakraProvider, Input, InputGroup} from '@chakra-ui/react';
import loadingCook from '../../assets/loadingCook.gif'
import './SearchBar.css';
import {IngredientsContext} from '../context/IngredientsContext';

function SearchBar({handleGenerateRecipe, isGenerating}) {
    const [inputValue, setInputValue] = useState('');
    const {ingredients, setIngredients} = useContext(IngredientsContext);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
            setIngredients([...ingredients, inputValue.trim()]);
            setInputValue('');
        }
    };

    return (
        <ChakraProvider>
            <Box className="search-bar-container">
                <InputGroup className="search-bar">
                    <Input
                        placeholder="Enter an ingredient and press 'enter' e.g. rice"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="search-input"
                    />
                    <Box ml={4}>
                        {isGenerating ? (
                            <img src={loadingCook} className="loading-gif"/>
                        ) : (
                            <Button
                                colorScheme="orange"
                                onClick={handleGenerateRecipe}
                                className="generate-button"
                                isDisabled={!ingredients || ingredients.length === 0}
                            >
                                Get Your Recipes
                            </Button>
                        )}
                    </Box>
                </InputGroup>
            </Box>
        </ChakraProvider>
    );
}

export default SearchBar;
