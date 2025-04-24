import { useState, useEffect } from 'react';
import Link from 'next/link';
import ApproveComment from '@/components/adminComponents/ApproveComments';
import ManagePosts from '@/components/adminComponents/ManagePosts';
import CreatePost from '@/components/adminComponents/CreatePost';


const Index = () => {
  
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
    <div className='min-h-96 flex justify-center text-sm border  w-full lg:max-w-[90%] md:mx-auto pb-8'>
      <div className='bg-gray-50 border-2 mx-3 lg:mx-2 md:mx-4 md:max-w-48 min-w-[85%]'>
        <h1 className='text-3xl text-center font-bold pb-4 pt-1'>Administration Dashboard</h1>
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

export default Index;

export const getServerSideProps = ({req}) => {
  try{
    const res = req?.cookies;
    const user = res && res.userState ?  JSON.parse(res.userState) : undefined;
    console.log("user:", user);
    if(!user.status || user.status !== "admin"){
      return {
        redirect: {
          destination: "/",
          permanent: false,
        }
      }
    }    
  } catch (err) {
    console.log(err);
  }
  return {
    props: {

    }
  }
}