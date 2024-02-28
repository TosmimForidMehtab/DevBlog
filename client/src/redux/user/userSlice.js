import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    errorMsg: null,
    loading: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.errorMsg = null;
        },
        signInSuccess: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.errorMsg = null;
        },
        signInFailure: (state, action) => {
            state.user = null;
            state.loading = false;
            state.errorMsg = action.payload;
        },
        setErrorMsg: (state) => {
            state.errorMsg = null;
            state.loading = false;
        },
        updateStart: (state) => {
            state.loading = true;
            state.errorMsg = null;
        },
        updateSuccess: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.errorMsg = null;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.errorMsg = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.errorMsg = null;
        },
        deleteUserSuccess: (state) => {
            state.user = null;
            state.loading = false;
            state.errorMsg = null;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.errorMsg = action.payload;
        },
        singOutSuccess: (state) => {
            state.user = null;
            state.loading = false;
            state.errorMsg = null;
        },
    },
});

export const { signInStart, signInSuccess, signInFailure, setErrorMsg, updateStart, updateSuccess, updateFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, singOutSuccess } =
    userSlice.actions;

export default userSlice.reducer;
