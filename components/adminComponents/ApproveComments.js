import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import axiosInstance from "@/utils/axios";
import Tab from "../modals/Tab";

const ApproveComment = () => {
    const [pendingComments, setPendingComments] = useState([]);
    const [approvedComments, setApprovedComments] = useState([]);
    const [error, setError] = useState('');
    const [appError, setAppError] = useState('');
    const [activeTab, setActiveTab] = useState("pending");
    const [loading, setLoading] = useState(true);
    

    const fetchPendingComments = async () => {
        try {
            const res = await axiosInstance.get('/comments?approved=false');
            setPendingComments(res.data);
            setLoading(false);
            setError(false);
        } catch (err) {
            setLoading(false);
            setError(err.response.request.statusText + ". " + "Try again");
            console.error(err);
        }
    }

    const fetchApprovedComments = async () => {
        try {
            const res = await axiosInstance.get('/comments?approved=true');
            setApprovedComments(res.data);
            setLoading(false);
            setAppError('');
        } catch (err) {
            setAppError(err.response.request.statusText + ". " + "Try again");
            console.error(err);
        }
    }

    useEffect(() => {
        fetchPendingComments();
        fetchApprovedComments();
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
           if(command === "approve"){
             const res = await axiosInstance.put('/comments/' + id + '/approvecomment', {
                approved:"true",
             });         
             setPendingComments(prevComments => prevComments.filter(comment => comment._id !== id));
             setApprovedComments([...approvedComments, res.data]);
           }
           if(command === "dismiss"){
             const res = await axiosInstance.put('/comments/' + id + '/approvecomment', {
                approved:"false",
             });
             setApprovedComments(prevComments => prevComments.filter(comment => comment._id !== id));
             setPendingComments([...pendingComments, res.data]);
           }
        } catch(err){
           setError(err);
           console.log(err);
        }
    }
    const handleDelete = async(id) => {
      try{
        const res = await axiosInstance.delete('/comments/' + id);
        setPendingComments(prevComments => prevComments.filter(comment => comment._id !== id));
        setApprovedComments(prevComments => prevComments.filter(comment => comment._id !== id));
      } catch(err){
        setError(err);
        console.log(err);
      }
    }
    
    
    return (
        <div className="max-w-[80%] mx-auto bg-yellow-50 shadow-md rounded pb-8 my-4 min-h-80 overflow-x-visible">
            <div className="flex justify-around bg-gray-300">
                <Tab tab="pending" activeTab={activeTab} onClick={handleTab} >Pending</Tab>
                <Tab tab="approved" activeTab={activeTab} onClick={handleTab}>Approved</Tab>
            </div>
            {activeTab === "pending" && error && <p className="text-red-500 text-center">{error}</p>}
            {activeTab === "approved" && appError && <p className="text-red-500 text-center">{appError}</p>}
            { loading ? <div className='pt-6 flex justify-center h-80'><ClipLoader color={"#52bfd9"} size={220}/></div> : 
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
                            <tr key={comment._id}>
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
                        <tr key={comment._id}>
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