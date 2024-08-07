import React, {useContext, useState} from 'react';
import {Box, ChakraProvider, IconButton, Input, InputGroup} from '@chakra-ui/react';
import styles from './InputBar.module.css';
import {AddIcon} from '@chakra-ui/icons';
import {DislikedRecipesContext} from '../context/DislikedRecipesContext';

function DislikedRecipesInputBar() {
    const [inputValue, setInputValue] = useState('');
    const {dislikedRecipes, setDislikedRecipes} = useContext(DislikedRecipesContext);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
            setDislikedRecipes([...dislikedRecipes, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleAddDislikedRecipes = () => {
        setDislikedRecipes([...dislikedRecipes, inputValue.trim()]);
        setInputValue('');
    };

    return (
        <ChakraProvider>
            <Box className="w-100">
                <InputGroup className={`${styles.inputBar} marY-3 gap-2`}>
                    <Input
                        placeholder="Add disliked recipe"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className={styles.searchInput}
                        style={{background: 'white'}}
                    />

                    <IconButton icon={<AddIcon/>} onClick={handleAddDislikedRecipes} className={styles.addButton}/>

                </InputGroup>
            </Box>
        </ChakraProvider>
    );
}

export default DislikedRecipesInputBar;
