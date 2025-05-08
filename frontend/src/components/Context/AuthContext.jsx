import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../Message/Toast";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);

    const showToast = (message, type) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };


    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                if (isAuthenticated) {
                    setIsAuthenticated(false);
                    navigate("/signin");
                }
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/verify`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await response.json();
                if (!data.authenticated) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setIsAuthenticated(false);
                    navigate("/signin");
                } else {
                    setIsAuthenticated(true);
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Error verifying token:", error);
                setIsAuthenticated(false);
                navigate("/signin");
            }
        };

        verifyToken();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (!storedUser || !storedUser._id) return;

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${storedUser._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const updatedUser = await response.json();
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (isAuthenticated) fetchUserData(); // Fetch user only when authenticated
    }, [isAuthenticated]);

    const signIn = async (email, password) => {
        try {
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/signin`, { email, password }, { withCredentials: true });

            if (response.status === 200) {
                const { token, user } = response.data;
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                setIsAuthenticated(true);
                setUser(user);

                navigate("/");
                showToast("Signed In successfully!", "success")
            }
        } catch (error) {
            console.error("Sign-in error:", error.response?.data?.message);
            showToast(error.response?.data?.message || "Sign in error. Please try again.", "error")

        }finally {
            setLoading(false);
        }
    };

    const signUp = async (name, email, password) => {
        try {
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
                name,
                email,
                password,
            }, { withCredentials: true });

            if (response.status === 201) {
                showToast("Successfully signed up", "success");
                navigate("/signin");
            }
        } catch (error) {
            console.error("Sign-up error:", error.response?.data?.message);
            showToast(error.response?.data?.message || "Sign up error. Please try again.", "error")
        }finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            const userId = storedUser ? JSON.parse(storedUser)._id : null;

            if (!token || !userId) {
                showToast("You're not Signed in", "error")
                navigate("/signin");
                return;
            }

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/logout`, { userId }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsAuthenticated(false);
            setUser(null);
            showToast("Signed out successfully ", "success");
            navigate("/signin");
        } catch (error) {
            console.error("Logout error:", error.message);
            showToast(error.message || "Logout error. Please try again.", "error")
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, signIn, signUp, logout, setUser, showToast, removeToast, toasts, setToasts,loading }}>
            {children}
            <div className="fixed top-4 right-4 space-y-4">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </AuthContext.Provider>
    );
};
