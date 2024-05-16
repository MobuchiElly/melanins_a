import React, { useState } from 'react';
import { FaLinkedin, FaLinkedinIn, FaStaylinked, FaFacebook, FaFacebookSquare, FaInstagram, FaInstagramSquare, FaTwitter, FaTwitterSquare, FaCcVisa } from 'react-icons/fa';
import axiosInstance from '@/utils/axios';
import SuccessModal from "../components/modals/SuccessModal";

const Footer = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
        const res = await axiosInstance.post('/mail/', {email});
        if(res.data){
          setModalOpen(true);
        }
        setEmail('');
        setError('');
      } catch(err) {
        console.log(err);
        setError('Please provide a valid email and try again.');
      }
    } else {
      setError('Please provide a valid email address');
    }
  };

  return (
    <footer className="bg-slate-700 border-t border-gray-800 text-gray-200 p-4 md:px-5 flex flex-col justify-center w-screen bottom-0">
      <div className="w-full px-1 lg:px-4 flex flex-wrap justify-between pt-6 pb-10">
     
        <div className="w-full lg:w-1/3 h-auto lg:min-h-32 px-2">
          <h3 className="text-lg font-bold mb-2">Newsletter Signup</h3>
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="email"
              placeholder="melanin@gmail.com"
              value={email}
              onChange={(e) => {setError('');setEmail(e.target.value)}}
              className="mr-2 px-2 py-1 bg-slate-100 text-gray-900 focus:outline-none focus:ring focus:border-blue-300 rounded lg:rounded-lg flex-grow"
            />
            <button type="submit" className="px-4 py-1 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg font-[500]">Subscribe</button>
          </form>
          <p className="mt-2 text-sm">Subscribe to never miss any update</p>
          <p className={error ? 'bg-white bg-opacity-87 text-md font-[500] italic text-red-500 rounded border-none shadow-transparent rounded-br-xl rounded-tr-xl p-1 pl-2 my-1 min-h-8 h-auto' : 'p-1 my-1 min-h-8 h-auto'}>{error && error}</p>
        </div>

        <div className="w-full lg:w-1/3 mb-4 lg:mb-0 h-auto lg:min-h-32 lg:pl-10">
          <h3 className="text-lg font-bold mb-2 hidden lg:block px-2">Popular Tags</h3>
          <div className="flex flex-wrap pt-4 lg:pt-0">
            <a href="#" className="mr-2 mb-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg hover:text-white">JavaScript</a>
            <a href="#" className="mr-2 mb-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg hover:text-white">React</a>
            <a href="#" className="mr-2 mb-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg hover:text-white">Node.js</a>
            <a href="#" className="mr-2 mb-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg hover:text-white">MongoDB</a>
            <a href="#" className="mr-2 mb-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg hover:text-white">CSS</a>
            <a href="#" className="mr-2 mb-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg hover:text-white">HTML</a>
          </div>
        </div>

        <div className="w-full lg:w-1/3 mb-4 lg:mb-0 h-auto lg:min-h-32 pl-2 lg:flex lg:justify-center">
          <div className=''>
            <h3 className="text-lg font-bold mb-2 hidden lg:block">Follow Us</h3>
            <ul className='flex lg:flex-col'>
              <li><a href="#" className="hover:text-white inline-flex items-center pr-7"><span className='hover:scale-105'>
                <FaFacebook size={27} />
              </span><span className="ml-2 lg:p-2 mb-1">Facebook</span></a></li>
              <li><a href="#" className="hover:text-white inline-flex items-center pr-7"><span className='hover:scale-105'>
                <FaTwitter size={27} />
              </span><span className="ml-2 lg:p-2 mb-1">Twitter</span></a></li>
              <li><a href="#" className="hover:text-white inline-flex items-center pr-7"><span className='hover:scale-105'>
                <FaInstagram size={27} />
              </span><span className="ml-2 lg:p-2 mb-1">Instagram</span></a></li>
              <li><a href="#" className="hover:text-white inline-flex items-center pr-7"><span className='hover:scale-105'>
                <FaLinkedinIn size={27} />
              </span><span className="ml-2 lg:p-2 mb-1">LinkedIn</span></a></li>
            </ul>
          </div>
        </div>
        <div className="container w-1/2 mx-auto px-4 mt-8 border-t border-yellow-700 rounded py-2">
          <p className="text-center">&copy; {new Date().getFullYear()} Melanin Amara. <span className='ml-2'>All Rights Reserved.</span></p>
        </div>
      </div>
      {modalOpen && <SuccessModal setModalOpen={setModalOpen} title={"Successfull"} content={"Thank you for subscribing"}/>}
    </footer>
  );
};

export default Footer;