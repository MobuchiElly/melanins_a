import React from 'react';

const Modal = ({ isOpen, closeModal, post, handleSave, handleCancel }) => {
  if (!isOpen) {
    return null;
  }


  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>Edit Post</h2>
        <div>
          <label>Title:</label>
          <input type="text" value={post.title} />
        </div>
        <div>
          <label>Content:</label>
          <textarea value={post.content} />
        </div>
        <button onClick={closeModal}>Close</button>
        <button onClick={handleSave}>Save Changes</button>
        <button onClick={handleCancel}>Save Changes</button>
      </div>
    </div>
  );
};



export default Modal;