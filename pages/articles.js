import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { FiSearch } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';
import axiosInstance from "@/utils/axios";


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
      setPosts(data.data);
    } catch(err){
      setLoading(false);
      setError(err);
      console.error('Unable to fetch blog posts', err);
    }
  }
 

  useEffect(() => {
    fetchPosts();
    
    return () => {
    fetchPosts  
    }
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
    <div className="w-screen lg:max-w-[90%] md:mx-auto  py-8 min-h-[80vh]">
      { loading ? <div className='pt-6 flex justify-center h-80'><ClipLoader color={"#52bfd9"} size={220}/></div> : <div>
        <div className='h-12 relative'>
          {
            openSearch ? <FaTimes onClick={() => setopenSearch(false)} className="position absolute right-4 lg:right-0 top-[-15px] lg:top-2 p-1 bg-gray-500 text-2xl text-white ease-in-out delay-500"/> : <FiSearch onClick={() => setopenSearch(true)} className="position absolute right-4 lg:right-0 top-[-15px] lg:top-2 p-1 bg-gray-500 text-2xl text-white ease-in-out delay-500" />
            
          }
          
        <div className="w-full px-6 lg:px-10">
          {openSearch ? (
            <input
              type="text"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              placeholder="Search by title, tags or content"
              className="w-full border border-gray-300 rounded px-3 py-2 h-12 ease-in-out delay-500"
            />
          ) : (
            <h1 className="text-3xl h-12 ease-in-out delay-500 font-bold text-center">Place Holder Text</h1>
          )}
          </div>
        </div>
        
        <div className="flex items-center mt-3 flex-wrap ml-4">
          {
            tags && tags.map((tag) => (
              <label className="flex items-center mr-2 focus:text-blue-500" key={tag}>
            <input type="checkbox"
            name={tag}
            value={tag} onChange={(e) => handleTagCheck(e)} className="mr-2"/>
            <span className='font-semibold'>{tag}</span>
          </label>
            ))
          }
        </div>
        
        <div className={posts ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : ''}>
          {posts && Array.isArray(posts) ? posts.map((article) => (
            <div key={article._id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-2">{article.title}</h2>
              <p className="mb-2">{article.content.length>500 ? article.content.slice(0, 500) + '.........' : article.content}</p>
              <p className="text-gray-600 text-sm">Published by {article.author} <span className='font-extrabold'>|</span> {new Date(article.createdAt).toDateString()}</p>
              <div className="mt-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                  <a href={`/post/${article._id}`} className="text-white">Read Article</a>
                </button>
              </div>
            </div>
          )) : <h1 className='text-2xl font-bold text-center'>Loading articles...Please wait..</h1>
          }
        </div>
      </div>}
    </div>
  );
};

export default Articles;


// export const getServerSideProps = async ({query}) => {
//   const {searchTerm, selectedTags} = query;
//   try {
//     const res = await axiosInstance.get(`/blog?search=${searchTerm}&tags=${selectedTags.join(", ")}`);
//     const data = await res.data;
//     return { 
//       props: { 
//         data 
//       } 
//     };
//   } catch (err) {
//     console.error('Unable to fetch blog posts', err);
//     return { 
//       props: { 
//         error: "Oops it seems an error has occurred. Please refresh your browser"
//       } 
//     };
//   }
// };