import { useState } from "react";
import axiosInstance from "@/utils/axios";
import axios from "axios";
import { FadeLoader } from "react-spinners";

export const SubscribeModal = ({setopensubscribeModal}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(!email){
        console.log('email field cannot be empty')
        setError('Email field cannot be empty');
        return;
    }
    if(regex.test(email)){
      try{
        setLoading(true);
        const res = await axios.post('http://localhost:5000/api/v1/mail/', {email});
        setEmail('');
        setError('');
      } catch(err) {
        console.log(err.code);
        setLoading(false);
        err.code === "ERR_BAD_REQUEST" ? setError("Unsuccessful. Please try again") : err.code === "ERR_NETWORK" ? setError("Please check your internet connection") : setError("Please try again");
      }
    } else {
      setError('Please provide a valid email address');
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 w-full flex justify-center items-center z-50'>
        <div className='bg-white p-6 min-h-[40vh] flex flex-col justify-center rounded-2xl font-mono relative mb-12 lg:mb-0 mx-5'>
            <span className="absolute top-0 right-6 text-2xl cursor-pointer" onClick={()=>setopensubscribeModal(false)}>&times;</span>
            <h1 className='text-xl font-[500] mt-3 lg:0'>Never miss out on the latest gist and gossip</h1>
            <label className='mt-8'>
                <span className='py-2 text-lg pl-2 lg:0'>Email Address:</span>
                <input type="email" placeholder="melanin@gmail.com" onChange={(e) => {setError('');setEmail(e.target.value)}} className='w-full border shadow-md p-3 rounded-lg my-1'/>
                <button className='border shadow bg-green-600 text-white px-6 py-4 rounded-xl mt-4' onClick={handleSubmit}>Subscribe</button>
            </label>
            <span className="p-1 text-red-500 font-semibold text-md italic min-h-8">{error && error}</span>
        </div>
        {
          loading && <div className="fixed inset-0 w-screen bg-black bg-opacity-15 z-50 flex justify-center items-center">
          <FadeLoader className="mb-24"/>
        </div>
        }
    </div>
  )
}
