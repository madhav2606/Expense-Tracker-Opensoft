import React from 'react';
import { CircleUserRound, Menu, Bell, CircleDollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ isOpen, toggleSidebar }) => {
    return (
        <div className="h-16 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-300 shadow-sm transition-all duration-300">
            {/* Left Section: Sidebar Toggle & Logo */}
            <div className="flex items-center space-x-5">
                <button onClick={toggleSidebar} className="hover:bg-gray-200 p-2 rounded-md transition-all">
                    <Menu className={`w-6 h-6 text-gray-700 ${isOpen && "hidden"} `} />
                </button>
                {!isOpen && (
                    <h1 className="flex items-center space-x-1">
                        <CircleDollarSign className="text-purple-800 w-7 h-7" />
                        <p className="text-purple-800 text-2xl font-bold">SPEND</p>
                        <p className="text-2xl font-bold">Sense</p>
                    </h1>
                )}
            </div>

            {/* Right Section: Notifications & Profile */}
            <div className="flex items-center space-x-6">
                <Bell className="hover:bg-gray-200 p-2 w-10 h-10 rounded-full cursor-pointer transition-all" />
                <Link to="/profile2" className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded-full transition-all">
                    <CircleUserRound className="w-8 h-8 text-gray-700" />
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
