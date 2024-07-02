import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://cb84-14-99-103-154.ngrok-free.app/api',
    withCredentials: false,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['ngrok-skip-browser-warning'] = true;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
