import { useSelector } from "react-redux";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiousinstance";
import { jwtDecode } from "jwt-decode";

const initialState = {
  isLoggedIn: localStorage.getItem("login") ?? false,
  token: localStorage.getItem("token") ?? "",

  username: localStorage.getItem("token")
    ? jwtDecode(localStorage.getItem("token")).UserName
    : "",
  userid: localStorage.getItem("token")
    ? jwtDecode(localStorage.getItem("token")).UserId
    : "",

  Notification: {},
  ErrorMessage: "",
  isError: false,
  loading: false,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      localStorage.removeItem("login");
    },
    setuser(state) {
      state.username = jwtDecode(state.token).UserName;
      state.userid = jwtDecode(state.token).UserId;
    },
    resetErrors(state) {
      state.isError = false;
      state.ErrorMessage = "";
    },
    resetSuccess(state) {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, actions) => {
        state.isLoggedIn = true;
        state.isError = false;
        state.ErrorMessage = "";
        state.token = actions.payload.data.token;
        localStorage.setItem("login", true);
        localStorage.setItem("token", state.token);
        state.username = jwtDecode(state.token).UserName;
        state.userid = jwtDecode(state.token).UserId;
        state.loading = false;
      })
      .addCase(login.pending, (state, actions) => {
        state.loading = true;
      })
      .addCase(login.rejected, (state, actions) => {
        state.isLoggedIn = false;
        state.user = null;
        state.ErrorMessage = actions.payload.message;
        state.success = false;
        state.loading = false;
        state.isError = true;
      })
      .addCase(signup.pending, (state, actions) => {
        state.loading = true;
      })
      .addCase(signup.rejected, (state, actions) => {
        state.isLoggedIn = false;
        state.user = null;
        state.ErrorMessage = actions.payload.data[0].message;
        state.success = false;
        state.isError = true;
        state.loading = false;
      })
      .addCase(signup.fulfilled, (state, actions) => {
        state.success = true;
        state.loading = false;
      })
      .addCase(forgetpassword.pending, (state, actions) => {
        state.loading = true;
      })
      .addCase(forgetpassword.fulfilled, (state, actions) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(forgetpassword.rejected, (state, actions) => {
        state.loading = false;
        state.success = false;
        state.isError = true;
        state.ErrorMessage = actions.payload.message;
      })
      .addCase(resetpassword.pending, (state, actions) => {
        state.loading = true;
      })
      .addCase(resetpassword.fulfilled, (state, actions) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(resetpassword.rejected, (state, actions) => {
        state.loading = false;
        state.success = false;
        state.isError = true;
        state.ErrorMessage = actions.payload.message;
      });
  },
});

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/Auth/Login", data);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return thunkAPI.rejectWithValue(await response.data);
    }
  } catch (error) {
    if (error.response) {
      return thunkAPI.rejectWithValue(error.response.data);
    } else {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
});

export const forgetpassword = createAsyncThunk(
  "auth/forgetpassword",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/Auth/ForgotPassword", data);
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(await response.data);
      }
    } catch (error) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      } else {
        return thunkAPI.rejectWithValue({ message: error.message });
      }
    }
  }
);
export const resetpassword = createAsyncThunk(
  "auth/resetpassword",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/Auth/ForgotPasswordUpdate",
        data
      );
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(await response.data);
      }
    } catch (error) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      } else {
        return thunkAPI.rejectWithValue({ message: error.message });
      }
    }
  }
);

export const signup = createAsyncThunk(
  "/auth/signup",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/Auth/Register", data);
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(await response.data);
      }
    } catch (error) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      } else {
        return thunkAPI.rejectWithValue({ message: error.message });
      }
    }
  }
);

export const authAction = authSlice.actions;

export const useSelectorUserState = () => {
  const userState = useSelector((state) => state?.auth);
  return userState;
};

export default authSlice.reducer;
