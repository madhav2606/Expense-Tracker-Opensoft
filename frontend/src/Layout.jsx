import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/AppLayout/Sidebar";
import Footer from "./components/AppLayout/Footer";
import Navbar from "./components/AppLayout/Navbar";
import SignInPage from "./components/Sign_in/SignInPage";
import SignUpPage from "./components/Sign_in/SignUpPage";
import App from "./components/AppLayout/App";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex">
            <div className={`h-screen ${isSidebarOpen && "w-[30%]"}`}>
                {isSidebarOpen && <Sidebar />}
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
