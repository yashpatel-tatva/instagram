import axios from "axios";

const BASE_URL = "https://97a4-14-99-103-154.ngrok-free.app/api";

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;

export default axiosInstance;