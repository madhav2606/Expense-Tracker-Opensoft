import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token")
    );
    const [user, setUser] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsAuthenticated(false);
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
                    navigate("/signin");
                } else {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Error verifying token:", error);
                setIsAuthenticated(false);
            }
        };

        // verifyToken();
    }, []);

    const signIn = async (email, password) => {
        try {
            const response = await axios.post("http://localhost:3000/signin", {
                email,
                password,
            });

            if (response.status === 200) {
                const { token, user } = response.data;

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user))

                setIsAuthenticated(true);
                setUser(user);
                navigate("/");
            }
        } catch (error) {
            console.error("Sign in error:", error.response?.data?.message);
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
            console.error("Sign up error:", error.response?.data?.message);
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem("token");
            const userId = JSON.parse(localStorage.getItem("user"))._id;

            if (!token) {
                alert("you are not signed in");
                navigate('/signin');
                return;
            }
            localStorage.removeItem("token");
            await axios.post(
                "http://localhost:3000/logout",
                {userId},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            localStorage.removeItem("user")
            console.log("signed out");
            setIsAuthenticated(false);
            setUser(null);
            navigate("/signin");
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, signIn, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
