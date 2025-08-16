import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axiosInstance from "@/utils/axios";

const ResetPassword = () => {
  const router = useRouter();
  const { email, vt } = router.query;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if(!router.isReady) return;
    if(!email || !vt) router.push("/");
  }, [email, vt, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/reset-password", { email, password, passwordResetToken: vt });
      if (response.status === 201){
      setSuccess("Password reset successful. Redirecting to login...");
      setTimeout(() => router.push("/auth"), 3000);
    }
    } catch (err) {
      setError(err.response?.data?.error || "Password reset failed");
    }
  };

  const messageStyle = success
    ? "text-green-700"
    : error
    ? "text-red-600"
    : "";

  return (
    <div className="min-h-screen flex justify-center items-center text-white">
      <div className="bg-gradient-to-tr from-gray-900 to-cyan-500 px-8 rounded-tl-2xl rounded-br-3xl shadow-md flex flex-col justify-center min-h-[50vh] w-full max-w-md mb-4">
        <h2 className="text-2xl mb-4 mt-1 font-semibold text-center">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="mb-1 text-white">New Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mb-4 p-2 border rounded text-black text-lg bg-white"
          />

          <label className="mb-1 text-white">Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full mb-4 p-2 border rounded text-black text-lg bg-white"
          />

          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded font-mono text-xl"
          >
            Reset Password
          </button>
        </form>

        {(error || success) && (
          <div
            className={`min-h-6 h-auto text-center font-semibold bg-white w-auto rounded-tl-lg rounded-br-lg mt-4 px-2 py-2 ${messageStyle}`}
          >
            {success || error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;