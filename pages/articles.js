import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import Image from "next/image";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from 'next/link'

const Articles = ({recentPosts}) => {
  const [posts, setPosts] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState([]);
  const [openSearch, setopenSearch] = useState(false);

  const handleTagCheck = (e) => {
    if(e.target.checked){
      if(!selectedTags.includes(e.target.value)){
        
        setSelectedTags((prevTags) => [...prevTags, e.target.value]);
      }
    } else {
      setSelectedTags((prevTags) => prevTags.filter(tag => tag !== e.target.value));
    }
  }

  const fetchPosts = async() => {
    try{
      const res = await axiosInstance.get(`/blog?search=${searchTerm}&tags=${selectedTags.join(", ")}`);
      const data = await res.data;
      if(data.data && data.length !== 0){
        setLoading(false);
      }
      !(searchTerm && selectedTags) ? setPosts(data.data.slice(0,6)) : setPosts(data.data);
    } catch(err){
      setLoading(false);
      setError(err);
      console.error('Unable to fetch blog posts', err);
    }
  }
 
  useEffect(() => {
    fetchPosts();
    return () => {}
  }, [searchTerm, selectedTags]);
  
  useEffect(() => {
    if(posts) {
      posts.forEach(post => {
        if(post && post.tags){
          { 
            setTags((prevTags) => {
                const newtags = post.tags.filter(tag=>!prevTags.includes(tag));
                return [...prevTags, ...newtags]
            })
        }
        }
      });
    }
  }, [posts])

  return (
    <div className="">
      <div className="w-screen max-w-[96%] lg:max-w-[90%] mx-auto pb-10 min-h-[80vh] px-4">
      {(!posts && !loading && error) && <h1 className='text-2xl text-center mt-10 text-slate-700 font-semibold italic'>{error}</h1>}

        { loading ? 
        <SkeletonTheme baseColor="#ffffff" highlightColor="#d3d3d3">
          <p ><Skeleton height={50} className=""/></p>
          <p ><Skeleton height={500} className="mt-4"/></p>
        </SkeletonTheme> 
        :  
        (posts && posts.length) ? <div>
          <div className='bg-white rounded-xl shadow-sm'>
            <h1 className="text-3xl font-bold mb-4 ml-3 p-2 text-center">Technology, Entertainment, Gossip<span className='hidden lg:inline'>, Sports</span></h1>
          </div>
          <div className="flex flex-col-reverse lg:flex-row-reverse">
            <section className="w-full lg:w-[120vw] lg:ml-4 mt-7 lg:mt-0">
              <div className="w-full bg-white border shadow py-10 px-7 mb-6 rounded-2xl">
                  <div className="flex items-center p-1 pl-0 mb-3">
                    <h1 className="font-[600] text-xl mb-1">Search</h1>
                    <div className="">
                      <div className="ml-2 bg-pink-500 h-3 w-3 rounded-full inline-flex"></div>
                    </div>
                    <div className="border border-t-slate-400 border-b-slate-400 h-1 inline-flex w-full mt-1"></div>
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      value={searchTerm}
                      placeholder="Search by title, tags or content"
                      className="w-full border-2 text-lg border-gray-300 rounded-lg px-3 py-3 h-12 ease-in-out delay-500"
                    />
                    <button onClick={fetchPosts} className="bg-pink-600 text-white font-mono text-lg px-4 ml-3 rounded-xl">Search</button>
                  </div>
              </div>
              <div className="w-full bg-white border shadow py-6 px-7 mb-6 rounded-2xl">
                  <div className="lg:flex items-center p-1 pl-0 mb-3">
                    <h1 className="font-[600] text-2xl lg:mb-1 underline">Recent Posts</h1>
                    <div className="hidden lg:inline-flex">
                      <div className="ml-2 bg-pink-500 h-3 w-3 rounded-full inline-flex"></div>
                    </div>
                    <div className="border border-t-slate-400 border-b-slate-400 h-1 hidden lg:inline-flex w-40 mt-1 l"></div>
                  </div>
                  <div className="py-2 bg-white lg:shadow-md rounded-lg text-slate-900">
                    {
                      recentPosts.map(post => (
                        <Link href={'post/' + post._id} key={post._id} className="block mb-2 lg:mb-5 pb-6 border-b last:border-none rounded-lg hover:bg-slate-50">
                          <h1 className="font-semibold text-lg text-slate-800 mb-2 hover:scale-y-105 cursor-pointer hover:text-gray-800">{post.title}</h1>
                          <p className="text-slate-600 cursor-pointer hover:text-gray-800">{post.content.slice(0, 50)}..........</p>
                        </Link>
                      ))
                    }
                  </div>
              </div>
              <div className="w-full bg-white  items-center border shadow rounded-2xl mt-4 py-8 px-7">
                <div className="lg:flex items-center p-1 pl-0 mb-3">
                  <h1 className="font-[600] text-2xl mb-1 underline">Categories and Tags</h1>
                  <div className="ml-2 bg-pink-500 h-3 w-3 rounded-full hidden lg:inline-flex"></div>
                  <div className="border border-t-slate-400 border-b-slate-400 h-1 hidden lg:inline-flex w-24 mt-1"></div>
                </div>
                <div className="grid grid-cols-2 text-slate-900">
                  {
                    tags && tags.map((tag) => (
                      <label className="flex items-center mr-2 focus:text-blue-500" key={tag}>
                    <input type="checkbox"
                    name={tag}
                    value={tag} onChange={(e) => handleTagCheck(e)} className="mr-2"/>
                    <span className='py-1'>{tag}</span>
                  </label>
                    ))
                  }
                </div>
              </div>
            </section>
            <div className={posts ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}>
              {posts && Array.isArray(posts) && posts.map((article) => (
                <div key={article._id} className="bg-white pb-2 md:pb-0 lg:pb-2 lg:mb-3 px-3 rounded shadow h-auto max-h-[90vh]">
                  <div className="h-auto shadow-slate-200 shadow rounded">
                    {article.image && (
                      <Image
                        src={article.image}
                        alt="article image"
                        width={400}
                        height={400}
                        layout="responsive"
                        className="w-full shadow-sm max-h-[50vh] rounded z-30"
                      />
                    )}
                  </div>
                  <div className="py-1 max-h-[52]">
                    <div className="h-48">
                      <h2 className="text-xl font-bold mt-4 mb-2 cursor-pointer hover:text-gray-800">{article.title}</h2>
                      <p className="mb-2 cursor-pointer hover:text-gray-800">{article.content.length>190 ? article.content.slice(0, 190) + '.........' : article.content}</p>
                    </div>
                    <div className="mt-4 md:pt-8 lg:pt-5 pb-1">
                      <p className="text-gray-600 text-sm py-2 mb-1">Published by {article.author} <span className='font-extrabold'>|</span> {new Date(article.createdAt).toDateString()}</p>
                      <button className="bg-cyan-700 bg-opacity-90 hover:bg-cyan-800 text-white px-4 py-2 rounded ">
                        <a href={`/post/${article._id}`} className="text-white">Read Article</a>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <section className="border shadow lg:h-[70vh] w-full my-8 rounded-xl bg-slate-50">
          <div className="lg:flex justify-evenly gap-3 h-full lg:py-4 lg:px-6">
                    {recentPosts && recentPosts.slice(0,1).map((article) => (
                      <Link href={'post/' + article._id} key={article._id} className="bg-gray-400 w-full relative rounded hover:shadow-2xl group">
                        <Image src={article.image} alt="recent" height={200} width={200} className="w-full h-full rounded-lg"/>
                        <span className="absolute top-14 lg:top-44 text-center  text-white w-full text-wrap px-6 italic cursor-pointer delay-100 min-h-16">
                          <h1 className="font-semibold text-xl lg:text-3xl cursor-pointer hover:text-gray-50 hover:underline hover:underline-offset-1 hover:scale-105 p-2 delay-75">{article.title}</h1>
                          <p className="text-xl cursor-pointer hover:text-gray-50 hover:scale-105 p-1 delay-75 hidden lg:block">{article.content.slice(0, 110)}</p>
                        </span>
                      </Link>
                    ))}
              </div>
          </section> 
        </div> : <SkeletonTheme baseColor="#ffffff" highlightColor="#d3d3d3">
          <p ><Skeleton height={50} className=""/></p>
          <p ><Skeleton height={500} className="mt-4"/></p>
        </SkeletonTheme>
        }
      </div>
    </div>
  );
};

export default Articles;


export const getServerSideProps = async() => {
  try{
    //fetch recent posts
    const startDate = new Date(new Date().getTime() - 60*24*60*60*1000);
    const recentPostRes = await axiosInstance.get(`/blog?startDate=${startDate}&select=title,content,author,image`);
    const recData = await recentPostRes.data.data || [];
    return {
      props: {
        recentPosts: recData,
      }
    }
  } catch(err){

  }
}