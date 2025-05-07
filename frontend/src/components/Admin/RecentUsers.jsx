import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { useAuth } from "../Context/AuthContext";
import { Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecentUsers = () => {
    const [recentUsers, setRecentUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const getUsers = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getUsers`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        userid: user?._id,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setRecentUsers(sortedData.slice(0, 5));
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setIsLoading(false);
            }
        };

        getUsers();
    }, [user]);

    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        return new Intl.DateTimeFormat('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        }).format(date);
    };

    const getTimeSince = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffTime = Math.abs(now - past);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return "1 day ago";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    const getRoleBadgeStyle = (role) => {
        switch (role) {
            case "Admin":
                return "bg-red-50 text-red-700 border-red-100";
            case "Editor":
                return "bg-blue-50 text-blue-700 border-blue-100";
            case "Moderator":
                return "bg-purple-50 text-purple-700 border-purple-100";
            case "User":
                return "bg-green-50 text-green-700 border-green-100";
            default:
                return "bg-gray-50 text-gray-700 border-gray-100";
        }
    };

    return (
        <div className="w-full h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
                    <p className="text-sm text-gray-500">Latest user registrations</p>
                </div>
                <div className="flex items-center text-xs text-indigo-600 font-medium hover:cursor-pointer" onClick={()=> navigate('/admin/users')}>
                    <span >View all users</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-100">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {recentUsers.length > 0 ? (
                                recentUsers.map((user, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <Avatar 
                                                        round={true} 
                                                        name={user.name} 
                                                        size="40" 
                                                        className="shadow-sm"
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeStyle(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(user.createdAt)}</div>
                                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {getTimeSince(user.createdAt)}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-4 py-10 text-center text-sm text-gray-500">
                                        No recent users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RecentUsers;