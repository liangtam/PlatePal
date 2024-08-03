import {
  ChakraProvider,
  Box,
  Flex,
  Button,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import styles from "./DislikedRecipes.module.css";
import { useContext } from "react";
import { DislikedRecipesContext } from "../context/DislikedRecipesContext";

const DislikedRecipes = ({ handleSave }) => {
  const { dislikedRecipes, setDislikedRecipes } = useContext(
    DislikedRecipesContext
  );

  const handleRemoveRecipe = (dislikedRecipeToRemove) => {
    setDislikedRecipes(
      dislikedRecipes.filter(
        (dislikedRecipe) => dislikedRecipe !== dislikedRecipeToRemove
      )
    );
  };

  return (
    <ChakraProvider>
      <Flex
        className={`${styles.container} justify-content-between align-items-between soft-light-shadow`}
        direction="column"
      >
        <b className={styles.title}>Disliked Recipes</b>
        <div className="flex-col pad-3">
          {!dislikedRecipes || dislikedRecipes.length === 0 ? (
            <div>No disliked recipes. You can dislike generated recipes via the "I don't like it" button.</div>
          ): (
            <div className="flex-col gap-2">
            {dislikedRecipes.map((recipeName) => {
              return (
                <Tag className={styles.dislikedRecipe} style={{background: "white"}}>
                  <TagLabel>{recipeName}</TagLabel>
                  <TagCloseButton
                    onClick={() => handleRemoveRecipe(recipeName)}
                    className={styles.closeButton}
                  />
                </Tag>
              );
            })}
          </div>
          )}
        
        <Flex justify="flex-end" className="marT-3">
          <button onClick={handleSave} className={`${styles.btn} padY-2 padX-3 radius-5 yellow-400 font-weight-500`}>Save</button>
        </Flex>
        </div>
        
      </Flex>
    </ChakraProvider>
  );
};

export default DislikedRecipes;
