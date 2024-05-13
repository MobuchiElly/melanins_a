const Tab = ({ tab, activeTab, onClick, children }) => {
    const isActive = tab === activeTab;
    
    return (
      <button
        className={`text-lg font-semibold px-4 py-2 focus:outline-none ${isActive ? 'text-blue-500' : 'text-gray-500'}`}
        onClick={() => onClick(tab)}
      >
        {children}
      </button>
    );
  };
  
  export default Tab;  