import axios from "axios";

const baseURL = process.env.NODE_ENV == "development" ? process.env.ENDPOINT_URL : process.env.NEXT_PUBLIC_ENDPOINT_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true
});

export default axiosInstance;