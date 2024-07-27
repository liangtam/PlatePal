import React, { useContext, useState } from 'react';
import { ChakraProvider, Box, Input, Tag, TagLabel, TagCloseButton, Wrap, WrapItem, InputGroup, Button, InputLeftElement } from '@chakra-ui/react';
import loadingCook from '../../assets/loadingCook.gif'
import './InputBar.css';
import { AllergiesContext } from '../context/AllergiesContext';

function AllergiesInputBar({handleGenerateRecipe, isGenerating}) {
    const [inputValue, setInputValue] = useState('');
    const {allergies, setAllergies} = useContext(AllergiesContext);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
            setAllergies([...allergies, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleAddAllergy = () => {
        setAllergies([...allergies, inputValue.trim()]);
        setInputValue('');
    };

    const handleTagClose = (allergyToRemove) => {
        setAllergies(allergies.filter(allergy => allergy !== allergyToRemove));
    };


    return (
        <ChakraProvider>
            <Box className="w-100">
                <InputGroup className="inputBar marY-3 gap-2">
                    <Input
                        placeholder="Add allergy"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="search-input"
                    />

                            <Button
                                colorScheme="blue"
                                onClick={handleAddAllergy}
                                className="generate-button"
                            >
                                +
                            </Button>
                       
                </InputGroup>
                    <div className='flex-row allergies gap-2'>
                    {allergies.map((allergy, index) => (
                        <WrapItem key={index} >
                            <Tag
                                size="lg"
                                className="tag"
                            >
                                <TagLabel>{allergy}</TagLabel>
                                <TagCloseButton
                                    onClick={() => handleTagClose(allergy)}
                                    className="tag-close-button"
                                />
                            </Tag>
                        </WrapItem>
                    ))}
                    </div>
            </Box>
        </ChakraProvider>
    );
}

export default AllergiesInputBar;
