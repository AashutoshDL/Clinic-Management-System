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


            console.error('Axios Response Error:', error.response.data);

        } else if (error.request) {

            console.error('Axios Request Error:', error.request);
        } else {

            console.error('Axios Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;