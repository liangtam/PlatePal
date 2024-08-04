import { useContext } from "react"
import { FoodPreferencesContext } from "../context/FoodPreferencesContext"

const FoodPreferences = () => {
    const {preferences, setFoodPreferences} = useContext(FoodPreferencesContext);
}