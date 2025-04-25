import { useState, useEffect } from 'react';
import FadeLoader from 'react-spinners/FadeLoader';
import axiosInstance from '@/utils/axios';
import axios from 'axios';
import Image from 'next/image';

const ManagePosts = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedPostImage, setselectedPostImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [allTags, setAllTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState(new Set());
    const [strTags, setStrTags] = useState('');
    const [image, setImage] = useState(null);
    const handleSearch = () => {
        fetchPosts();
        setCurrentPage(1);
    };

    const handleEdit = async(post) => {
        setSelectedPost(post);
        setIsEditing(true);
    };

    const handleSave = async() => {
        try{
            let data = null;
            if(image){
                data = new FormData();
                data.append("file", image);
                data.append("upload_preset", "melaninDb");
            }
            const { title, content} = selectedPost;
            const selectedPostTags = selectedPost.tags.map(tag=>tag.trim()).filter(tag=>tag !== "");
            if(title || content || image || selectedPostTags){
                let updatedPost = null;
                if(image){
                    const uploadRes = await axios.post(process.env.NEXT_PUBLIC_CLOUDINARY_ENDPOINT, data);
                    const {url} = await uploadRes.data;
                    updatedPost = await axiosInstance.patch('/blog/' + selectedPost._id, {...selectedPost, tags:selectedPostTags, image:url});
                } else {
                    updatedPost = await axiosInstance.patch('/blog/' + selectedPost._id, {...selectedPost, tags:selectedPostTags});
                }
                
                if(updatedPost){
                    setPosts(prevPosts => prevPosts.map(post => post._id===selectedPost._id ? selectedPost : post));
                    //  setAllTags(prevTags => [...prevTags, selectedPostTags])
                }
                setIsEditing(false);
                setSelectedPost(null);
                setImage(null);
            }else{
                setError('Title and Content are required');
                console.error('Title and Content are required');
            }
        } catch(err){
            console.error(err.message);
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedPost(null);
        setImage(null);
    };

    const handleDelete = async(postId) => {
        try{
            const delPost = await axiosInstance.delete('/blog/' + postId);
            setPosts((prevPost) => posts.filter(post => post._id !== postId));
            setLoading(false);
        } catch(err){
            setError(err);
            console.error(err);
        }
    };

    const handleTagChange = (checked, value) => {
        if(checked){
            setSelectedTags(prevTags => {
                const newTags = new Set(prevTags);
                newTags.add(value);
                return newTags;
            });
        } else {
            setSelectedTags(prevTags => {
                const newTags = new Set(prevTags);
                newTags.delete(value);
                return newTags;
            });
        }
    }; 
    
    const fetchPosts = async () => { 
        if(selectedTags){
            setStrTags([...selectedTags].join(", "));
        }
        try {
            const res = await axiosInstance.get(`/blog?page=${currentPage}&search=${searchTerm}&tags=${strTags}`);
            const { data, totalPages } = res.data;
            setPosts(data);
            setTotalPages(totalPages);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            console.error('Unable to fetch blog posts', err);
        }
    };
    useEffect(() => {
        fetchPosts();
        
    }, [currentPage, searchTerm, selectedTags]);
    useEffect(() => {
        posts.forEach(post => {if(post.tags && post.tags.length){ 
                setAllTags((prevTags) => {
                    const newtags = post.tags.filter(tag=>!prevTags.includes(tag));
                    return [...prevTags, ...newtags]
                })
            }});
    }, [posts]);
    
    return (
        <div className="p-4 max-w-[95%] lg:max-w-[80%] mx-auto overflow-x-auto">
            { loading ? <div className='pt-6 flex justify-center h-80'><FadeLoader color={"#52bfd9"} size={220}/></div> : <div>
            <div className="flex items-center mr-4">
                <input
                    type="text"
                    placeholder="Search by title, content or tags"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 mr-2"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Search
                </button>
            </div>
            <div className="grid grid-cols-2 pl-2 md:grid-cols-4 lg:grid-cols-6 gap-1 mt-3 mb-2 py-1">
                {allTags && allTags.map((tag, index) => (
                    <label className="mr-2 flex items-center" key={index}>
                    <input
                        type="checkbox"
                        name={tag}
                        value={tag}
                        onChange={(e) => handleTagChange(e.target.checked, e.target.value)}
                        className="mr-2 form-checkbox rounded-full text-blue-500"
                    />
                    <span className='font-semibold'>{tag}</span>
                </label>
                ))
                }
            </div>
            <table className="mt-4 w-full min-h-[100%] table-auto overflow-x-scroll">
                <thead className='bg-slate-50 border'>
                    <tr className=''>
                        <th className="w-1/5 border">Title</th>
                        <th className="w-1/5 border">Author</th>
                        <th className="w-1/5 border">Article</th>
                        <th className="w-1/5 border">Date Created</th>
                        <th className="w-1/5 border">Impressions (likes)</th>
                        <th className="w-1/5 border">Actions</th>
                    </tr>
                </thead>
                <tbody className='bg-slate-50'>
                    {posts.map((post) => (
                        <tr key={post._id}>
                            <td className="border px-4 py-2">{post.title}</td>
                            <td className="border px-4 py-2">{post.author}</td>
                            <td className="border px-4 py-2 text-wrap">{post.content.slice(0, 60)}....</td>
                            <td className="border px-4 py-2">{new Date(post.createdAt).toDateString()}</td>
                            <td className="border px-4 py-2">{post.likes.length}</td>
                            <td className="border px-4 py-2 inline-flex">
                                <button
                                    onClick={() => handleEdit(post)}
                                    className="bg-blue-500 text-white px-3 py-2 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(post._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Del
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 flex justify-between">
                <button
                    onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Next
                </button>
            </div>
            </div> } 
            {isEditing && selectedPost && (
            <div className="fixed inset-0 w-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className='bg-white p-4 rounded shadow-md'>
                    <h4 className='text-lg mb-4 font-bold'>Edit Post</h4>
                    <div className='flex flex-col  lg:flex-row  items-start lg:items-end mb-1 min-h-[20vh] border border-gray-300 rounded px-2 pt-1'>
                        <Image src={image ? URL.createObjectURL(image) : selectedPost.image} width={100} height={200} alt="" className="mr-2 rounded-md w-[48vw] lg:w-[28vw]  bg-gray-800 bg-opacity-10 h-[20vh] mb-2 lg:mb-0"/>
                        <div className='mb-1'>
                            <input type="file" onChange={(e) => setImage(e.target.files[0])}/>
                        </div>
                    </div>
                    <input
                        type="text"
                        value={selectedPost.title}
                        onChange={(e) =>
                            setSelectedPost({ ...selectedPost, title: e.target.value })
                        }
                        className="border border-gray-300 rounded px-3 py-2 mb-2 w-full"
                    />
                    <textarea
                        value={selectedPost.content}
                        onChange={(e) =>
                            setSelectedPost({ ...selectedPost, content: e.target.value })
                        }
                        className="border border-gray-300 rounded px-3 py-2 mb-2 w-full h-32 resize-none"
                    ></textarea>
                    <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedPost.featured}
                                onChange={(e) =>
                                    setSelectedPost({ ...selectedPost, featured: e.target.checked})
                                }
                                className="mr-2 form-checkbox rounded-full text-blue-500"
                            />
                            Featured
                        </label>
                        <input
                            type="text"
                            placeholder="Add tags separated by commas"
                            value={selectedPost.tags.join(',')}
                            onChange={(e) =>{
                                    setSelectedPost({ ...selectedPost, tags: e.target.value.split(',').map(tag=>tag.trim())})
                            }}
                            className="border border-gray-300 rounded px-3 py-2 w-1/2"
                        />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <label className="flex items-center">
                            Author:
                            <input
                                type="text"
                                value={selectedPost.author}
                                onChange={(e) =>
                                    setSelectedPost({ ...selectedPost, author: e.target.value })
                                }
                                className="border border-gray-300 rounded px-3 py-2 ml-2"
                            />
                        </label>
                    </div>
                    <div>
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default ManagePosts;