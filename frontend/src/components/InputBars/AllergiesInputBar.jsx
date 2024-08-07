import React, {useContext, useState} from 'react';
import {Box, ChakraProvider, IconButton, Input, InputGroup} from '@chakra-ui/react';
import styles from './InputBar.module.css';
import {AddIcon} from '@chakra-ui/icons';
import {AllergiesContext} from '../context/AllergiesContext';

function AllergiesInputBar() {
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


    return (
        <ChakraProvider>
            <Box className="w-100">
                <InputGroup className={`${styles.inputBar} marY-3 gap-2`}>
                    <Input
                        placeholder="Add allergy"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className={styles.searchInput}
                        style={{background: 'white'}}
                    />

                    <IconButton icon={<AddIcon/>} onClick={handleAddAllergy} className={styles.addButton}/>

                </InputGroup>
            </Box>
        </ChakraProvider>
    );
}

export default AllergiesInputBar;
