import React, {useEffect, useState} from 'react';
import {Box, ChakraProvider, Flex, Text} from '@chakra-ui/react';
import {RecipeDetail, RecipeSnippet, SearchBar} from "../../components";
import {dummyRecipe1, dummyRecipe2, dummyRecipe3, dummyRecipe4} from '../../constants/dummyData';
import landingImg from "../../assets/455-landing-bg.png";
import './Home.css';
import {useDispatch, useSelector} from 'react-redux';
import {deleteRecipe, setRecipes} from '../../redux/recipes/recipesSlice';
import {setUserRecipes} from '../../redux/users/userSlice';
import api from "../../api";

const Home = () => {
    // test food data
    const foodData = [
        dummyRecipe1,
        dummyRecipe2,
        dummyRecipe3,
        dummyRecipe4
    ];

    const fetchUserRecipes = async () => {
        try {
            const response = await api.get(`/users/recipes/${user.id}`);
            if (response.status >= 200 && response.status < 300) {
                dispatch(setUserRecipes(response.data));
            } else {
                console.error('Request was not successful. Status code:', response.status);
                dispatch(setUserRecipes([]));
            }
        } catch (error) {
            console.error('An error occurred:', error);
            dispatch(setUserRecipes([]));
        }
    };

    const recipeData = useSelector((state) => state.recipes.value);
    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    // const [recipeData, setRecipeData] = useState([]);
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
            dispatch(setRecipes(foodData))
            // alert('Recipe generated!');

        }, 5000);
    }

    const handleRecipeSave = async (e, recipe) => {
        e.stopPropagation();
        try {
            const authToken = localStorage.getItem('authToken');
            console.log('Auth token:', authToken);
            const response = await api.post('/recipes/',
                {...recipe, userId: user.id},
                {
                    headers: {
                        'auth-token': authToken
                    }
                }
            );
            if (response.status === 201) {
                alert('Successfully added');
            } else {
                alert(response.data.error);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status >= 400 && error.response.status < 500) {
                    alert(error.response.data.error || 'An error occurred.');
                } else {
                    alert('Internal Server Error');
                }
            } else {
                alert('Network error or server is not reachable.');
            }
        }
        dispatch(deleteRecipe(recipe._id))
    }

    const handleDislike = (e, recipe) => {
        e.stopPropagation();
        dispatch(deleteRecipe(recipe._id));
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
            setIngredients([...ingredients, inputValue.trim()]);
            setInputValue('');
        }
    };

    useEffect(() => {
        fetchUserRecipes();
    }, [])

    return (
        <ChakraProvider>
            <SearchBar handleGenerateRecipe={handleGenerateRecipe} isGenerating={isGenerating}/>
            <Flex wrap="wrap" justify="center">
                {recipeData.length === 0 &&
                    <Box className="dialog-container">
                        <Text className="dialog-text animated-text">Let PlatePal help you get a recipe by entering your
                            available ingredients!</Text>
                        <img src={landingImg} alt="plate pal" className="landing-image"/>
                    </Box>
                }
                {recipeData && recipeData.map((recipe, index) => (
                    <RecipeSnippet key={index} recipe={recipe} onClick={() => handleCardClick(recipe)}
                                   handleSave={(e) => handleRecipeSave(e, recipe)}
                                   handleDislike={(e) => handleDislike(e, recipe)}
                                   handleClose={handleModalClose}/>
                ))}
            </Flex>
            {selectedFood &&
                <RecipeDetail selectFood={selectedFood} isModalOpen={isModalOpen} handleClose={handleModalClose}/>}
        </ChakraProvider>
    );
}

export default Home;
