import {createContext, useState} from "react";

export const DislikedRecipesContext = createContext();

export const DislikedRecipesContextProvider = ({children}) => {
    const [dislikedRecipes, setDislikedRecipes] = useState([]);
    console.log("dislikedRecipes:", dislikedRecipes);

    return (
        <DislikedRecipesContext.Provider value={{dislikedRecipes, setDislikedRecipes}}>
            {children}
        </DislikedRecipesContext.Provider>
    );
};
