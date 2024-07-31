import React, { useEffect, useState } from "react";
import { Box, ChakraProvider, Heading, Text, Image } from "@chakra-ui/react";
import { ExploreBox, ExploreCardDetail } from "../../components";
import api from "../../api";
import './Explore.css';
import whiteLogo from "../../assets/455-platepal-logo-white.png";
import io from 'socket.io-client';

const Explore = () => {
    const [fetchingData, setFetchingData] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [showCardDetail, setShowCardDetail] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);

    const handleCardClick = (food) => {
        setSelectedFood(food);
        setShowCardDetail(true);
    };

    const fetchUserRecipes = async () => {
        try {
            const response = await api.get('recipes/public');
            if (response.status >= 200 && response.status < 300) {
                console.log('Request was successful:', response.data);
                setRecipes(response.data);
            } else {
                alert("An error occurred")
            }
        } catch (err) {
            alert("Could not load user recipes.")
        }
    }

    useEffect(() => {
        fetchUserRecipes();

        const socket = io(process.env.REACT_APP_BACKEND_URL, {
            transports: ['websocket', 'polling'],
            secure: true,
            rejectUnauthorized: false,
            reconnection: true,
            reconnectionAttempts: 5
        });

        // Set up socket listener for new recipes
        socket.on('newRecipe', ({newRecipe}) => {
            console.log('Received new recipe:', newRecipe);
            setRecipes((prevRecipes) => [newRecipe, ...prevRecipes]);
        });

        // Clean up socket listener on component unmount
        return () => {
            socket.off('newRecipe');
        };
    }, [fetchingData]);

    console.log(recipes);
    console.log(selectedFood);

    return (
        <div className="bg-radial">
            <ChakraProvider>
                <Heading>
                    <Box>
                        <Image className="image" src={whiteLogo}></Image>
                        <Text color="white">Exploring Other users' Recipes...</Text>
                    </Box>
                </Heading>

                <div className="cards">
                    {recipes && recipes.map((recipe, index) => (
                        <ExploreBox
                            key={index}
                            recipe={recipe}
                            user={recipe}
                            onClick={() => handleCardClick(recipe)}
                        >
                        </ExploreBox>
                    ))}
                </div>
                {showCardDetail && (
                    <ExploreCardDetail selectFood={selectedFood} isModalOpen={showCardDetail} handleClose={()=>setShowCardDetail(false)}></ExploreCardDetail>
                )}
            </ChakraProvider>
        </div>
    );
};

export default Explore;
