import axios from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data.error_code === 0 || response.data.error_code === 200) {
        toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }  
    return response;
  },
  (error) => { 
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use((config) => {
  
  // config.headers.Authorization = `Bearer ${sa_token}`;
   
  return config;
});

export default axiosInstance;
