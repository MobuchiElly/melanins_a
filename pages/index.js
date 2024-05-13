import React, {useState, useEffect } from 'react';
import Link from 'next/link';
import axiosInstance from '@/utils/axios';
import ClipLoader from "react-spinners/ClipLoader";

const Home = ({posts, err}) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);  
 
  // const fetchFeaturedPosts = async () => {
  //   try{
  //     posts ? setLoading(false) : null;
  //   } catch(err){
  //     setError(err);
  //     console.error('Unable to fetch blog posts', err);
  //   }
  // }

  useEffect(() => {
    posts ? setLoading(false) : null;
    err ? (setLoading(false),setError(err)) : null
  }, []);
 
  
  return (
    <div className="w-screen lg:max-w-[90%] md:mx-auto px-6 py-8 min-h-96">
      {(!posts && !loading && error) ? <h1 className='text-2xl text-center mt-10 text-slate-700 font-semibold italic'>{error}</h1> : <h1 className="text-3xl font-bold mb-2 ml-3">Technology, Entertainment, Sports, Gossip</h1>}
      {
        loading ? <div className='flex pt-12 pr-9 justify-center w-screen h-96'><ClipLoader color={"#52bfd9"} size={200}/></div> : (
          <div className={posts ?"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : '' }>
        {posts && Array.isArray(posts) ? posts.map((post) => (
          <div key={post._id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-600">{`${post.content}`.slice(0,200)}....</p>
            <div className='flex'>
              <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 flex-2/3 mr-2">
                <Link href={'post/' + post._id } state={{postId:post._id, postTitle: post.title, postContent: post.content}}>Read More -&gt;
                </Link>
              </button>
              <div className='mt-2 px-4 py-2 rounded flex-2/3 font-semibold text-sm'>Author: {post.author}</div>
            `</div>`
          </div>
        )) : ''}
      </div>
        )
      }
    </div>
  );
};

export default Home;

export const getServerSideProps = async() => {
  try {
    const res = await axiosInstance.get("/blog?featured=true");
    const data = await res.data.data || [];

    return {
    props: {
      posts: data
    }
    }
  } catch (err) {
    console.log(err);
    return {
      props: {
        err: 'Oops there seems to be an issue. Please refresh your browser',
      }
    }
  }
}