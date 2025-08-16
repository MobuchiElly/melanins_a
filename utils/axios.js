import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NODE_ENV == "development" ? process.env.NEXT_PUBLIC_ENDPOINT_URL_LOCAL : process.env.NEXT_PUBLIC_ENDPOINT_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true
});

export default axiosInstance;