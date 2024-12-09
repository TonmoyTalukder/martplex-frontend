import envConfig from "@/src/config/envConfig";
import axios from "axios";


const axiosInstance = axios.create({
  baseURL: envConfig.baseApi,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
