import { configureStore } from '@redux/toolkit';
import userReducer from './slices/userSlice';

export default configureStore({
    reducer: {
        user: userReducer
    }
});