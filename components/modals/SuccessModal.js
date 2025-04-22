const Modal = ({setModalOpen, title, content}) => {
   
    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center w-screen z-50'>
          <div className='bg-white min-h-52 h-auto p-4 relative rounded-lg shadow-md flex justify-center items-center w-auto min-w-80'>
            <span className='absolute text-slate-700 top-0 left-3 text-2xl cursor-pointer' onClick={() => setModalOpen(false)}>&times;</span>
            <div className='text-center mb-5 min-h-20 h-auto w-full'>
              <h1 className='text-xl font-[900] mb-6 text-slate-500'>{title}</h1>
              <p className='text-slate-800 font-normal'>{content}</p>
            </div>
          </div>
        </div>
    )
  }
  
  export default Modal;