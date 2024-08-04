import { createContext, useState } from "react";

export const FoodPreferencesContext = createContext();

export const FoodPreferencesContextProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    isVegan: false,
    isLactoseFree: false,
    isNotSpicy: false,
    maxTime: 1
  });

  return (
    <FoodPreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </FoodPreferencesContext.Provider>
  );
};
