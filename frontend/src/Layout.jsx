import React, { useState,useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/AppLayout/Sidebar";
import Footer from "./components/AppLayout/Footer";
import Navbar from "./components/AppLayout/Navbar";
import SignInPage from "./components/Authentication/SignInPage";
import SignUpPage from "./components/Authentication/SignUpPage";
import App from "./components/AppLayout/App";
import Toast from "./components/Message/Toast";
import { useAuth } from "./components/Context/AuthContext";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (windowWidth < 768) {
            setIsSidebarOpen(false);
        } else if (windowWidth > 1024) {
            setIsSidebarOpen(true);
        }
    }, [windowWidth]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (
        <div className="flex w-full min-h-screen overflow-x-hidden">
            <div className={`h-screen ${isSidebarOpen ? "w-[30%]" : "w-0"}  transition-all duration-500 ease-in-out`}>
                {isSidebarOpen && <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
            </div>
            <div className="w-full border border-l-1 border-gray-400">
                <Navbar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <App />
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
