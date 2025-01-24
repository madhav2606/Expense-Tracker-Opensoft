import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
    } else {
      alert("Sign Up Successful!");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-purple-100">
      {/* Left Side: Illustration */}
      <div className="hidden md:flex items-center justify-center bg-purple-600 text-white w-full md:w-1/2">
        <div className="text-center p-10">
          <h1 className="text-3xl font-bold mb-4">Join Spend Sense</h1>
          <img
            src="https://via.placeholder.com/400"
            alt="Illustration"
            className="w-3/4 mx-auto"
          />
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-10 bg-white">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-purple-600 text-center mb-6">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Confirm Password Input */}
            <div>
              <label className="block text-gray-700 font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full border rounded-md py-2 px-4 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Register
            </button>
          </form>

          <div className="text-center text-sm mt-6">
            Already have an account?{" "}
            <Link to="/signIn" className="text-purple-600 font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
