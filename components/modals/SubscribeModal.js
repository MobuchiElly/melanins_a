import { useState } from "react";
import axiosInstance from "@/utils/axios";
import { FadeLoader } from "react-spinners";

export const SubscribeModal = ({setopensubscribeModal}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async() => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if(!email){
        setError('Please provide Email');
        return;
    }
    const userEmail = email.trim();
    if(!regex.test(userEmail)){
      setError("Please provide a valid email address");
      return;
    }
    setLoading(true);
    try{
      const res = await axiosInstance.post('/subscribe', {email:userEmail});
      if (res.status == 201){
        setEmail('');
        setError('');
        setSuccessMessage("Thank you for subscribing!!");
        setTimeout(() => {
          setopensubscribeModal(false);
        }, 2500);
      }
    } catch(err) {
      console.error("err:", err);
      setError("err:", err?.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 w-full flex justify-center items-center z-50'>
        <div className='bg-white p-6 min-h-[40vh] flex flex-col justify-center rounded-2xl font-mono relative mb-12 lg:mb-0 mx-5'>
            <span className="absolute top-0 right-6 text-2xl cursor-pointer" onClick={()=>setopensubscribeModal(false)}>&times;</span>
            <h1 className='text-xl font-[500] mt-3 lg:0'>Never miss out on the latest gist and gossip</h1>
            <label className='mt-8'>
                <span className='py-2 text-lg pl-2 lg:0'>Email Address:</span>
                <input type="email" value={email} placeholder="melanin@gmail.com" onChange={(e) => {
                  setError('');
                  setEmail(e.target.value)
                  }} className='w-full border shadow-md p-3 rounded-lg my-1'/>
                <button className='border shadow bg-green-600 text-white px-6 py-4 rounded-xl mt-4' onClick={handleSubmit}>Subscribe</button>
            </label>
            <span className="p-1 text-red-500 text-lg min-h-8">{!successMessage &&(error && error)}</span>
            <span className="p-1 text-green-600 font-semibold text-2xl text-center min-h-8 animate-bounce">{successMessage && successMessage}</span>
        </div>
        {
          loading && <div className="fixed inset-0 w-screen bg-black bg-opacity-15 z-50 flex justify-center items-center">
          <FadeLoader className="mb-24"/>
        </div>
        }
    </div>
  )
}
