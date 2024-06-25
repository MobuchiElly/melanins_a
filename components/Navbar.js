import React, { useState, useEffect } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { IoMdNotificationsOutline } from "react-icons/io";
import { clearUser } from '@/redux/user/userSlice';
import Cookies from 'js-cookie';
import useAuthHook from './hooks/authHook';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { SubscribeModal } from './modals/SubscribeModal';
import { FadeLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { setrouteLoading } from '@/redux/loadingState/routeloading';

const Navbar = () => {
  const { admin, dispatch, isAuthenticated } = useAuthHook();
  const [nav, setNav] = useState(false);
  const [opensubscribeModal, setopensubscribeModal] = useState(false);
  const router = useRouter();

  const routeLoading = useSelector(state => state.routes);
  const routeDispatch = useDispatch();
  
  const toggleNav = () => {
    setNav(!nav);
  };
  const handleRouting = (item) => {
    toggleNav();
    routeDispatch(setrouteLoading(true));
    if (item.id === 5 && isAuthenticated) {
      e.preventDefault();
      handleSignout(e);
    }
  }
  useEffect(() => {
    const handleRouteChange = () => {
      routeDispatch(setrouteLoading(false));
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('routeChangeError', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('routeChangeError', handleRouteChange);
    };
  }, [router.events, routeDispatch]);



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
    { id: 2, text: 'Admin', route: '/admin' },
    { id: 5, text: isAuthenticated ? 'Signout' : 'Signin', route: !isAuthenticated ? '/auth' : '/' },
  ];

  return (
    <div className='top-0 left-0 bg-gradient-to-b from-slate-200 to-slate-100 h-28 md:h-32 z-50 shadow-sm'>
      {
        routeLoading && <div className="fixed inset-0 w-screen bg-black bg-opacity-15 z-50 flex justify-center items-center">
        <FadeLoader className="mb-40 lg:mb-0"/>
      </div>
      }
      <div className='fixed top-0 left-0 lg:left-16 bg-slate-700 border-b border-gray-800 h-24 md:h-28 flex justify-between items-center w-screen lg:max-w-[90%] lg:mx-auto lg:rounded-br-2xl lg:rounded-bl-2xl px-4 text-white z-50 '>
        <h1 className='ml-0 lg:ml-5 text-4xl lg:text-3xl font-bold text-[#0eff]'>M<span className='text-slate-300'>E</span>LAN<span className='text-slate-300'>I</span>N A.</h1>
        
        {/* Desktop nav */}
        <ul className='hidden md:flex mr-5 py-4 font-[500]'>
          {admin ?
            (Items.map(item => (
              <Link key={item.id} href={item.route} className={`py-5 px-6 hover:bg-slate-800 ${router.pathname === item.route ? 'text-yellow-500' : ''}`} onClick={(e) => handleRouting(item)}>
                {item.text}
              </Link>
            ))) :
            Items.filter(item => item.id !== 2 && item.route !== "admin").map((item) => (
              <Link key={item.id} href={item.route} className={`py-5 px-6 hover:bg-slate-800 ${router.pathname === item.route ? 'text-yellow-500' : ''}`} onClick={(e) => handleRouting(item)}>
                {item.text}
              </Link>
            ))}
            <button onClick={() =>setopensubscribeModal(true)} className='bg-yellow-600 group hover:scale-105 delay-75 my-3 px-3 flex justify-between items-center rounded-2xl font-[500] pt-1'>
              <IoMdNotificationsOutline size={24} color="#fff" className='group-hover:animate-spin'/>
              <span className='mb-1'>Subscribe</span>
            </button>
        </ul>
        {/* Mobile Nav Icon*/}
        <div className='block md:hidden mr-1' onClick={toggleNav}>
          {nav ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
        </div>
        
        {/* Mobile Nav Menu */}
        <ul className={nav ? 'fixed md:hidden left-0 z-50 top-0 w-[70%] h-screen border-r border-r-gray-900 pt-7 bg-gradient-to-bl from-[#000300] to-gray-900 ease-in-out duration-300' : 'ease-in-out w-[62%] duration-50 fixed top-0 bottom-0 left-[-100%]'} style={{ zIndex: 100 }}>
          <div className='block md:hidden ml-4'>
            <AiOutlineClose size={16} onClick={toggleNav} />
          </div>
          {/* Mobile logo */}
          <h1 className='w-full text-3xl font-bold text-[#0eef] m-4'>M<span className='text-slate-200'>E</span>LAN<span className='text-slate-200'>I</span>N A.</h1>
          {/* Mobile Items */}
          {admin ? (Items.map(item => (
            <Link key={item.id} href={item.route} className={`block p-4 border-b rounded-lg md:hover:bg-blue-800 duration-100 cursor-pointer border-gray-600 ${router.pathname === item.route ? 'text-yellow-500' : ''}`} onClick={(e) => handleRouting(item)}>
              {item.text}
            </Link>
          ))) : (
            Items.filter(item => item.id !== 2 && item.route !== "admin").map((item) => (
              <Link key={item.id} href={item.route} className={`block p-4 border-b rounded-lg md:hover:bg-blue-800 duration-100 cursor-pointer border-gray-600 ${router.pathname === item.route ? 'text-yellow-500' : ''}`} onClick={(e) => handleRouting(item)}>
                {item.text}
              </Link>
            ))
          )}
          <button onClick={() =>setopensubscribeModal(true)} className='delay-105 w-full flex justify-start items-center rounded font-[500] p-4 hover:bg-blue-800 border-b hover:text-yellow-500 border-gray-600 duration-300'>
            <span className='mr-1'>Subscribe</span>
            <IoMdNotificationsOutline size={24} color="yellow" className='hover:hover:text-yellow-500'/>
          </button>
        </ul>
      </div>
      {opensubscribeModal && <SubscribeModal setopensubscribeModal={setopensubscribeModal}/>}
    </div>
  )
}

export default Navbar;