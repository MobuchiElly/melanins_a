import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {  useDispatch } from "react-redux";
import { setUser } from "@/redux/user/userSlice";
import { useRouter } from "next/router";

const Auth = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toggle, setToggle] = useState(false);

  const router = useRouter();
  
  const dispatch = useDispatch();  

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("trying to login now");
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
        console.log('Successfully logged in');
        router.push('/');
      }
    } catch (error) {
      setError("Please enter corect credentials");
      console.error("Login failed:", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_ENDPOINT_URL + "/auth/register",
        { name, email, password }
      );
      const data = response.data;
      
      if (data && data.user !== null && data.token) {
      console.log('registered user successfully'); 
        handleToggle();
      }
    } catch (error) {
      setError("Registration failed:", error);
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] border pb-20 text-white px-10 lg:px-1">
      <div className="bg-gradient-to-tr from-gray-900 to-cyan-500  p-8 rounded-tl-2xl rounded-br-3xl shadow-md w-96 mb-2 md:mb-3 lg:mb-6">
        <h2 className="text-2xl mb-4 font-semibold">{toggle ? "Register" : "Login"}</h2>
        <form onSubmit={toggle ? handleRegister : handleLogin}>
          {toggle && (
            <input
              type="name"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => {setError('');setName(e.target.value)}}
              className="w-full mb-4 p-2 border rounded text-black text-lg bg-white"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {setError('');setEmail(e.target.value)}}
            className="w-full mb-4 p-2 border rounded text-black text-lg bg-white"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {setError('');setPassword(e.target.value)}}
            className="w-full mb-4 p-2 border rounded text-black text-lg bg-white"
            required
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
        <div className={`${!error && 'invisible'} h-6 text-center font-semibold text-red-600`}>{error}</div>
      </div>
    </div>
  );
};

export default Auth;