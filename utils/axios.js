import axios from "axios";
import Cookies from "js-cookie";


const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENDPOINT_URL + '/api/v1',
  headers: {
    'Authorization': `Bearer ${token}`
  },
});

export default axiosInstance;