import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import {FadeLoader} from 'react-spinners';
import axiosInstance from '../../utils/axios';
import Image from 'next/image';
import { MdThumbUp} from 'react-icons/md';

const Post = ({uid, data}) => {
    const router = useRouter();
    const { postId } = router.query;
    const {data:post, isLiked, totalLikes} = data;
    const [liked, setLiked] = useState(data.isLiked);
    const [likes, setLikes] = useState(data.totalLikes);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(data?.data?.comments || []);
    const [loading, setLoading] = useState(false);
    const [commentSuccess, setCommentSuccess] = useState(false);

    const handleLike = async() => {
        if (!uid) return router.push('/auth');
        try{
            if(liked){
                setLikes(prevLikes => {
                    if (prevLikes > 0) return prevLikes - 1;
                    if (prevLikes == 0) return 0
                });
                setLiked(false);
                const res = await axiosInstance.delete(`/blog/${postId}/likes`);
            }
            if(!liked){
                setLikes(prevLikes => prevLikes + 1);
                setLiked(true);
                const res = await axiosInstance.post(`/blog/${postId}/likes`, liked);
            }
        } catch(err) {
            console.log(err);
        }
    };

    const textFommater = (input) => {
        let text = input.trim();
        const t = text.replace(/(\.\s*\w)/g, function(match){
            return match.toUpperCase();
        });
        const formattedText = t.charAt(0).toUpperCase() + t.slice(1);
        return (formattedText);
    }
    
    const handleComment = async() => {
        if(uid){
            const createdComment = textFommater(comment);
            try{
                const res = await axiosInstance.post('/comments/' + postId, {
                    "content": createdComment
                });
                const resdata = await res.data;
                setLoading(true);
                if(res.status == 201){
                    setCommentSuccess(true);
                    // setComments([...comments, resdata.comment]);
                    setComment("");
                }
            } catch(err){
                console.log(err);
            } finally{
                setLoading(false);
            }
        } else {
            router.push('/auth');
        }
        
    };

    const formatContent = (content) => {
        return content.split('\n').map((str, index) => (
            <React.Fragment key={index}>
                {str}
                <br />
            </React.Fragment>
        ));
    }

    return (
        <div className="w-screen max-w-[96%] lg:max-w-[85%] mx-auto pb-10 min-h-[80vh] px-1 lg:px-4 z-20">
            { loading ? 
            <div className='flex justify-center h-80 items-center pb-2'><FadeLoader size={300}/></div> 
            : 
            <div className="bg-white rounded-xl px-2 py-2">
                {post && <div>
                    <h1 className="text-4xl font-bold mb-2 lg:mb-6 text-center py-4 px-2">{post.title}</h1>
                    <div className="md:max-w-[90%] lg:max-w-[80%] mx-auto">
                        <div className="flex  items-center justify-center gap-4 p-2">
                        <Image src="https://images.unsplash.com/photo-1715584083775-30132089b98d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2fHx8ZW58MHx8fHx8" alt={`image for ${post.title}`} width={60} height={100} className="h-14 w-16 lg:h-14 rounded-full ml-8 md:ml-0 mr-2 md:mr-2 mt-1 bg-slate-200"/>
                            <p className="text-black  text-xl flex flex-wrap lg:flex-nowrap gap-2 lg:gap-4">
                                <span className="text-gray-600">by<span className="font-[700] ml-2">{post.author}</span></span>
                                <span className="">|</span>
                                <span className="lg:w-auto lg:flex-1">{new Date(post.createdAt).toDateString()}
                                </span>
                            </p>
                        </div>
                        <div className="w-full py-2 mt-2">
                            <Image src={post.image} width={200} height={200} alt="blog post image" className="w-full h-auto max-h-[60vh]" />
                        </div>
                        <div className="bg-white py-4 rounded md:px-1 lg:px-6">
                            <p  className="text-gray-950 text-xl overflow-auto break-words" style={{ wordWrap: 'break-word', maxWidth: '100%' }}>{formatContent(post.content)}</p>
                        </div>
                        <div className="mt-4">
                            <button className="bg-gradient-to-tl from-cyan-500 to-pink-400 text-white px-6 py-2 rounded-lg mr-2 hover:shadow-md lg:group" onClick={handleLike}>
                                <MdThumbUp size={15} color={liked?'blue':'white'} className=" lg:group-hover:animate-bounce"/>
                            </button>
                            <span className="px-1 font-mono text-2xl text-slate-700 pt-2">{likes}</span>
                        </div>
                        <div className="w-full h-1 bg-black bg-opacity-80 my-4"></div>
                        <div className="mt-4">
                            <p className="text-lg text-slate-700 mt-2 pb-2 mb-5">
                                {commentSuccess ? <span>Thank you. Your response would be approved by an admin</span> : <span>Leave a reply</span>}
                            </p>
                            <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className="p-2 mr-2" placeholder="Add a comment" />
                            <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold text-lg shadow-md hover:bg-cyan-500 hover:shadow-lg" onClick={handleComment}>Comment</button>
                        </div>
                        <div className="mt-10 mb-6 py-2 bg-white">
                            {comments && comments.length > 0 && comments.map((comment, index) => (
                                <div key={index} className="bg-gray-100 py-3 rounded-sm mt-3 font-mono px-5">
                                    <span className='text-md'>{comment.content}</span>
                                    <span className='text-sm '> - {comment.writer}</span>
                                </div>
                    
                            ))}
                        </div>
                    </div>
                </div>}
            </div>}
        </div>
    );
};

export default Post;


export const getServerSideProps = async({req, params}) => {
    try{
        const userState  = req?.cookies?.userState || null;
        const uid = JSON.parse(userState)?.uid || null;
        
        let res = [];
        if (!uid) res  = await axiosInstance.get('/blog/' + params.postId);
        if(uid) res = await axiosInstance.get(`/blog/${params.postId}?uid=${uid}`);
        const data = await res.data;
        return {
        props: {
            data,
            uid,
        }
        }
    } catch(err){
        return {
            props: {
                data: [],
            }
        }
    }
}