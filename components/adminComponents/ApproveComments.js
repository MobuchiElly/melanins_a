import { useEffect, useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";
import axiosInstance from "@/utils/axios";
import Tab from "../modals/Tab";
import Cookies from "js-cookie";

const ApproveComment = () => {
    const [pendingComments, setPendingComments] = useState([]);
    const [approvedComments, setApprovedComments] = useState([]);
    const [error, setError] = useState('');
    const [appError, setAppError] = useState('');
    const [activeTab, setActiveTab] = useState("pending");
    const [loading, setLoading] = useState(true);
    

    const fetchPendingComments = async (token) => {
        try {
            const res = await axiosInstance.get('/comments?approved=false', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPendingComments(res.data.data.comments);
            setLoading(false);
            setError(false);
        } catch (err) {
            console.log("err:", err);
            setLoading(false);
            err.code === "ERR_BAD_REQUEST" ? setError(err.response?.data?.error || "Unuthorised to access this") : err.code === "ERR_NETWORK" ? setError("Please check your internet connection") : setError("Please refresh your browser tab");
        }
    }

    const fetchApprovedComments = async (token) => {
        try {
            const res = await axiosInstance.get('/comments?approved=true', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setApprovedComments(res.data.data.comments);
            console.log("approved comments:", res.data.data);
            setLoading(false);
            setAppError('');
        } catch (err) {
            setLoading(false);
            err.code === "ERR_BAD_REQUEST" ? setAppError("Unauthorised to access this") : err.code === "ERR_NETWORK" ? setAppError("Please check your internet connection") : setAppError("Please refresh your browser tab");
            console.error(err);
        }
    }

    useEffect(() => {
        const token = Cookies.get("authToken") ? JSON.parse(Cookies.get("authToken")) : null;
        fetchPendingComments(token);
        fetchApprovedComments(token);
    }, [])
    
    useEffect(() => {
        if (error) {
            setPendingComments([]);
        }
        if (appError) {
            setApprovedComments([]);
        }

    }, [error, appError]);

    const handleTab = (tab) => {
        setActiveTab(tab);
    }
    const handleEdit = async(id, command) => {
        try{
            const token = Cookies.get("authToken") ? JSON.parse(Cookies.get("authToken")) : null;
            if(command === "approve"){
                const res = await axiosInstance.patch('/comments/' + id + '/approvecomment', {
                approved:"true",
                }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                });         
                console.log("res:", res.data);
                setPendingComments(prevComments => prevComments.filter(comment => comment._id !== id));
                setApprovedComments([...approvedComments, res.data.data.comment]);
            }
            if(command === "dismiss"){
                const res = await axiosInstance.patch('/comments/' + id + '/approvecomment', {
                approved:"false",
                }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                });
                setApprovedComments(prevComments => prevComments.filter(comment => comment._id !== id));
                setPendingComments([...pendingComments, res.data.data.comment]);
            }
        } catch(err){
           setError(err.response?.data?.error || "error processing your request");
           console.log(err);
        }
    }
    const handleDelete = async(id) => {
      try{
        const token = Cookies.get("authToken") ? JSON.parse(Cookies.get("authToken")) : null;
        const res = await axiosInstance.delete('/comments/' + id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setPendingComments(prevComments => prevComments.filter(comment => comment._id !== id));
        setApprovedComments(prevComments => prevComments.filter(comment => comment._id !== id));
      } catch(err){
        setError(err);
        console.log(err);
      }
    }
    
    return (
        <div className="max-w-[95%] lg:max-w-[80%] mx-auto bg-yellow-50 shadow-md rounded pb-8 my-4 min-h-80 overflow-x-visible">
            <div className="flex justify-around bg-gray-300">
                <Tab tab="pending" activeTab={activeTab} onClick={handleTab} >Pending</Tab>
                <Tab tab="approved" activeTab={activeTab} onClick={handleTab}>Approved</Tab>
            </div>
            {activeTab === "pending" && error && <p className="text-red-500 text-center">{error}</p>}
            {activeTab === "approved" && appError && <p className="text-red-500 text-center">{appError}</p>}
            { loading ? <div className='pt-6 flex justify-center h-80'><FadeLoader color={"#52bfd9"} size={220}/></div> : 
                <div className=" m-2 p-4 overflow-x-auto min-h-60">
                {activeTab === "pending" && 
                <table className="w-full min-h-[100%] table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-2">Author</th>
                            <th className="px-4 py-2 border-2">Comment</th>
                            <th className="px-4 py-2 border-2">Post Title</th>
                            <th className="px-4 py-2 border-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingComments ? pendingComments.map((comment, index) => (
                            <tr key={`pending-${comment._id}`}>
                                <td className="border px-4 py-2">{comment.writer}</td>
                                <td className="border px-4 py-2">{comment.content}</td>
                                <td className="border px-4 py-2">{comment?.blogPostId?.title}</td>
                                <td className="border px-1 min-w-8 py-2 flex gap-1">
                                <button className=" bg-[#19959e] hover:bg-[#0f6268] text-white font-semibold py-2 px-3 rounded" onClick={() => handleEdit(comment._id, "approve")}>aprv</button>
                                <button className="inline-table bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded" onClick={() => handleDelete(comment._id)}>del</button>
                                </td>
                            </tr>
                        )) : ''}
                    </tbody>
                </table>}
                {activeTab === "approved" && <table className="w-full table-auto overflow-x-scroll">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">Author</th>
                            <th className="px-4 py-2 border">Comment</th>
                            <th className="px-4 py-2 border">Post Title</th>
                            <th className="px-4 py-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {approvedComments && approvedComments.map((comment, index) => (
                        <tr key={`approved-${comment._id}`}>
                            <td className="border px-4 py-2">{comment.writer}</td>
                            <td className="border px-4 py-2">{comment.content}</td>
                            <td className="border px-4 py-2">{comment?.blogPostId?.title}</td>
                            <td className="border px-1 min-w-8 py-2 flex gap-1">
                            <button className=" bg-[#19959e] hover:bg-[#0f6268] text-white font-semibold py-2 px-3 rounded" onClick={() => handleEdit(comment._id, "dismiss")}>pend</button>
                            <button className="inline-table bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded" onClick={() => handleDelete(comment._id)}>del</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>}
            </div>}
        </div>
    )
}

export default ApproveComment;