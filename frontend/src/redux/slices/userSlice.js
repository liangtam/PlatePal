import { createSlice } from '@reduxjs/toolkit'
import { dummyUser } from '../../constants/dummyData';

const getUser = async() => {
    return dummyUser; // test
    // const user = await JSON.parse(localStorage.getItem('user'));
    // if (user) {
    //     return user;
    // } else {
    //     return null;
    // }
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

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;