import { MoreHorizontal } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'

const users = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "User", status: "Active" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Manager", status: "Active" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "User", status: "Inactive" },
    { id: 4, name: "Diana Ross", email: "diana@example.com", role: "Admin", status: "Active" },
    { id: 5, name: "Edward Norton", email: "edward@example.com", role: "User", status: "Active" },
]

const UserManage = () => {
    const [isOpen, setIsOpen] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users);

    useEffect(() => {
        setFilteredUsers(
            users.filter((user) =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery]);

    return (
        <div className='flex flex-col gap-8 mx-10'>
            <h1 className='text-4xl mt-8 font-bold'>User Management</h1>
            <div className='flex items-center space-x-5'>
                <input type="text"
                    placeholder='Search users...'
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
                        <th className="p-4 border-b border-gray-200 text-sm text-gray-600">Email</th>
                        <th className="p-4 border-b border-gray-200 text-sm text-gray-600">Role</th>
                        <th className="p-4 border-b border-gray-200 text-sm text-gray-600">Status</th>
                        <th className="p-4 border-b border-gray-200 text-sm text-gray-600">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (filteredUsers?.map((user, index) => (
                        <tr key={index} className="relative hover:bg-gray-50">
                            <td className="p-4 border-b border-gray-200">{user.name}</td>
                            <td className="p-4 border-b border-gray-200">{user.email}</td>
                            <td className="p-4 border-b border-gray-200">{user.role}</td>
                            <td className="p-4 border-b border-gray-200">{user.status}</td>
                            <td
                                className="p-4 border-b border-gray-200 hover:cursor-pointer"
                                onClick={() => setIsOpen(isOpen === index ? null : index)}
                            >
                                <MoreHorizontal />
                            </td>
                            {isOpen === index && (
                                <ul className="absolute right-10 top-14 bg-purple-800 text-white p-2 z-50 rounded-xl shadow-md">
                                    <li className="p-2 hover:bg-purple-600 cursor-pointer">Edit User</li>
                                    <li className="p-2 hover:bg-purple-600 cursor-pointer">Change Role</li>
                                    <li className="p-2 hover:bg-purple-600 cursor-pointer">Deactivate User</li>
                                </ul>
                            )}
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

export default UserManage
