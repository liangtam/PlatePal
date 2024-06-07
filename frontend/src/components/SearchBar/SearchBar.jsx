import React, { useState } from 'react';
import { ChakraProvider, Box, Input, Tag, TagLabel, TagCloseButton, Wrap,  WrapItem,  InputGroup,  InputLeftElement
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

function SearchableIngredient() {
  const [inputValue, setInputValue] = useState('');
  const [ingredients, setIngredients] = useState([]);



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

  // sent api calls with ingredients
  //

  return (
    <ChakraProvider>
      <Box p={20}>
        <InputGroup>
          <InputLeftElement>
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Enter one ingredient and press Enter"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </InputGroup>
        <Wrap mt={4}>
          {ingredients.map((ingredient, index) => (
            <WrapItem key={index}>
              <Tag
                size="lg"
                borderRadius="full"
              >
                <TagLabel>{ingredient}</TagLabel>
                <TagCloseButton onClick={() => handleTagClose(ingredient)} />
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    </ChakraProvider>
  );
}

export default SearchableIngredient;
