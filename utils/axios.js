import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get('token');
const baseURL = process.env.NODE_ENV == "development" ? process.env.ENDPOINT_URL : process.env.NEXT_PUBLIC_ENDPOINT_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Authorization': `Bearer ${token}`
  },
});

export default axiosInstance;