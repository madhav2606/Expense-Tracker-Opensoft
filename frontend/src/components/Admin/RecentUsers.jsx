import React from 'react'
import Avatar from 'react-avatar';


const recentUsers = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "User", joinDate: "2023-07-01" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Manager", joinDate: "2023-07-02" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "User", joinDate: "2023-07-03" },
    { id: 4, name: "Diana Ross", email: "diana@example.com", role: "Admin", joinDate: "2023-07-04" },
    { id: 5, name: "Edward Norton", email: "edward@example.com", role: "User", joinDate: "2023-07-05" },
]

const colors=['red','green', 'blue','orange']

const RecentUsers = () => {
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
                                <Avatar round={true} color={colors[Math.floor(Math.random() * colors.length)]} name={user.name} size="40" />
                                <div className='flex flex-col justify-center'>
                                    <span>{user.name}</span>
                                    <span className='text-sm text-gray-600'>
                                        {user.email}
                                    </span>
                                </div>
                            </td>
                            <td className="p-4 border-b border-gray-200">{user.role}</td>
                            <td className="p-4 border-b border-gray-200">{user.joinDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default RecentUsers