import React, { useState } from "react";
import { Link } from "react-router-dom";
import SignInImg from "./Illustration.jpg"

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Sign In Successful!");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-purple-100">
      {/* Left Side: Illustration */}
      <div className="hidden md:flex items-center justify-center bg-purple-600 text-white w-full md:w-1/2">
        <div className="text-center p-10">
          <h1 className="text-3xl font-bold mb-4">Welcome to Spend Sense</h1>
          <img
            src={SignInImg}
            alt="Illustration"
            className="w-3/4 mx-auto"
          />
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-10 bg-white">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-purple-600 text-center mb-6">
            Sign In
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Social Login */}
            <button
              type="button"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md"
            >
              Login with Google
            </button>
            <button
              type="button"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
            >
              Login with Facebook
            </button>

            <div className="text-center text-gray-500">OR</div>

            {/* Email Input */}
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full border rounded-md py-2 px-4 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border rounded-md py-2 px-4 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Login
            </button>
          </form>

          <div className="flex justify-between text-sm mt-4">
            <label>
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="#" className="text-purple-500 hover:underline">
              Forgot Password?
            </a>
          </div>

          <div className="text-center text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/signUp" className="text-purple-600 font-medium">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

