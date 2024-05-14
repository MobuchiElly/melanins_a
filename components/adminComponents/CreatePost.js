import { useState } from 'react';
import Modal from '../modals/SuccessModal';
import axiosInstance from '@/utils/axios';
import axios from 'axios';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [tags, setTags] = useState('');
    const [featured, setFeatured] = useState(false);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    
    const handleCreate = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "melanin-a");
        try {
            if (tags.split(',').length < 2) {
                setError('Please add at least two tags');
                return;
            };
            const trimmedTags = tags.split(",").map(tag=>tag.trim()).filter(tag=>tag !== "");
            const uploadRes = await axios.post(process.env.NEXT_PUBLIC_CLOUDINARY_ENDPOINT, data);
            const res = await axiosInstance.post('/blog', {
                title,
                content,
                author,
                tags: trimmedTags,
                featured,
            });
            if (data && data.post.title && data.post.content) {
                setTitle('');
                setContent('');
                setAuthor('');
                setTags('');
                setError('');
                setFeatured(false);
                setModalOpen(true);
            }
        } catch (err) {
            setError(err);
            console.error(err);
        }
    };

    return (
        <div>
            <form onSubmit={handleCreate} className="max-w-md mx-auto bg-yellow-50 shadow-md rounded px-8 pt-6 pb-8 my-4">
                <h1 className='text-lg font-[700] mb-6 text-center'>Let out your Creativity</h1>
                <p className='text-center text-red-600 font-[600]'>{error}</p>
                <div className="mb-4">
                    <label htmlFor="image" className="block text-gray-700 font-bold mb-2">
                        Image
                    </label>
                    <input
                        type="text"
                        id="image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md bg-yellow-50"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md bg-yellow-50"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="content" className="block text-gray-700 font-bold mb-2">
                        Content
                    </label>
                    <textarea
                        id="content"
                        cols={30}
                        rows='10'
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-yellow-50 resize-none"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="author" className="block text-gray-700 font-bold mb-2">
                        Author
                    </label>
                    <input
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md bg-yellow-50"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="tags" className="block text-gray-700 font-bold mb-2">
                        Tags (separated by commas)
                    </label>
                    <input
                        type="text"
                        id="tags"
                        placeholder='music, sports'
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md bg-yellow-50"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="featured" className="block text-gray-700 font-bold mb-2">
                        Featured Post
                    </label>
                    <select
                        id="featured"
                        value={featured ? 'yes' : 'no'}
                        onChange={(e) => setFeatured(e.target.value === 'yes')}
                        className="w-1/3 px-3 py-2 border rounded-md bg-yellow-50"
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-[#16868e] text-white px-4 py-2 rounded hover:bg-[#11b1bd]">
                    Publish Article
                </button>
            </form>
            {modalOpen && <Modal setModalOpen={setModalOpen} title="Congratulations!!" content="Article Publication was Successful" />}
        </div>
    );
};

export default CreatePost;