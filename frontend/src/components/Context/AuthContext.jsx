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
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        console.log(user)
    }, [])


    const signIn = async (email, password) => {
        try {
            const response = await axios.post("http://localhost:3000/signin", {
                email,
                password,
            });

            if (response.status === 200) {
                const { token, user } = response.data;

                localStorage.setItem("token", token);
                localStorage.setItem("user",JSON.stringify(user))

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
            if (!token) {
                alert("you are not signed in");
                navigate('/signin');
                return;
            }
            await axios.post(
                "http://localhost:3000/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            localStorage.removeItem("token");
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
