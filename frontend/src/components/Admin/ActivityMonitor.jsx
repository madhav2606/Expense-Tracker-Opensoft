import { MoreHorizontal } from 'lucide-react'
import React, { useState, useEffect, useRef, act } from 'react'
import Avatar from 'react-avatar';


const ActivityMonitor = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        setFilteredUsers(
            filteredUsers?.filter((user) =>
                user.action.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery]);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await fetch("http://localhost:3000/getActivity");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const activities = await response.json();
                setFilteredUsers(activities)

            } catch (error) {
                console.error("Error fetching activities", error);
            }
        }
        fetchActivity();
    }, [])

    const formatDate = (timestamp) => {
        const date = new Date(timestamp)
        return date.toLocaleString()
    }

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
                            <td className="p-4 border-b border-gray-200 flex gap-5 items-center"><Avatar round={true} name={item.user} size="40" />{item.user}</td>
                            <td className="p-4 border-b border-gray-200">{item.action}</td>
                            <td className="p-4 border-b border-gray-200">{formatDate(item.timestamp)}</td>
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
