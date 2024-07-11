import { useSelector } from "react-redux";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiousinstance";
import { Buffer } from "buffer";
import { assets } from "../../constants/Assets";

const initialState = {
  user: {},
  pffcount: {},
  Notification: "",
  ErrorMessage: "",
  isError: false,
  loading: false,
  success: false,
  userPhoto: assets.profiledefault,
  updaterender: false,
  // searchedUser: {},
  NotificationList: null,
  stories: {},
  personalstories: {},
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
    updaterender(state) {
      state.updaterender = !state.updaterender;
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
        try {
          state.userPhoto =
            "data:" +
            action.payload.data.fileType +
            ";base64, " +
            action.payload.data.imageBase64;
        } catch {
          state.userPhoto = action.payload;
        }
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
        state.user = { ...state.user, ...actions.payload.data };
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
      })
      .addCase(createpost.fulfilled, (state, actions) => {
        state.isError = false;
        state.success = true;
        state.loading = false;
        state.Notification = actions.payload.message;
      })
      .addCase(getpostfollowerfollowingcount.fulfilled, (state, actions) => {
        state.pffcount = { ...actions.payload.data };
      })
      .addCase(createpost.rejected, (state, actions) => {
        state.loading = false;
        state.isError = true;
        state.success = false;
        state.ErrorMessageArray = actions.payload.data;
      })
      .addCase(createpost.pending, (state, actions) => {
        state.isError = false;
        state.loading = true;
        state.success = false;
      })
      .addCase(addstory.fulfilled, (state, actions) => {
        state.isError = false;
        state.success = true;
        state.loading = false;
        state.Notification = actions.payload.message;
      })
      .addCase(storylisttoshow.fulfilled, (state, actions) => {
        state.isError = false;
        state.success = true;
        state.loading = false;
        state.stories = actions.payload.data;
      })
      .addCase(personalstorylist.fulfilled, (state, actions) => {
        state.isError = false;
        state.success = true;
        state.loading = false;
        state.personalstories = actions.payload.data;
      })
      .addCase(addstory.rejected, (state, actions) => {
        state.loading = false;
        state.isError = true;
        state.success = false;
        state.ErrorMessageArray = actions.payload.data;
      })
      .addCase(addstory.pending, (state, actions) => {
        state.isError = false;
        state.loading = true;
        state.success = false;
      });
    // .addCase(getotheruserdata.fulfilled, (state, action) => {
    //   state.success = true;
    //   state.loading = false;
    //   state.searchedUser = action.payload;
    // })
    // .addCase(getotheruserdata.pending, (state, action) => {
    //   state.success = false;
    //   state.loading = true;
    // });
  },
});

export const getuserdata = createAsyncThunk(
  "user/getuserdata",
  async (userId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/User/GetUserById?userId=${userId}`
      );
      if (response.status >= 200 && response.status < 300) {
        await thunkAPI.dispatch(
          getuserphoto({
            userId: response.data.data.userId,
            photoName: response.data.data.profilePictureName,
          })
        );
        await thunkAPI.dispatch(
          getpostfollowerfollowingcount(response.data.data.userId)
        );
        return { ...(await response.data.data) };
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
export const getotheruserdata = createAsyncThunk(
  "user/getotheruserdata",
  async (userId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/User/GetUserById?userId=${userId}`
      );
      if (response.status >= 200 && response.status < 300) {
        const photo = await thunkAPI.dispatch(
          getprofilepic({
            userId: response.data.data.userId,
            photoName: response.data.data.profilePictureName,
          })
        );
        return {
          ...(await response.data.data),
          profilePic: photo.payload,
        };
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
export const getpostfollowerfollowingcount = createAsyncThunk(
  "user/getpostfollowerfollowingcount",
  async (userId) => {
    const countres = await axiosInstance.get(
      `/User/FollowerAndFollowingAndPostCountById/${userId}`
    );
    return countres.data;
  }
);
export const getpffcountofother = createAsyncThunk(
  "user/getpffcountofother",
  async (userId) => {
    const countres = await axiosInstance.get(
      `/User/FollowerAndFollowingAndPostCountById/${userId}`
    );
    return countres.data;
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
          `/File/ProfilePhoto?userId=${userId}&imageName=${photoName}`
        );
        if (response.status >= 200 && response.status < 300) {
          return response.data;
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

export const getprofilepic = createAsyncThunk(
  "user/getprofilepic",
  async ({ userId, photoName }, thunkAPI) => {
    try {
      if (!photoName) {
        return assets.profiledefault;
      } else if (userId && photoName) {
        const response = await axiosInstance.get(
          `/File/ProfilePhoto?userId=${userId}&imageName=${photoName}`
        );
        if (response.status >= 200 && response.status < 300) {
          return (
            "data:" +
            response.data.data.fileType +
            ";base64, " +
            response.data.data.imageBase64
          );
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

export const createpost = createAsyncThunk(
  "user/createpost",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/Post/CreatePostAsync", data);
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
export const getPostOrReel = createAsyncThunk(
  "user/getPostOrReel",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/Post/PostAndReelListById",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
export const getmediafromname = createAsyncThunk(
  "user/getmediafromname",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/File/${payload.type}?userId=${
          payload.data.userId
        }&${payload.type.toLowerCase()}Name=${payload.data.postName}`,
        payload.data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
export const addstory = createAsyncThunk(
  "user/addstory",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/Story/AddStory", data);
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

export const likeunlikepost = createAsyncThunk(
  "user/likeunlikepost",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/Post/LikeAndUnlikePost",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
export const commentonpost = createAsyncThunk(
  "user/commentonpost",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/Post/CommentPost", data, {
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

export const searchbyusername = createAsyncThunk(
  "user/searchbyusername",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/User/GetUserListByUserName",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
export const followrequest = createAsyncThunk(
  "user/followrequest",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/User/FollowRequest", data, {
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
export const requestList = createAsyncThunk(
  "user/requestList",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/User/RequestListById", data, {
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
export const requestacceptorcancel = createAsyncThunk(
  "user/requestacceptorcancel",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `/User/RequestAcceptOrCancel?requestId=${data.requestId}&accpetType=${data.accpetType}`
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
export const getpostbyid = createAsyncThunk(
  "user/postId",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `/Post/GetPostById?postType=${data.postType}`,
        data.postId,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
export const folloerorfollowinglist = createAsyncThunk(
  "user/folloerorfollowinglist",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/User/FollowerORFollowingListById",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
export const deletepost = createAsyncThunk(
  "user/deletepost",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `Post/DeletePost?postId=${data}`
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

export const notificationlist = createAsyncThunk(
  "notification/notificationlist",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/Notification/GetNotificationListById",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
export const storylisttoshow = createAsyncThunk(
  "story/storylisttoshow",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/Story/StoryListByUserId",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
export const personalstorylist = createAsyncThunk(
  "story/personalstorylist",
  async (thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/Story/GetStoryListById",
        {
          pageNumber: 1,
          pageSize: 1111110,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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

export const getstorymedia = createAsyncThunk(
  "file/getstory",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/File/Story?userId=${payload.userId}&storyName=${payload.storyName}`
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

export const suggestionlist = createAsyncThunk(
  "user/getsuggetionlist",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/User/GetSuggestionList",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
export const postfeedlist = createAsyncThunk(
  "post/postfeedlist",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/Post/GetPostListByUserId",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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

export const userAction = useractionSlice.actions;

export const useSelectorUserAction = () => {
  return useSelector((state) => state?.useraction);
};

export default useractionSlice.reducer;
