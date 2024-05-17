import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { FiSearch } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';
import axiosInstance from "@/utils/axios";
import Image from "next/image";


const Articles = () => {
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
      // setPosts(data.data);
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
      <div className="w-screen max-w-[96%] lg:max-w-[90%] mx-auto pb-10 min-h-[80vh]">
      {(!posts && !loading && error) ? <h1 className='text-2xl text-center mt-10 text-slate-700 font-semibold italic'>{error}</h1> : <div className='bg-yellow-50 rounded-xl shadow'>
        <h1 className="text-3xl font-bold mb-4 ml-3 p-2 text-center">News, Technology, Entertainment, Sports, Gossip</h1>
      </div>}
        { loading ? <div className='pt-6 flex justify-center h-80'><ClipLoader color={"#52bfd9"} size={220}/></div> :  
        <div className="flex flex-col-reverse lg:flex-row-reverse">
          
          <section className="w-full lg:w-[120vw] lg:ml-4 mt-7 lg:mt-0">
            <div className="w-full bg-white border shadow py-10 px-7 mb-6 rounded-2xl">
                <div className="flex items-center p-1 mb-3">
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

            <div className="w-full bg-white border shadow py-9 px-7 mb-6 rounded-2xl">
                <div className="flex items-center p-1 mb-3">
                  <h1 className="font-[600] text-xl mb-1">Recent Posts</h1>
                  <div className="">
                    <div className="ml-2 bg-pink-500 h-3 w-3 rounded-full inline-flex"></div>
                  </div>
                  <div className="border border-t-slate-400 border-b-slate-400 h-1 inline-flex w-40 mt-1"></div>
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

            <div className="w-full bg-white  items-center border shadow rounded-2xl mt-4 py-8 px-7">
              <div className="flex items-center p-1 mb-3">
                <h1 className="font-[600] text-xl mb-1">Categories and Tags</h1>
                <div className="ml-2 bg-pink-500 h-3 w-3 rounded-full inline-flex"></div>
                <div className="border border-t-slate-400 border-b-slate-400 h-1 inline-flex w-24 mt-1"></div>
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
            <div className="w-full my-9 rounded-2xl min-h-[140vh] shadow border bg-white px-4">
              <div>
                <h1 className="text-2xl font-bold py-7 text-center">Aside Contents would appear here</h1>
                <p className='text-lg font-semibold text-center'>Jumbo jumbo jumbo....let's fill it up people.....lolllll</p>
              </div>
            </div>
          </section>
          
      
          <div className={posts ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}>
            {posts && Array.isArray(posts) && posts.map((article) => (
              <div key={article._id} className="bg-white pb-2 px-3 rounded shadow h-auto max-h-[90vh]">
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
                    <h2 className="text-xl font-bold mt-4 mb-2">{article.title}</h2>
                    <p className="mb-2">{article.content.length>190 ? article.content.slice(0, 190) + '.........' : article.content}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600 text-sm py-2 mb-1">Published by {article.author} <span className='font-extrabold'>|</span> {new Date(article.createdAt).toDateString()}</p>
                    <button className="bg-cyan-700 bg-opacity-90 hover:bg-cyan-800 text-white px-4 py-2 rounded ">
                      <a href={`/post/${article._id}`} className="text-white">Read Article</a>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>}
        <section className="border shadow min-h-[40vw] w-full my-10 bg-white rounded-2xl">
          <div>
            <h1 className="text-2xl font-bold pl-4 py-7 text-center">Final Contents would appear here</h1>
            <p className='text-xl font-semibold text-center'>Bring back the zombies....let's fill up this place.....lolllll</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Articles;
