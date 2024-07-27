import { Children, createContext, useState } from "react";

export const AllergiesContext = createContext();

export const AllergiesContextProvider = ({children}) => {
    const [allergies, setAllergies] = useState([]);

    return (
        <AllergiesContext.Provider value={{allergies, setAllergies}}>
            {children}
        </AllergiesContext.Provider>
    );
};