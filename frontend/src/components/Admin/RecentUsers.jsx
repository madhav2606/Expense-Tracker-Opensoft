import React, { useEffect, useState } from 'react'
import Avatar from 'react-avatar';
import { useAuth } from '../Context/AuthContext';

const RecentUsers = () => {
    const [recentUsers, setRecentUsers] = useState([])
    const {user}=useAuth();

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await fetch('http://4.186.56.130:3000/getUsers',{
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
        const date = new Date(isoDateString);
        const formattedDate = date.toLocaleDateString();
        return formattedDate
    }
    return (
        <div className='space-y-2 w-1/2 border border-gray-500 rounded-xl p-2 px-4 overflow-auto h-96'>
            <h1 className='px-5 text-2xl font-bold'>Recent Users</h1>
            <table className="min-w-full border-collapse ">
                <thead>
                    <tr className="text-left">
                        <th className="p-4 border-b border-gray-200 text-sm text-gray-600 col-span-2">Name</th>
                        <th className="p-4 border-b border-gray-200 text-sm text-gray-600">Role</th>
                        <th className="p-4 border-b border-gray-200 text-sm text-gray-600">Join Date</th>
                    </tr>
                </thead>
                <tbody>
                    {recentUsers?.map((user, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="p-4 border-b border-gray-200 flex items-center space-x-2 ">
                                <Avatar round={true} name={user.name} size="40" />
                                <div className='flex flex-col justify-center'>
                                    <span>{user.name}</span>
                                    <span className='text-sm text-gray-600'>
                                        {user.email}
                                    </span>
                                </div>
                            </td>
                            <td className="p-4 border-b border-gray-200">{user.role}</td>
                            <td className="p-4 border-b border-gray-200">{formatDate(user.createdAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default RecentUsers