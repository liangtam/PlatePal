import React, { useContext, useState } from 'react';
import { ChakraProvider, Box, Input, Tag, TagLabel, TagCloseButton, Wrap, WrapItem, InputGroup, Button } from '@chakra-ui/react';
import loadingCook from '../../assets/loadingCook.gif'
import './SearchBar.css';
import { IngredientsContext } from '../context/IngredientsContext';

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

    const handleTagClose = (ingredientToRemove) => {
        setIngredients(ingredients.filter(ingredient => ingredient !== ingredientToRemove));
    };

    return (
        <ChakraProvider>
            <Box className="search-bar-container">
                <InputGroup className="search-bar">
                    <Input
                        placeholder="Enter one ingredient and press Enter"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="search-input"
                    />
                    <Box ml={4}>
                        {isGenerating ? (
                            <img src={loadingCook} className="loading-gif" />
                        ) : (
                            <Button
                                colorScheme="orange"
                                onClick={handleGenerateRecipe}
                                className="generate-button"
                            >
                                Get Your Recipes
                            </Button>
                        )}
                    </Box>
                </InputGroup>
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
            </Box>
        </ChakraProvider>
    );
}

export default SearchBar;
