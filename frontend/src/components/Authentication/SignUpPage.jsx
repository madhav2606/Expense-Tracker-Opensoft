import React, { useState } from "react";
import { Link } from "react-router-dom";
import SignUpImg from "./signUPimg.png"
import { Eye, EyeClosed, Key, KeyRound, Mail } from "lucide-react";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
    } else {
      alert("Sign Up Successful!");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-white">
      {/* Left Side: Illustration */}
      <img
        src={SignUpImg}
        alt="Illustration"
        className="w-180 h-128 md:flex mx-auto"
      />

      <div className="flex items-center justify-center w-full md:w-1/2 h-screen p-10 bg-gray-100">
        <div className="max-w-md w-full">
          <h1 className="text-5xl font-bold mb-8 flex items-center justify-center gap-2 drop-shadow-lg">Join <p className="text-5xl text-purple-800">$PEND</p> Sense</h1>
          <h2 className="text-3xl font-bold text-purple-800 text-center mb-6">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="text-gray-700 font-medium flex gap-2 m-1"><Mail className="w-4.5" />Email</label>
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
            <div className="relative">
              <label className="gap-2 m-1 text-gray-700 font-medium flex">
                <KeyRound className="w-4.5" /> Password
              </label>
              <input
                type={togglePassword ? "password" : "text"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border rounded-md py-2 px-4 focus:outline-none focus:border-purple-500"
                required
              />
              {togglePassword ? <Eye onClick={() => setTogglePassword(!togglePassword)} className="absolute inset-y-9 right-3" /> : <EyeClosed onClick={() => setTogglePassword(!togglePassword)} className="absolute inset-y-9 right-3" />}
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <label className="gap-2 m-1 text-gray-700 font-medium flex">
                <KeyRound className="w-4.5" />Confirm Password
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
              className="w-full bg-purple-700 hover:bg-purple-900 text-white font-medium py-2 px-4 rounded-md"
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
