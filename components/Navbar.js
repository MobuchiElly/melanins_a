import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { useSelector, useDispatch} from 'react-redux';
import { clearUser } from '@/redux/user/userSlice';
import Cookies from 'js-cookie';
import useAuthHook from './hooks/authHook';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Navbar = () => {
  const { admin, dispatch, isAuthenticated } = useAuthHook();
  const [nav, setNav] = useState(false);
  const router = useRouter();

  const toggleNav = () => {
    setNav(!nav);
  };

  const handleSignout = (e) => {
    e.preventDefault();
    dispatch(clearUser());
    Cookies.remove('userState');
    Cookies.remove('token');
    router.push('/auth');
  };

  const Items = [
    { id: 1, text: 'Home', route: '/' },
    { id: 4, text: 'Articles', route: '/articles' },
    { id: 6, text: 'Categories', route: '/categories' },
    { id: 7, text: 'Trending', route: '/gossip' },
    { id: 2, text: 'Admin', route: 'admin' },
    { id: 5, text: isAuthenticated ? 'Signout' : 'Signin', route: !isAuthenticated ? '/auth' : '/' },
  ];

  return (
    <div className='fixed top-0 left-0 lg:left-16 bg-slate-700 border-b border-gray-800 h-24 md:h-28 flex justify-between items-center w-screen lg:max-w-[90%] lg:mx-auto lg:rounded-br-2xl lg:rounded-bl-2xl px-4 text-white z-50 '>
      <h1 className='ml-0 lg:ml-5 w-full text-4xl lg:text-3xl font-bold text-[#0eff]'>M<span className='text-slate-300'>E</span>LAN<span className='text-slate-300'>I</span>N A.</h1>

      {/* Desktop nav */}
      <ul className='hidden md:flex mr-14'>
        {admin ?
          (Items.map(item => (
            <Link key={item.id} href={item.route} className={`p-5 hover:bg-slate-800 ${router.pathname === item.route ? 'text-yellow-500' : ''}`} onClick={(e) => {
              toggleNav();
              if (item.id === 5 && isAuthenticated) {
                e.preventDefault();
                handleSignout(e);
              }
            }}>
              {item.text}
            </Link>
          ))) :
          Items.filter(item => item.id !== 2 && item.route !== "admin").map((item) => (
            <Link key={item.id} href={item.route} className={`p-5 hover:bg-slate-800 ${router.pathname === item.route ? 'text-yellow-500' : ''}`} onClick={(e) => {
              toggleNav();
              if (item.id === 5 && isAuthenticated) {
                e.preventDefault();
                handleSignout(e);
              }
            }}>
              {item.text}
            </Link>
          ))}
      </ul>

      {/* Mobile Nav Icon*/}
      <div className='block md:hidden mr-4' onClick={toggleNav}>
        {nav ? <AiOutlineClose size={28} /> : <AiOutlineMenu size={28} />}
      </div>

      {/* Mobile Nav Menu */}
      <ul className={nav ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 pt-7 bg-[#000300] ease-in-out duration-500' : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'} style={{ zIndex: 100 }}>
        <div className='block md:hidden ml-4'>
          <AiOutlineClose size={16} onClick={toggleNav} />
        </div>
        {/* Mobile logo */}
        <h1 className='w-full text-3xl font-bold text-[#00df] m-4'>M<span className='text-slate-300'>E</span>LAN<span className='text-slate-300'>I</span>N A.</h1>
        {/* Mobile Items */}

        {admin ? (Items.map(item => (
          <Link key={item.id} href={item.route} className={`block p-4 border-b rounded-xl hover:bg-blue-800 duration-300 hover:text-yellow-500 cursor-pointer border-gray-600 ${router.pathname === item.route ? 'text-yellow-500' : ''}`} onClick={(e) => {
            toggleNav();
            if (item.id === 5 && isAuthenticated) {
              e.preventDefault();
              handleSignout(e);
            }
          }}>
            {item.text}
          </Link>
        ))) : (
          Items.filter(item => item.id !== 2 && item.route !== "admin").map((item) => (
            <Link key={item.id} href={item.route} className={`block p-4 border-b rounded-xl hover:bg-blue-800 duration-300 hover:text-yellow-500 cursor-pointer border-gray-600 ${router.pathname === item.route ? 'text-yellow-500' : ''}`} onClick={(e) => {
              toggleNav();
              if (item.id === 5 && isAuthenticated) {
                e.preventDefault();
                handleSignout(e);
              }
            }}>
              {item.text}
            </Link>
          ))
        )}
      </ul>
    </div>
  )
}

export default Navbar;