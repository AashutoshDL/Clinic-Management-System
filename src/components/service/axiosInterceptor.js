import axios from "axios";
import { baseURL } from './baseURL';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: `${baseURL}`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Axios Response Error:', error.response.data);
            //Handle specific error codes here.
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Axios Request Error:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Axios Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;