import axios from "axios";

const server_url = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const axiosInstance = axios.create(
    {
        baseURL: server_url,
    }
);

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
(err) => Promise.reject(err)
);

export default axiosInstance;