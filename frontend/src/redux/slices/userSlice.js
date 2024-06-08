import { useEffect } from 'react';
import { createSlice } from 'react-redux';

let user = null;

const getUser = async() => {
    const user = await JSON.parse(localStorage.getItem('user'));
    if (user) {
        return user;
    } else {
        return null;
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: await getUser()
    },
    reducers: {
        login: (state, action) => {
            state.value = action.payload;
            localStorage.setItem('user', action.payload);
        },
        logout: (state) => {
            state.value = null;
            localStorage.removeItem('user');
        }
    }
});

export const { login, logout } = userSlice.action;

export default userSlice.reducer;