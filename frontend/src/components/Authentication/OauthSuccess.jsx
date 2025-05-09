import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { Loader } from "lucide-react";

const OauthSuccess = () => {
    const navigate = useNavigate();
    const { setUser, setIsAuthenticated } = useAuth();
    const params = new URLSearchParams(window.location.search);

    useEffect(() => {
        const token = params.get("token");
        const name = params.get("name");
        const email = params.get("email");
        const _id = params.get("_id");

        if (token) {
            setIsAuthenticated(true);
            setUser({ _id, name, email });

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({ _id, name, email }));
            navigate("/");
        }
    }, [params]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
                <p className="mt-4 text-lg text-gray-700">Signing in...</p>
            </div>
        </div>
    )
};

export default OauthSuccess;
