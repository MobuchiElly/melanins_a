import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axiosInstance from "@/utils/axios";

const VerifyPasswordReset = () => {
  const router = useRouter();
  const { email, vt } = router.query;

  const [status, setStatus] = useState("Verifying token...");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!router.isReady) return;
      if (!email || !vt) {
        setStatus("Invalid verification link.");
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.post("/auth/verify-password-reset-token", {
          email,
          pvt: vt,
        });

        setStatus(res.data.message || "Token verified successfully!");
        setTimeout(() => {
          router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&vt=${encodeURIComponent(vt)}`);
        }, 2500);
      } catch (err) {
        setError(true);
        if (err.response?.status !== 503) {
          setStatus(err.response?.data?.error || "Verification failed.");
        } else {
          setStatus("Check your internet connection!");
        }
        setLoading(false);
      }
    };

    verifyToken();
  }, [email, vt, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50">
      <div className="bg-white px-2 py-8 mx-2 md:mx-0 md:p-8 mb-6 md:mb-8 lg:mb-0 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Reset Token Verification</h1>
        <p className={`mb-4 text-lg ${error ? "text-red-600" : loading ? "text-blue-600" : "text-green-600"}`}>
          {status}
        </p>
      </div>
    </div>
  );
};

export default VerifyPasswordReset;
