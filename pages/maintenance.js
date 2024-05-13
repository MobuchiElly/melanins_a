import Link from "next/link";

const Maintenance = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center pb-44 w-screen lg:max-w-[90%] md:mx-auto ml-4">
      <div className="border border-gray-200 p-8  rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          This page is currently undergoing maintenance
        </h1>
        <p className="text-lg mb-6">
          We&lsquo;re sorry for the inconvenience. Please check back later.
        </p>
        <Link href="/">
          <span className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Back Home
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Maintenance;