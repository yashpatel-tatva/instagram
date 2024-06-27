import { useSelector } from "react-redux";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiousinstance";
import axios from "axios";

const initialState = {
    isLoggedIn: localStorage.getItem("login") ?? false,
    data: {},
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state) {
            state.isLoggedIn = true;
        },
        logout(state) {
            state.isLoggedIn = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, actions) => {
                localStorage.setItem("login", true);
                state.isLoggedIn = true;
                state.data = actions.payload;
            })
            .addCase(login.rejected, (state, actions) => {
                state.isLoggedIn = true;
                state.data = actions.payload;
            })
    }
});

export const login = createAsyncThunk("", async (data) => {
    const res = await axiosInstance.post("/Auth/Login", data);
    return res;
});

export const authAction = authSlice.actions;

export const useSelectorUserState = () => {
    const userState = useSelector((state) => state?.auth);
    return userState;
};


export default authSlice.reducer;
