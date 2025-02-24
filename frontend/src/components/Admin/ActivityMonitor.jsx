import { MoreHorizontal } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Avatar from 'react-avatar';
import { useAuth } from '../Context/AuthContext';
import AccessDenial from '../AuthRestrict/AccessDenial';

const ActivityMonitor = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await fetch("http://localhost:3000/getActivity",{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        userid: user?._id
                    },
                    });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const activities = await response.json();
                setAllUsers(activities);
                setFilteredUsers(activities);
            } catch (error) {
                console.error("Error fetching activities", error);
            }
        };
        fetchActivity();
    }, []);

    useEffect(() => {
        setFilteredUsers(
            allUsers.filter((user) =>
                user.action.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, allUsers]);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    if (user?.role !== "Admin") return <AccessDenial />;

    return (
        <div className=" p-8 overflow-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Activity Monitor</h1>

            
            <div className=" mb-6">
                <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-3 rounded-lg border border-gray-300 w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-800"
                />
            </div>

           
            <div className="overflow-auto h-98 w-full rounded-xl shadow-lg">
                <table className="min-w-full bg-white rounded-lg overflow-auto">
                    <thead className="bg-purple-800 text-white uppercase text-sm tracking-wider">
                        <tr>
                            <th className="p-4 text-left">User</th>
                            <th className="p-4 text-left">Action</th>
                            <th className="p-4 text-left">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((item, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100 transition">
                                    <td className="p-4 flex items-center space-x-3">
                                        <Avatar round={true} name={item.user} size="40" /> 
                                        <span className="font-medium text-gray-800">{item.user}</span>
                                    </td>
                                    <td className="p-4 text-gray-700">{item.action}</td>
                                    <td className="p-4 text-gray-500">{formatDate(item.timestamp)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="p-4 text-center text-gray-500" colSpan="3">
                                    No activities found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivityMonitor;
