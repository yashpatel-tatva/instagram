import axios from "axios";
import { isExpired } from "react-jwt";
import { authAction } from "../redux/slices/AuthSlice";

// Function to set navigate function
let dispatch;
export function setNavigate(navigateFunc) {
  dispatch = navigateFunc;
}

// Function to log out the user
function logoutUser() {
  localStorage.removeItem("login");
  localStorage.removeItem("token");
  dispatch(authAction.logout());
}

// Axios instance configuration
const axiosInstance = axios.create({
  baseURL: "https://088f-14-99-103-154.ngrok-free.app/api",
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (!isExpired(token)) {
        config.headers["Authorization"] = `Bearer ${token}`;
        config.headers["ngrok-skip-browser-warning"] = true;
      } else {
        console.log("token logout");
        logoutUser();
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error.response.status);
    if (
      error.code === "ERR_NETWORK" ||
      (error.response && error.response.status === 401)
    ) {
      console.log(error, "logout");

      logoutUser();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
