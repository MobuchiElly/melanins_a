import React, {useState, useEffect } from 'react';
import Link from 'next/link';
import axiosInstance from '@/utils/axios';
import Image from 'next/image';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Head from 'next/head';

const Home = ({featuredPosts, recentPosts, err}) => {
  const [featuredPost, setFeaturedPost] = useState([]);
  const [featuredPost1, setfeaturedPost1] = useState({})
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if(featuredPosts && Array.isArray(featuredPosts)) {
      setfeaturedPost1(featuredPosts.slice(0, 1));
      const remPosts = featuredPosts.slice(1);
      
      remPosts.length % 2 === 0 ? setFeaturedPost(remPosts.slice(0, remPosts.length)) : setFeaturedPost(remPosts.slice(0, remPosts.length-1));
      setLoading(false);
    }
  }, [featuredPosts]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimate(false);
      setTimeout(() => setAnimate(true), 12000);
    }, 12000);

    return () => clearInterval(intervalId);
  }, []);


  return (
    <div className="w-full lg:max-w-[90%] md:mx-auto px-3 pb-4 lg:pb-10 min-h-[80vh]">
      <Head>
        <title>Welcome to Melanin Amaras Blog</title>
        <meta name="description" content="Current News, Exclusive Info and Gossip" />
        <meta name="keywords" content="blog, gossip, news" />
      </Head>
      {/* Error Check */}
      {error && <h1 className='text-2xl text-center mt-10 text-slate-700 font-semibold italic'>{error}</h1>}
      {/* Loading check */}
      {
        loading ? 
        <SkeletonTheme baseColor="#ffffff" highlightColor="#d3d3d3">
          <p ><Skeleton height={50} className=""/></p>
          <p ><Skeleton height={500} className="mt-4"/></p>
        </SkeletonTheme> 
        : 
        (featuredPosts && featuredPosts.length > 0) ? <div>
          <div className='bg-white rounded-xl shadow-sm'>
            <h1 className={`text-3xl text-center font-[400] p-2 text-gray-900 ${animate ? 'lg:sliding-header' : ''}`}>Welcome to Melanin Amaras Blog</h1>
          </div>
          {featuredPost1 && featuredPost1.length > 0 && <section className="bg-white p-6 rounded-xl shadow flex flex-col lg:flex-row my-6">
            <div className="h-auto shadow-slate-200 shadow rounded lg:mr-5 bg-slate-50 min-w-[40vw]">
              <Image
                  src={featuredPost1[0].image}
                  alt="image"
                  width={400}
                  height={400}
                  layout="responsive"
                  className="w-1/2 md:pr-6 lg:pr-0 object-cover shadow-sm max-h-[50vh] md:mt-9 lg:mt-0 rounded z-30" fetchPriority
              />
            </div>
            <article className='lg:w-1/2 lg:p-2 mx-1'>
              <div className="min-h-44">
                <h2 className="text-2xl font-semibold mt-4 mb-2 cursor-pointer hover:text-gray-800">{featuredPost1[0].title}</h2>
                <p className="mb-2 cursor-pointer hover:text-gray-800">{featuredPost1[0].content.length>250 ? featuredPost1[0].content.slice(0, 250) + '.........' : featuredPost1[0].content}</p>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 text-sm py-2 mb-1">Published by {featuredPost1[0].author} <span className='font-extrabold'>|</span> {new Date(featuredPost1[0].createdAt).toDateString()}</p>
                <div className='flex'>
                  <button className="bg-cyan-700 bg-opacity-90 hover:bg-cyan-800 text-white px-4 py-2 rounded-xl lg:rounded-lg">
                    <a href={`/post/${featuredPost1[0]._id}`} className="text-white">Read More</a>
                  </button>
                  <div className='mt-2 px-2 py-2 rounded flex-2/3 font-semibold text-sm'>Author: {featuredPost[0].author}</div>
                </div>
              </div>
            </article>
          </section>}
          
          <div className='flex flex-col lg:flex-row gap-2'>
            <div className={featuredPosts ?"grid grid-cols-1 md:grid-cols-2 gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-white bg-opacity-50 h-auto lg:h-40" }>
            {featuredPost && Array.isArray(featuredPost) ? featuredPost.map((post, index) => (
            <div key={post._id} className="bg-white py-4 px-6 rounded-xl shadow lg:h-[40vh]">
              <div className='h-48 pt-4'>
                <h2 className="text-xl font-semibold mb-2 cursor-pointer hover:text-gray-800">{post.title}</h2>
                <p className="text-gray-600 cursor-pointer hover:text-gray-800">{ post.content.length > 100 ? `${post.content.slice(0, 100)}...` : post.content }</p>
              </div>
              <div className='flex'>
                <button className="lg:mt-2 bg-cyan-700 bg-opacity-90 hover:bg-cyan-900 text-white px-4 lg:py-2 rounded-xl flex-2/3 mr-2">
                  <Link href={'post/' + post._id}>Read More -&gt;
                  </Link>
                </button>
                <div className='mt-2 px-2 py-2 rounded flex-2/3 font-semibold text-sm'>Author: {post.author}</div>
                </div>
            </div>
            )) : ''}
            </div>
            <section className="lg:min-w-[25vw] lg:ml-4 mt-4 lg:mt-0">
              <div className="w-full bg-white border shadow py-6 px-7 mb-6 rounded-2xl">
                  <div className="lg:flex items-center p-1 pl-0 mb-1">
                    <h1 className="font-[600] text-2xl mb-1 underline lg:no-underline">Recent Posts</h1>
                    <div className="hidden lg:inline-flex">
                      <div className="ml-2 bg-pink-500 h-3 w-3 rounded-full inline-flex"></div>
                    </div>
                    <div className="border border-t-slate-400 border-b-slate-400 h-1 hidden lg:inline-flex w-[48vw] lg:w-[8vw] mt-1"></div>
                  </div>
                  <div className="pt-2 bg-white shadow rounded-lg text-slate-900">
                    {
                      recentPosts.slice(0,5).map(post => (
                        <Link href={'post/' + post._id} key={post._id} className="block mb-4 pb-4 border-b last:border-none hover:bg-slate-100 rounded-lg">
                          <h1 className="font-semibold text-lg text-slate-800 mb-2 cursor-pointer hover:text-gray-800">{post.title}</h1>
                          <p className="text-slate-600 cursor-pointer hover:text-gray-800">{post.content.slice(0, 50)}..........</p>
                        </Link>
                      ))
                    }
                  </div>
              </div>
              
              <div className="w-full bg-white  items-center border shadow rounded-2xl mt-4 py-8 px-7">
                <div className="flex items-center p-1 pl-0 mb-3">
                  <h1 className="font-[600] text-xl mb-1 underline lg:no-underline">Categories</h1>
                  <div className="ml-2 bg-pink-500 h-3 w-3 rounded-full hidden lg:inline-flex"></div>
                  <div className="border border-t-slate-400 border-b-slate-400 h-1 hidden lg:inline-flex w-40 mt-1"></div>
                </div>
                <div className="grid grid-cols-2 text-slate-900">
                  <p className="cursor-pointer hover:underline">News</p>
                  <p className="cursor-pointer hover:underline">Entertainment</p>
                  <p className="cursor-pointer hover:underline">Sports</p>
                  <p className="cursor-pointer hover:underline">Tech</p>
                </div>
              </div>
            </section>
          </div>     
          <section className="border shadow lg:h-[75vh] w-full my-10 rounded-xl lg:px-2 lg:py-4 lg:bg-slate-50">
            <div className="lg:flex justify-evenly gap-3 h-full lg:px-4">
                  {recentPosts && recentPosts.slice(recentPosts.length-1,recentPosts.length).map((article) => (
                    <div key={article._id} className="bg-gray-300 w-full relative rounded-lg outline-none hover:shadow-2xl group">
                      <Image src={article.image} alt="image" height={200} width={200} className="w-full h-full rounded-lg"/>
                        <span className="absolute bottom-0 left-0 right-0 lg:top-44 text-center text-white w-full text-wrap px-6 italic cursor-pointer   delay-100 bg-black bg-opacity-20">
                          <h1 className="lg:font-semibold text-xl lg:text-3xl hover:underline hover:scale-105 lg:p-2 delay-75 text-wrap">{article.title}</h1>
                          <p className="hidden lg:block text-xl hover:underline hover:scale-95 p-1 delay-75">{article.content.slice(0, 110)}...</p>
                        </span>
                    </div>
                  ))}
            </div>
          </section>
        </div> : <SkeletonTheme baseColor="#ffffff" highlightColor="#d3d3d3">
          <p ><Skeleton height={50} className=""/></p>
          <p ><Skeleton height={500} className="mt-4"/></p>
        </SkeletonTheme>
      }
    </div>
  );
};

export default Home;

export const getServerSideProps = async({query}) => {
  try {
    //Fetch featured posts
    const res = await axiosInstance.get("/blog?featured=true");
    const data = await res.data.data || [];
    //fetch recent posts
    const startDate = new Date(new Date().getTime() - 60*24*60*60*1000);
    const recentPostRes = await axiosInstance.get(`/blog?startDate=2024-05-08T07:43:54.257Z&select=title,content,author,image`);
    const recData = await recentPostRes.data.data || [];
    return {
      props: {
        featuredPosts: data,
        recentPosts: recData,
      }
    }
  } catch (err) {
    //console.log(err);
    return {
      props: {
        err: 'Oops there seems to be an issue. Please refresh your browser',
        featuredPosts: []
      }
    }
  }
}