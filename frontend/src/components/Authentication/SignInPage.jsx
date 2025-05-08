import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, KeyRound, Loader, Mail, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Toast from "../Message/Toast";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading } = useAuth();
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [checkEmail, setCheckEmail] = useState("");
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    signIn(email, password);
  };

  const checkEmailHandler = async () => {
    if (checkEmail.trim() === "") {
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: checkEmail }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setIsResetPasswordModalOpen(true);
        setIsForgotModalOpen(false);
      } else {
        setIsForgotModalOpen(false);
        showToast("User not found", "error");
      }
    } catch (error) {
      console.error("Error checking email:", error);
      showToast("Error checking email", "error");
    }
  };

  const ResetPasswordHandler = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: checkEmail, newPassword }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setIsResetPasswordModalOpen(false);
        setNewPassword("");
        setCheckEmail("");
        showToast("Password reset successfully", "success");
      }
      else {
        setIsResetPasswordModalOpen(false);
        showToast("User not found", "error");
      }
    }
    catch (error) {
      console.error("Error resetting password:", error);
      showToast("Error resetting password", "error");
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-700">Signing in...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="fixed top-4 right-4 z-50">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
      <div className="w-full h-screen lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-purple-500 to-purple-800">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Welcome to <span className="text-yellow-300">$PEND</span> Sense
          </h1>
          <p className="text-white text-lg mb-8">
            Manage your finances smarter and take control of your spending habits
          </p>


          <div className="mt-12 hidden lg:block">
            <p className="text-white text-sm">
              "The app that helped me save over $5,000 in just six months!"
            </p>
            <p className="text-white text-xs mt-2">- Sarah Johnson</p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Sign In</h2>
            <p className="mt-2 text-sm text-gray-600">
              Access your account to track your spending
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              {/* Social login buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                >
                  <span className="flex items-center">
                    <img
                      src="https://img.icons8.com/color/48/000000/google-logo.png"
                      className="w-5 h-5 mr-2"
                      alt="Google"
                    />
                    Google
                  </span>
                </button>
                <button
                  type="button"
                  className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                >
                  <span className="flex items-center">
                    <img
                      src="https://img.icons8.com/color/48/000000/facebook-new.png"
                      className="w-5 h-5 mr-2"
                      alt="Facebook"
                    />
                    Facebook
                  </span>
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <KeyRound className="w-4 h-4 mr-2" />
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-sm flex  justify-end">
              <button onClick={() => setIsForgotModalOpen(true)} className="font-medium text-purple-600 hover:text-purple-500 transition-all duration-200">
                Forgot your password?
              </button>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signUp" className="font-medium text-purple-600 hover:text-purple-500 transition-all duration-200">
                Sign Up
              </Link>
            </p>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {isForgotModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-semibold text-slate-800">Forgot Password</h3>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-5">
              <label htmlFor="Email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                id="email"
                type="text"
                placeholder="Recovery Email"
                value={checkEmail}
                onChange={(e) => setCheckEmail(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => checkEmailHandler()}
                disabled={checkEmail.trim() === ""}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${checkEmail.trim()
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-200 text-purple-400 cursor-not-allowed'
                  }`}
              >
                check Email
              </button>
            </div>
          </div>
        </div>
      )}

      {isResetPasswordModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-semibold text-slate-800">Forgot Password</h3>
              <button
                onClick={() => setIsResetPasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-5">
              <label htmlFor="Email" className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <input
                id="password"
                type="text"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsResetPasswordModalOpen(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => ResetPasswordHandler()}
                disabled={newPassword.trim() === ""}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${newPassword.trim()
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-200 text-purple-400 cursor-not-allowed'
                  }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInPage;