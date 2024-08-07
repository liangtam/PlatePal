import {configureStore} from '@reduxjs/toolkit';
import userReducer from './users/userSlice';
import recipesReducer from './recipes/recipesSlice';

export default configureStore({
    reducer: {
        user: userReducer,
        recipes: recipesReducer
    }
});
