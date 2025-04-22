import Link from "next/link";

const notFound = () => {
  return (
    <div className="text-black flex flex-col items-center h-screen pt-12">
      <h1 className="text-black text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-8">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Go to Home</Link>
    </div>
  );
};

export default notFound;