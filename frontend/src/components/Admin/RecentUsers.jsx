import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { useAuth } from "../Context/AuthContext";

const RecentUsers = () => {
    const [recentUsers, setRecentUsers] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await fetch("http://localhost:3000/getUsers", {
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
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        getUsers();
    }, []);

    const formatDate = (isoDateString) => {
        return new Date(isoDateString).toLocaleDateString();
    };

    return (
        <div className="w-full mx-auto sm:w-3/4 md:w-1/2 bg-white border border-gray-300 shadow-lg rounded-xl p-5 overflow-auto h-96">
            <h1 className="text-2xl font-bold text-gray-800 mb-4"> Recent Users</h1>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="text-left bg-gray-100">
                        <th className="p-4 border-b border-gray-300 text-sm sm:text-base text-gray-700">Name</th>
                        <th className="p-4 border-b border-gray-300 text-sm sm:text-base text-gray-700">Role</th>
                        <th className="p-4 border-b border-gray-300 text-sm sm:text-base text-gray-700">Join Date</th>
                    </tr>
                </thead>
                <tbody>
                    {recentUsers?.map((user, index) => (
                        <tr key={index} className="hover:bg-gray-100 transition">
                            <td className="p-4 border-b border-gray-300 flex items-center space-x-3">
                                <Avatar round={true} name={user.name} size="40" />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-800">{user.name}</span>
                                    <span className="text-sm text-gray-600">{user.email}</span>
                                </div>
                            </td>
                            <td className="p-4 border-b border-gray-300 text-gray-700">{user.role}</td>
                            <td className="p-4 border-b border-gray-300 text-gray-700">{formatDate(user.createdAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecentUsers;
