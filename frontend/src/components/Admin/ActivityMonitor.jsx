import { MoreHorizontal } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'

const activities = [
    { id: 1, user: "Alice Johnson", action: "Login", timestamp: "2023-07-05 09:30:00" },
    { id: 2, user: "Bob Smith", action: "Update Profile", timestamp: "2023-07-05 10:15:00" },
    { id: 3, user: "Charlie Brown", action: "Create Post", timestamp: "2023-07-05 11:00:00" },
    { id: 4, user: "Diana Ross", action: "Delete Comment", timestamp: "2023-07-05 11:45:00" },
    { id: 5, user: "Edward Norton", action: "Logout", timestamp: "2023-07-05 12:30:00" },
]

const ActivityMonitor = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(activities);

    useEffect(() => {
        setFilteredUsers(
            activities.filter((user) =>
                user.action.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery]);

    return (
        <div className='flex flex-col gap-8 mx-10'>
            <h1 className='text-4xl mt-8 font-bold'>Activity Monitor</h1>
            <div className='flex items-center space-x-5'>
                <input type="text"
                    placeholder='Search activities...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='p-2 rounded-xl border w-2/5'
                />
                {/* <button className='px-4 p-2 text-white bg-purple-800 rounded-xl hover:cursor-pointer'>Search</button> */}
            </div>
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="text-left">
                        <th className="p-4 border-b border-gray-200 text-sm text-gray-600 col-span-2">Name</th>
                        <th className="p-4 border-b border-gray-200 text-sm text-gray-600">Action</th>
                        <th className="p-4 border-b border-gray-200 text-sm text-gray-600">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (filteredUsers?.map((item, index) => (
                        <tr key={index} className="relative hover:bg-gray-50">
                            <td className="p-4 border-b border-gray-200">{item.user}</td>
                            <td className="p-4 border-b border-gray-200">{item.action}</td>
                            <td className="p-4 border-b border-gray-200">{item.timestamp}</td>
                        </tr>
                    ))) : (
                        <tr>
                            <td>No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default ActivityMonitor
