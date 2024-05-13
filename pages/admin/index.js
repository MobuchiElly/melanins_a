import { useState, useEffect } from 'react';
import Link from 'next/link';
import ApproveComment from '@/components/adminComponents/ApproveComments';
import ManagePosts from '@/components/adminComponents/ManagePosts';
import CreatePost from '@/components/adminComponents/CreatePost';


const NewPost = () => {
  
  const [tab, setTab] = useState({
    create:false,
    manage:true,
    approve:false
  })
  const handleTab = (v) => {
    setTab({
      create: v == "create",
      manage: v == "manage",
      approve: v == "approve"
    })  
  }

  return (
    <div className='min-h-96 flex justify-center p-2 text-sm border  w-screen lg:max-w-[90%] md:mx-auto px-8 py-8'>
      <div className='bg-gray-50 border-2 max-w-48 min-w-[85%]'>
        <div className='bg-slate-600 text-white flex'>
          <Link href="" onClick={()=>handleTab('create')} className={`flex-1 mr-2 p-4 text-center ${ tab.create ? 'bg-slate-700' : ''}`}>Create Article</Link>
          <Link href="" onClick={()=>handleTab('manage')} className={`flex-1 mr-2 p-4 text-center ${ tab.manage ? 'bg-slate-700' : ''}`}>Manage Articles</Link>
          <Link href="" onClick={()=>handleTab('approve')} className={`flex-1  p-4 text-center ${ tab.approve ? 'bg-slate-700' : ''}`}>Approve Comments</Link>
        </div>
        <div className=''>
          {
            tab.create ? (
              <CreatePost />
            )         
             : 
             tab.manage ? (
              <div>
                <ManagePosts />
              </div>
             )
              : 
              tab.approve ? (
                  <ApproveComment/>
              )
               : ''
          }
        </div>
      </div>
    </div>
  );
};

export default NewPost;