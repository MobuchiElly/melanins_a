import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/userSlice";
import { FadeLoader } from "react-spinners";
import { useRouter } from "next/router";
import axiosInstance from "@/utils/axios";
import EmailVerificationSuccessModal from "@/components/modals/EmailVerificationSuccessModal";

const Auth = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [toggle, setToggle] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ModalContent, setModalContent] = useState("");
  const [showPwField, setShowPwField] = useState(true);

  const router = useRouter();
  const dispatch = useDispatch();

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };
  const clearInput = () => {
    setEmail("");
    setPassword("");
    setName("");
  };
  const handleToggle = () => {
    setToggle(!toggle);
    setShowPwField(true);
    clearMessages();
  };
  const validateEmail = (email) => {
    const regx =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.trim().toLowerCase().match(regx)) return false;
    return true;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!name) {
      setError("Name is required");
      return;
    }
    if (!email) {
      setError("Valid email is required");
      return;
    }
    if (!password) {
      setError("Input your password");
      return;
    }
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      setError("Please provide a valid email");
      return;
    }
    setAuthLoading(true);
    try {
      const response = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });
      if (response.status === 201) {
        setModalContent(
          <>
            <h3 className="text-lg font-semibold mb-4">
              Account Creation Successful
            </h3>
            <p className="text-sm">
              A verification link has been sent to your email address.
            </p>
          </>
        );
        clearInput();
        setShowSuccessModal(true);
      }
    } catch (error) {
      setSuccessMessage("");
      if (error.response?.status !== 503) {
        setError(error.response?.data?.error || "Unable to create account");
        return;
      }
      setError("Check your internet connection!");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email) {
      setError("Please provide email");
      return;
    }
    if (!password) {
      setError("Input your password");
      return;
    }
    if (!validateEmail(email)) {
      setError("Email is invalid. Enter a vali email");
      return;
    };
    setAuthLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      const data = response.data.data;
      if (response.status == 200) {
        clearInput();
        if (!data?.user) return;
        const { name, email, uid } = data.user;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);

        Cookies.set("authToken",
          JSON.stringify(data.token),
          {
            expires: expiryDate,
            secure: true,
            sameSite: "strict",
        });
        Cookies.set("user", JSON.stringify(data.user), {
          expires: expiryDate,
          secure: true,
          sameSite: "strict",
        });
        
        dispatch(setUser({ name, email, uid }));
        router.back() || router.push("/");
      }
    } catch (error) {
      setAuthLoading(false);
      setSuccessMessage("");
      console.log("error:", error);
      if (error.response?.status !== 503) {
        setError(
          error.response?.data?.error ||
            "Unable to login with these credentials"
        );
        return;
      }
      setError("Check your internet connection");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email) {
      setError("Please Enter Your Email");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid Email. Enter a valid email");
      return;
    }
    setAuthLoading(true);
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      if (res.status === 201) {
        clearInput();
        setModalContent(
          <>
            <h3 className="text-lg font-semibold mb-4">
              Password Reset Link Sent
            </h3>
            <p className="text-sm">
              A password reset link has been sent to your registered email
              address.
            </p>
          </>
        );
        setShowSuccessModal(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to handle your request at the moment"
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const message = successMessage || error;
  const messageStyle = successMessage
    ? "text-green-700"
    : error
    ? "text-red-600"
    : "";

  return (
    <div className="flex justify-center items-center min-h-screen text-white px-6 relative">
      {authLoading && (
        <div className="fixed inset-0 w-screen bg-black bg-opacity-15 z-50 flex justify-center items-center">
          <FadeLoader className="mt-2" />
        </div>
      )}

      <div className="bg-gradient-to-tr from-gray-900 to-cyan-500 px-8 rounded-tl-2xl rounded-br-3xl shadow-md flex flex-col justify-center h-auto py-[8vh]">
        <h2 className="text-2xl mb-4 mt-1 font-semibold">
          {showPwField ? (toggle ? "Register" : "Login") : "Forgot Password"}
        </h2>
        <form
          onSubmit={
            showPwField
              ? toggle
                ? handleRegistration
                : handleLogin
              : handleForgotPassword
          }
        >
          {toggle && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => {
                clearMessages();
                setName(e.target.value);
              }}
              className="w-full mb-4 p-2 border rounded text-black text-lg bg-white"
            />
          )}
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              clearMessages();
              setEmail(e.target.value);
            }}
            className="w-full mb-4 p-2 border rounded text-black text-lg bg-white"
          />
          {showPwField && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                clearMessages();
                setPassword(e.target.value);
              }}
              className="w-full mb-4 p-2 border rounded text-black text-lg bg-white"
            />
          )}
          {showPwField ? (
            <button
              type="submit"
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded font-mono text-xl"
            >
              {toggle ? "Register" : "Login"}
            </button>
          ) : (
            <button
              type="submit"
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded font-mono text-xl"
            >
              Send
            </button>
          )}
          {!toggle && (
            <div className="flex justify-end mb-1 text-sm text-blue-200">
              <button
                type="button"
                onClick={() => setShowPwField(false)}
                className="hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}
        </form>
        <p className="mt-4 text-center">
          {toggle ? "Already have an account?" : "Don't have an account?"}{" "}
          <button className="text-blue-500" onClick={handleToggle}>
            {toggle ? (
              <span className="text-white font-bold">Login</span>
            ) : (
              <span className="text-white font-bold">Register</span>
            )}
          </button>
        </p>

        {message && (
          <div
            className={`min-h-6 h-auto text-center font-semibold bg-white w-auto rounded-tl-lg rounded-br-lg mt-3 px-2 py-1 ${messageStyle}`}
          >
            {message}
          </div>
        )}
      </div>
      <EmailVerificationSuccessModal
        show={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setModalContent("");
        }}
      >
        {ModalContent}
      </EmailVerificationSuccessModal>
    </div>
  );
};

export default Auth;

export const getServerSideProps = ({ req }) => {
  try {
    const res = req?.cookies;
    const user = res && res.userState ? JSON.parse(res.userState) : null;
    if (user) {
      if (user.status === "admin") {
        return {
          redirect: {
            destination: "/admin/",
            permanent: false,
          },
        };
      } else {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    }
  } catch (err) {
    console.error(err);
  }
  return {
    props: {},
  };
};