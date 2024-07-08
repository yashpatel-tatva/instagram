import { useSelector } from "react-redux";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiousinstance";
import { Buffer } from "buffer";
import { assets } from "../../constants/Assets";

const initialState = {
  user: {},
  Notification: "",
  ErrorMessage: "",
  isError: false,
  loading: false,
  success: false,
  userPhoto: assets.profiledefault,
};

const useractionSlice = createSlice({
  name: "useraction",
  initialState,
  reducers: {
    resetErrors(state) {
      state.isError = false;
      state.ErrorMessage = "";
    },
    resetNotification(state) {
      state.Notification = "";
    },
    resetProfileUpdateFlag(state) {
      state.isProfileUpdated = false;
    },
    clearErrors: (state) => {
      state.ErrorMessageArray = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getuserdata.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
      })
      .addCase(getuserdata.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getuserdata.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getuserphoto.pending, (state, actions) => {
        state.loading = true;
      })
      .addCase(getuserphoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userPhoto = action.payload;
      })
      .addCase(getuserphoto.rejected, (state, actions) => {
        state.loading = false;
        state.isError = true;
        state.ErrorMessage = actions.payload;
      })
      .addCase(changeuserphoto.pending, (state, actions) => {
        state.loading = true;
        state.isError = false;
        state.success = false;
      })
      .addCase(changeuserphoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.Notification = action.payload.message;
        state.user.profilePictureName = action.payload.data.profilePhotoName;
      })
      .addCase(changeuserphoto.rejected, (state, actions) => {
        state.loading = false;
        state.isError = true;
        state.ErrorMessage = actions.payload;
      })
      .addCase(updateuserprofile.fulfilled, (state, actions) => {
        state.isError = false;
        state.success = true;
        state.Notification = actions.payload.message;
        state.user = actions.payload.data;
        state.isProfileUpdated = true;
      })
      .addCase(updateuserprofile.rejected, (state, actions) => {
        state.isError = true;
        state.success = false;
        state.ErrorMessageArray = actions.payload.data;
      })
      .addCase(updateuserprofile.pending, (state, actions) => {
        state.isError = false;
        state.success = false;
      });
  },
});

export const getuserdata = createAsyncThunk(
  "user/getuserdata",
  async (userId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/User/GetUserById?userId=${userId}`
      );
      const countres = await axiosInstance.get(
        `/User/FollowerAndFollowingAndPostCountById?userId=${userId}`
      );
      if (
        response.status >= 200 &&
        response.status < 300 &&
        countres.status >= 200 &&
        countres.status < 300
      ) {
        await thunkAPI.dispatch(
          getuserphoto({
            userId: response.data.data.userId,
            photoName: response.data.data.profilePictureName,
          })
        );
        return { ...(await response.data.data), ...(await countres.data.data) };
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

export const deleteprofilephoto = createAsyncThunk(
  "user/deleteprofilephoto",
  async () => {
    const response = await axiosInstance.post("/User/DeleteProfilePhoto");
    return response.data;
  }
);

export const getuserphoto = createAsyncThunk(
  "user/getuserphoto",
  async ({ userId, photoName }, thunkAPI) => {
    try {
      if (!photoName) {
        return assets.profiledefault;
      } else if (userId && photoName) {
        const response = await axiosInstance.get(
          `/File/ProfilePhoto?userId=${userId}&imageName=${photoName}`,
          { responseType: "blob" } // set responseType to 'blob' to handle binary data
        );
        if (response.status >= 200 && response.status < 300) {
          const blob = response.data;

          // Convert blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(blob);

          return new Promise((resolve, reject) => {
            reader.onloadend = () => {
              const base64data = reader.result; // base64 data
              resolve(base64data);
            };
            reader.onerror = () => {
              reject(
                thunkAPI.rejectWithValue({
                  message: "Error converting to base64",
                })
              );
            };
          });
        } else {
          return thunkAPI.rejectWithValue(await response.data);
        }
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

export const changeuserphoto = createAsyncThunk(
  "user/changeuserphoto",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/User/UploadProfilePhoto",
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

export const updateuserprofile = createAsyncThunk(
  "user/updateuserprofile",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/User/UpdateProfile", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
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

export const userAction = useractionSlice.actions;

export const useSelectorUserAction = () => {
  return useSelector((state) => state?.useraction);
};

export default useractionSlice.reducer;
