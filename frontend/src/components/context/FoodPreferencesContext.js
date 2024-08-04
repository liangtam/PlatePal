import { createContext } from "react";

export const FoodPreferencesContext = createContext();

export const FoodPreferencesContextProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    vegetarian: false,
    lactoseFree: false,
    spicy: false,
  });

  return (
    <FoodPreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </FoodPreferencesContext.Provider>
  );
};
