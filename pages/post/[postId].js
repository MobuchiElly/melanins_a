import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import axiosInstance from '../../utils/axios';

const Post = ({data}) => {
    const router = useRouter();
    const { postId } = router.query;
    console.log(router.query)
    console.log("postId:", postId);
    const [post, setPost] = useState([])
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log('data:', data);
    const fetchSinglePost = async() =>{
        if(postId) {
            try{
                const res = await axiosInstance.get('/blog/' + postId);
                const data = await res.data;
                data ? setLoading(false) :  null;
                setPost(data);
                setComments(post.comments);
            }catch(err){
                console.log(err);
            }
        }
    }

    const handleLike = () => {
        if (!liked) {
            setLikes(likes + 1);
        } else {
            setLikes(likes - 1);
        }
        setLiked(!liked);
    };

    const handleComment = async() => {
        const createdComment = comment.trim();
        const res = axiosInstance.post('/comments/' + postId, {
            "content": createdComment
        });
        setLoading(true);
        if(res.ok){
            setLoading(false);
        }
    };
    useEffect(() => {
      fetchSinglePost();
        
      return () => {
        fetchSinglePost;
      }
    }, [postId])
    
    return (
        <div className="container mx-auto px-4 py-8 min-h-[80vh]">
            {loading ? 
            <div className='pt-6 flex justify-center h-80'><ClipLoader color={"#52bfd9"} size={220}/></div> : <div>
                <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
                <p className="text-gray-600 mb-4 text-lg">Published by {post.author} on {new Date(post.createdAt).toDateString()}</p>
                <div className="bg-white py-4 rounded shadow">
                    <p className="text-gray-600">{post.content}</p>
                </div>
                <div className="mt-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={handleLike}>
                        {liked ? 'Unlike' : 'Like'}
                    </button>
                    <span>{likes} {likes === 1 ? 'like' : 'likes'}</span>
                </div>
                <div className="mt-4">
                    <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className="border p-2 mr-2" placeholder="Add a comment" />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleComment}>Comment</button>
                </div>
                <div className="mt-4">
                    {post.comments && post.comments.map((comment, index) => (
                        <div key={index} className="bg-gray-100 p-2 rounded mt-2">
                            <span className='text-sm'>{comment.content}</span>
                            <span className='capitalize text-sm'> - {comment.writer}</span>
                        </div>
                
                    ))}
                </div>
            </div>}
        </div>
    );
};

export default Post;


export const getServerSideProps = async({req}) => {
    try{
        const postId = req?.query?.postId;
        // console.log('hello')
        // console.log(postId, 'id')
        const res = await axiosInstance.get("/blog/" + postId);
        console.log("postId inGssprops", postId);
        return {
        props: {
            data: data
        }
        }
    } catch(err){
        console.log(err);
        return {
            props: {

            }
        }
    }
}