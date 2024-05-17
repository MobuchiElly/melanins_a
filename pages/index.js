import React, {useState, useEffect } from 'react';
import Link from 'next/link';
import axiosInstance from '@/utils/axios';
import ClipLoader from "react-spinners/ClipLoader";
import Image from 'next/image';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Home = ({featuredPosts, err}) => {
  const [featuredPost, setFeaturedPost] = useState([]);
  const [featuredPost1, setfeaturedPost1] = useState({})
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    if(featuredPosts && Array.isArray(featuredPosts)) {
      setfeaturedPost1(featuredPosts.slice(0, 1));
      const remPosts = featuredPosts.slice(1);
      
      remPosts.length % 2 === 0 ? setFeaturedPost(remPosts.slice(0, remPosts.length)) : setFeaturedPost(remPosts.slice(0, remPosts.length-1));
      setLoading(false);
    }
  }, [featuredPosts]);

  console.log(featuredPosts.length)
  return (
    <div className="w-full lg:max-w-[90%] md:mx-auto px-6 pb-10 min-h-[80vh]">
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
            <h1 className="text-2xl lg:text-center lg:text-3xl font-bold mb-4 ml-3 p-2 ">Top Stories: Technology, Entertainment, Gossip<span className='hidden lg:inline'>, Sports</span></h1>
          </div>
          {featuredPost1 && featuredPost1.length > 0 && <section className="bg-white p-6 rounded-xl shadow flex flex-col lg:flex-row my-6">
            <div className="h-auto shadow-slate-200 shadow rounded lg:mr-5 bg-transparent">
              <Image
                  src={featuredPost1[0].image}
                  alt="featuredPost1[0] image"
                  width={400}
                  height={400}
                  layout="responsive"
                  className="w-1/2 md:pr-6 lg:pr-0 object-cover shadow-sm max-h-[50vh] md:mt-9 lg:mt-0 rounded z-30"
              />
            </div>
            <article className='lg:w-1/2 lg:p-2 mx-1'>
              <div className="min-h-44">
                <h2 className="text-2xl font-semibold mt-4 mb-2">{featuredPost1[0].title}</h2>
                <p className="mb-2">{featuredPost1[0].content.length>250 ? featuredPost1[0].content.slice(0, 250) + '.........' : featuredPost1[0].content}</p>
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
            <div key={post._id} className="bg-white py-4 px-6 rounded-xl shadow">
              <div className='h-48'>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600">{ post.content.length > 100 ? `${post.content.slice(0, 100)}...` : post.content }</p>
              </div>
              <div className='flex'>
                <button className="lg:mt-2 bg-cyan-700 bg-opacity-90 hover:bg-cyan-900 text-white px-4 lg:py-2 rounded-xl flex-2/3 mr-2">
                  <Link href={'post/' + post._id } state={{postId:post._id, postTitle: post.title, postContent: post.content}}>Read More -&gt;
                  </Link>
                </button>
                <div className='mt-2 px-2 py-2 rounded flex-2/3 font-semibold text-sm'>Author: {post.author}</div>
                </div>
            </div>
            )) : ''}
            </div>
            <section className="lg:min-w-[25vw] lg:ml-4 mt-7 lg:mt-0">
              <div className="w-full bg-white border shadow py-9 px-7 mb-6 rounded-2xl">
                  <div className="flex items-center p-1 mb-3">
                    <h1 className="font-[600] text-xl mb-1">Recent Posts</h1>
                    <div className="">
                      <div className="ml-2 bg-pink-500 h-3 w-3 rounded-full inline-flex"></div>
                    </div>
                    <div className="border border-t-slate-400 border-b-slate-400 h-1 inline-flex w-36 mt-1"></div>
                  </div>
                  <div className="px-1 text-slate-900">
                    <p>post title here</p>
                    <p>post title here</p>
                    <p>post title here</p>
                    <p>post title here</p>
                    <p>post title here</p>
                    <p>post title here</p>
                    <p>post title here</p>
                  </div>
              </div>
              <div className="w-full bg-white border shadow py-10 px-7 mb-6 rounded-2xl">
                  <div className="flex items-center p-1 mb-3">
                    <h1 className="font-[600] text-xl mb-1">Trending</h1>
                    <div className="">
                      <div className="ml-2 bg-pink-500 h-3 w-3 rounded-full inline-flex"></div>
                    </div>
                    <div className="border border-t-slate-400 border-b-slate-400 h-1 inline-flex w-full mt-1"></div>
                  </div>
                  <p>post 1</p>
                  <p>post 1</p>
                  <p>post 1</p>
                  <p>post 1</p>
              </div>
              <div className="w-full bg-white  items-center border shadow rounded-2xl mt-4 py-8 px-7">
                <div className="flex items-center p-1 mb-3">
                  <h1 className="font-[600] text-xl mb-1">Categories</h1>
                  <div className="ml-2 bg-pink-500 h-3 w-3 rounded-full inline-flex"></div>
                  <div className="border border-t-slate-400 border-b-slate-400 h-1 inline-flex w-40 mt-1"></div>
                </div>
                <div className="grid grid-cols-2 text-slate-900">
                  <p>News</p>
                  <p>Entertainment</p>
                  <p>Sports</p>
                  <p>Tech</p>
                </div>
              </div>
            </section>
          </div>     
          <section className="border shadow min-h-[40vw] w-full my-10 bg-white rounded-2xl p-2">
            <div>
              <h1 className="text-2xl font-bold pl-4 py-7 text-center">Final Contents would appear here</h1>
              <p className='text-xl font-semibold text-center'>Bring ideas....let your imagination run wild.....lolllll</p>
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
    const res = await axiosInstance.get("/blog?featured=true");
    const data = await res.data.data || [];

    return {
    props: {
      featuredPosts: data
    }
    }
  } catch (err) {
    console.log(err);
    return {
      props: {
        err: 'Oops there seems to be an issue. Please refresh your browser',
        featuredPosts: []
      }
    }
  }
}