import {createContext, useState} from "react";

export const IngredientsContext = createContext();

export const IngredientsContextProvider = ({children}) => {
    const [ingredients, setIngredients] = useState([]);

    return (
        <IngredientsContext.Provider value={{ingredients, setIngredients}}>
            {children}
        </IngredientsContext.Provider>
    );
};
