import { createSlice } from "@reduxjs/toolkit";
import { dummyRecipe1, dummyRecipe2 } from "../../constants/dummyData";

export const recipesSlice = createSlice({
  name: "recipes",
  initialState: { value: [] },
  reducers: {
    addRecipe: (state, action) => {
      state.value = [...state, action.payload];
    },
    deleteRecipe: (state, action) => {
      const idToDelete = action.payload;
      state.value = state.value.filter((recipe) => recipe.generatedId !== idToDelete);
    },
    updateRecipe: (state, action) => {
      let index = state.value.findIndex(
        (recipe) => recipe._id === action.payload._id
      );
      state.value[index] = action.payload;
    },
    setRecipes: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.value = action.payload;
      }
    },
  },
});

export const { addRecipe, deleteRecipe, updateRecipe, setRecipes } =
  recipesSlice.actions;

export default recipesSlice.reducer;
