import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center h-screen pt-12">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Go to Home</Link>
    </div>
  );
};

export default NotFound;