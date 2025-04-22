const EmailVerificationSuccessModal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-black relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default EmailVerificationSuccessModal;