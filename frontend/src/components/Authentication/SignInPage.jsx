import React, { useState } from "react";
import { Link } from "react-router-dom";
import SignInImg from "./Illustration.jpg"
import { Eye, EyeClosed, KeyRound, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import Toast from "../Message/Toast";



const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const { signIn} = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    signIn(email, password)
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen items-center justify-center bg-white-100">
      
      <img
        src={SignInImg}
        alt="Illustration"
        className="w-150 h-150 mx-auto"
      />
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 h-screen p-10 bg-gray-100">
        <h1 className="text-5xl font-bold mb-8 flex items-center gap-2 drop-shadow-lg">Welcome to <p className="text-5xl text-purple-800">$PEND</p> Sense</h1>
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-purple-600 text-center mb-6">
            Sign In
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="button"
              className="w-full bg-white shadow-md hover:bg-gray-50 text-black font-medium py-2 px-4 rounded-md"
            >
              <img src="https://img.icons8.com/color/48/000000/google-logo.png" className="w-6 h-6 inline-block mr-2" />
              Login with Google
            </button>
            <button
              type="button"
              className="w-full bg-white shadow-md hover:bg-gray-50 text-black font-medium py-2 px-4 rounded-md"
            >
              <img src="https://img.icons8.com/color/48/000000/facebook-new.png" className="w-6 h-6 inline-block mr-2" />
              Login with Facebook
            </button>

            <div className="text-center text-gray-500">OR</div>

            {/* Email Input */}
            <div>
              <label className="gap-2 m-1 text-gray-700 font-medium flex"><Mail className="w-4.5" />Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full bg-white border rounded-md py-2 px-4 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="gap-2 m-1 text-gray-700 font-medium flex">
                <KeyRound className="w-4.5" />Password
              </label>
              <div className="relative w-full">

                <input
                  type={togglePassword ? "password" : "text"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white border rounded-md py-2 px-4 focus:outline-none focus:border-purple-500"
                  required
                />
                {togglePassword ? <Eye onClick={() => setTogglePassword(!togglePassword)} className="absolute inset-y-2 right-3" /> : <EyeClosed onClick={() => setTogglePassword(!togglePassword)} className="absolute inset-y-2 right-3" />}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-900 text-white font-medium py-2 px-4 rounded-md"
            >
              Login
            </button>
          </form>

          <div className="flex justify-between text-sm mt-4">
            <label>
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="#" className="text-purple-800 hover:underline">
              Forgot Password?
            </a>
          </div>

          <div className="text-center text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/signUp" className="text-purple-700 font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

