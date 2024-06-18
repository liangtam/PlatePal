import { createSlice } from '@reduxjs/toolkit';

const getUser = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user || null;
};

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: getUser()
    },
    reducers: {
        login: (state, action) => {
            state.value = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.value = null;
            localStorage.removeItem('user');
            localStorage.removeItem('authToken'); // Remove authToken on logout
        }
    }
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
