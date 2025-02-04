import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

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
                const response = await fetch("http://localhost:3000/verify", {
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
                const response = await fetch(`http://localhost:3000/users/${storedUser._id}`, {
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
    }, [user,isAuthenticated]);

    const signIn = async (email, password) => {
        try {
            const response = await axios.post("http://localhost:3000/signin", { email, password });

            if (response.status === 200) {
                const { token, user } = response.data;
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                setIsAuthenticated(true);
                setUser(user);
                navigate("/");
            }
        } catch (error) {
            console.error("Sign-in error:", error.response?.data?.message);
        }
    };

    const signUp = async (name, email, password) => {
        try {
            const response = await axios.post("http://localhost:3000/signup", {
                name,
                email,
                password,
            });

            if (response.status === 201) {
                console.log("Successfully signed up");
                navigate("/signin");
            }
        } catch (error) {
            console.error("Sign-up error:", error.response?.data?.message);
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            const userId = storedUser ? JSON.parse(storedUser)._id : null;

            if (!token || !userId) {
                alert("You are not signed in");
                navigate("/signin");
                return;
            }

            await axios.post("http://localhost:3000/logout", { userId }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsAuthenticated(false);
            setUser(null);
            console.log("Signed out");
            navigate("/signin");
        } catch (error) {
            console.error("Logout error:", error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, signIn, signUp, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
