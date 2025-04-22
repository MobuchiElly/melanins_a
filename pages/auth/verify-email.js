import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axiosInstance from "@/utils/axios";

const VerifyEmailPage = () => {
  const [status, setStatus] = useState("Verifying...");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { vt, email } = router.query;

  useEffect(() => {
    const verifyEmail = async () => {
      if (!router.isReady) return;
      if (!vt || !email) {
        setStatus("Invalid verification link.");
        setError(true);
        return;
      }
      try {
        const res = await axiosInstance.post("/auth/verify-email", {
          verificationToken: vt,
          email,
        });
        setStatus(res.data.message || "Email verified successfully!");
        setTimeout(() => router.push("/"), 3000);
      } catch (err) {
        setError(true);
        if (err.response?.status !== 503){
          setStatus(err.response?.data?.error || "Verification failed."); 
          return;
        }   
        setStatus("Check your internet connection!!");
      }
    };

    verifyEmail();
  }, [email, vt, router]);

  const handleResend = async () => {
    if (!email){
      setError(true);
      setStatus("Kindly access the verification link in your email");
      return;
    } 
    try {
      setError(false);
      setLoading(true);
      setStatus("Resending verification link...");
      const res = await axiosInstance.post("/auth/resend-verification", {
        email,
        redirect_url: process.env.NODE_ENV == "development" ? process.env.REDIRECT_URL : process.env.NEXT_PUBLIC_REDIRECT_URL
      });
      setStatus(res.data.message || "Verification email sent!");
    } catch (err) {
      setError(true);
      if (err.response?.status !== 503){
        setStatus(err.response?.data?.error || "Failed to resend email.");
        return;
      }
      setStatus("Network error. Kindly check your connection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-100 to-pink-50">
      <div className="bg-white px-2 py-8 mx-2 md:mx-0 md:p-8 mb-6 md:mb-8 lg:mb-0 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Email Verification</h1>
        <p className={`mb-4 text-lg ${error ? "text-red-600" : loading ?"text-blue-600" : "text-green-600"}`}>{status}</p>

        {error && email && (
          <div className="flex flex-col gap-2 items-center">
            <button
              onClick={handleResend}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
              disabled={loading}
            >
              {loading ? "Resending Verification Email..." : "Resend Verification Email"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 

export default VerifyEmailPage;