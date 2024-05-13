import React, { useState } from 'react';
import { FaLinkedin, FaLinkedinIn, FaStaylinked, FaFacebook, FaFacebookSquare, FaInstagram, FaInstagramSquare, FaTwitter, FaTwitterSquare, FaCcVisa } from 'react-icons/fa';
import axiosInstance from '@/utils/axios';

const Footer = () => {
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
        const res = await axiosInstance.post('/mail/', {email});
        setEmail('');
      } catch(err) {
        console.log(err);
        setError('Unable to send your request. Please try again');
      }
    } else {
      setError('Please provide a valid email address');
    }
  };

  return (
    <footer className="bg-slate-700 border-t border-gray-800 text-gray-200 p-4 md:px-5 mt-16 flex flex-col justify-center w-screen bottom-0">
      <div className="w-full px-1 lg:px-4 flex flex-wrap justify-between pt-6 pb-10">
     
        <div className="w-full lg:w-1/3 h-auto lg:min-h-32 px-2">
          <h3 className="text-lg font-bold mb-2">Newsletter Signup</h3>
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mr-2 px-2 py-1 bg-slate-100 text-gray-900 focus:outline-none focus:ring focus:border-blue-300 rounded lg:rounded-lg flex-grow"
            />
            <button type="submit" className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Subscribe</button>
          </form>
          <p className="mt-2 text-sm">Subscribe to our newsletter to get the latest updates.</p>
        </div>

        <div className="w-full lg:w-1/3 mb-4 lg:mb-0 h-auto lg:min-h-32 lg:pl-8">
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

        <div className="w-full lg:w-1/3 mb-4 lg:mb-0 h-auto lg:min-h-32 pl-2 lg:pl-20">
          <h3 className="text-lg font-bold mb-2 hidden lg:block">Follow Us</h3>
          <ul className='flex lg:flex-col'>
            <li><a href="#" className="hover:text-white inline-flex items-center pr-7"><span className='hover:scale-105'>
              <FaFacebook size={18} />
            </span><span className="pl-2">Facebook</span></a></li>
            <li><a href="#" className="hover:text-white inline-flex items-center pr-7"><span className='hover:scale-105'>
              <FaTwitter size={18} />
            </span><span className="pl-2">Twitter</span></a></li>
            <li><a href="#" className="hover:text-white inline-flex items-center pr-7"><span className='hover:scale-105'>
              <FaInstagram size={18} />
            </span><span className="pl-2">Instagram</span></a></li>
            <li><a href="#" className="hover:text-white inline-flex items-center pr-7"><span className='hover:scale-105'>
              <FaLinkedinIn size={18} />
            </span><span className="pl-2">LinkedIn</span></a></li>
          </ul>
        </div>
        <div className="container mx-auto px-4 mt-4">
        <p className="text-center">&copy; {new Date().getFullYear()} Melanin Amara. All Rights Reserved.</p>
      </div>
      </div>
    </footer>
  );
};

export default Footer;