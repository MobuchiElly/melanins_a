import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {  useDispatch } from "react-redux";
import { setUser } from "@/redux/user/userSlice";
import {FadeLoader} from "react-spinners";
import { useRouter } from "next/router";


const Auth = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toggle, setToggle] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const router = useRouter();
  
  const dispatch = useDispatch();  

  const handleToggle = () => {
    setToggle(!toggle);
    setError('')
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('')
    setAuthLoading(true);
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_ENDPOINT_URL + "/auth/login",
        { email, password }
      );
      const data = await response.data;
      if (data && data.user !== null && data.token) {
        const {name, email, uid, status} = data.user;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);

        Cookies.set("token", data.token, {
          expires: expiryDate,
          secure: true,
          // httpOnly: true,
          sameSite: "strict",
        }); 
        
        Cookies.set("userState", JSON.stringify(data.user), {
            expires: expiryDate,
            secure: true,
            // httpOnly: true,
            sameSite: "strict",
          });
        dispatch(setUser({
            name,
            email,
            uid
        }));
        router.back() || router.push('/');
      }
    } catch (error) {
      setAuthLoading(false);
      error.code === "ERR_BAD_REQUEST" ? setError("Incorrect Login Credentialss") : error.code === "ERR_NETWORK" ? setError("Please check your internet connection") : setError("Please try again");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const regx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!name){
      setError("Name is required");
      return;
    } else if(!email){
      setError("Valid email is required");
      return;
    } else if(!password){
      setError("Input your password");
      return;
    }
    if(!email.match(regx)){
      setError("Please provide a valid email");
      return;
    }
    setAuthLoading(true);
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_ENDPOINT_URL + "/auth/register",
        { name, email, password }
      );
      const data = response.data;
      if (data && data.user !== null && data.token) {
        handleToggle();
        setAuthLoading(false);
      }
    } catch (error) {
      setAuthLoading(false);
      console.error(error)
      error.code === "ERR_NETWORK" ? setError("Please check your network connection") : error.response.status === 500 ? setError("Email address already exists") : setError("Please try again");
    }
  };


  return (
    <div className="flex justify-center items-center min-h-[80vh] border pb-20 text-white px-10 lg:px-1 relative">
      {authLoading && <div className="fixed inset-0 w-screen bg-black bg-opacity-15 z-50 flex justify-center items-center">
        <FadeLoader className="mt-12"/>
      </div>}
      <div className="bg-gradient-to-tr from-gray-900 to-cyan-500  p-8 rounded-tl-2xl rounded-br-3xl shadow-md w-96 mb-2 md:mb-3 lg:mb-6">
        <h2 className="text-2xl mb-4 font-semibold">{toggle ? "Register" : "Login"}</h2>
        <form onSubmit={toggle ? handleRegister : handleLogin}>
          {toggle && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => {setError('');setName(e.target.value)}}
              className="w-full mb-4 p-2 border rounded text-black text-lg bg-white"
            />
          )}
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {setError('');setEmail(e.target.value)}}
            className="w-full mb-4 p-2 border rounded text-black text-lg bg-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {setError('');setPassword(e.target.value)}}
            className="w-full mb-4 p-2 border rounded text-black text-lg bg-white"
          />
          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded font-mono text-xl"
          >
            {toggle ? "Register" : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center">
          {toggle ? "Already have an account?" : "Don't have an account?"}{" "}
          <button className="text-blue-500" onClick={handleToggle}>
            {toggle ? <span className="text-white font-bold">Login</span> : <span className="text-white font-bold">Register</span>}
          </button>
        </p>
        <div className={`${!error && 'invisible'} min-h-6 h-auto text-center font-semibold text-red-600 bg-white bg-opacity-81 w-auto rounded-tl-lg rounded-br-lg mt-1 px-1`}>{error}</div>
      </div>
    </div>
  );
};

export default Auth;

export const getServerSideProps  = ({req}) => {
  try{
    const res = req?.cookies;
    const user = res && res.token && res.userState ?  JSON.parse(res.userState) : null;
    if(user){
      if(user.status === "admin"){
        return  {
          redirect: {
            destination: "/admin/",
            permanent: false
          }
        }
      } else {
        return  {
          redirect: {
            destination: "/",
            permanent: false
          }
        }
      }
    }
  } catch(err) {
    console.log(err);
  }
  return {
    props: {

    }
  }
}