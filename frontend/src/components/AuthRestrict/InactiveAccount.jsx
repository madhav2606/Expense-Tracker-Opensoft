import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const InactiveAccount = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user?.status === "Active") {
      navigate("/");
    }
  }, [user]);

  const handleStatus = async () => {
    const isConfirmed = window.confirm("Are you sure you want to change the status of this user?");
    if (!isConfirmed) return;

    try {
      const email = user?.email;
      const response = await fetch(`${process.env.VITE_BACKEND_URL}/changeStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const res = await response.json();
      setUser(res.user); 

        navigate("/"); 
    } catch (error) {
      console.log("Error changing status:", error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Inactive Account</h2>
          <p className="text-center text-gray-600 mb-6">
            Your account is currently inactive. To regain access to all features, please reactivate your account.
          </p>
          <button
            onClick={handleStatus}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
          >
            Reactivate Account
          </button>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <a href="#" className="text-sm text-blue-600 hover:underline block text-center">
            Need help? Contact support
          </a>
        </div>
      </div>
    </div>
  );
};

export default InactiveAccount;
