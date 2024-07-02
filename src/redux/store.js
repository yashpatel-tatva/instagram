import { configureStore } from "@reduxjs/toolkit";

import authSliceReducer from "./slices/AuthSlice";
import UserActionSlice from "./slices/UserActionSlice";

const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        useraction: UserActionSlice
    },
    devTools: true,
});

export default store;