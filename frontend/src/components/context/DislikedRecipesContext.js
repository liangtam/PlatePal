import { Children, createContext, useState } from "react";

export const DislikedRecipesContext = createContext();

export const DislikedRecipesContextProvider = ({children}) => {
    const [allergies, setAllergies] = useState([]);

    return (
        <DislikedRecipesContext.Provider value={{allergies, setAllergies}}>
            {children}
        </DislikedRecipesContext.Provider>
    );
};