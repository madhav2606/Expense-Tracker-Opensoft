import { MoreHorizontal } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Avatar from 'react-avatar';
import { useAuth } from '../Context/AuthContext';
import AccessDenial from '../AuthRestrict/AccessDenial';

const UserManage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const { user } = useAuth();


    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await fetch('http://localhost:3000/getUsers', {
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
                setFilteredUsers(data);
                setAllUsers(data)
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        getUsers();
    }, []);

    useEffect(() => {
        setFilteredUsers(
            allUsers?.filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, allUsers]);

    const handleStatus = async (email) => {
        const isConfirmed = window.confirm("Are you sure you want to change the status of this user?");
        if (!isConfirmed) return;
        try {
            const response = await fetch('http://localhost:3000/changeStatus', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    userid: user?._id
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setFilteredUsers(prevUsers =>
                prevUsers.map(user =>
                    user.email === email
                        ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
                        : user
                )
            );
            setIsOpen(false)
        } catch (error) {
            console.log("Error changing status:", error);
        }
    };


    const handleRole = async (email) => {
        const isConfirmed = window.confirm(`Are you sure you want to change the role of this user?`);
        if (!isConfirmed) return;
        try {
            const response = await fetch('http://localhost:3000/changeRole', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    userid: user?._id
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setFilteredUsers(prevUsers =>
                prevUsers.map(user =>
                    user.email === email
                        ? { ...user, role: user.role === "Admin" ? "User" : "Admin" }
                        : user
                )
            );
            setIsOpen(false)
        } catch (error) {
            console.log("Error changing role:", error);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user._id);
        setEditedName(user.name);
        setEditedEmail(user.email);
    };

    const handleSaveEdit = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to save the changes?");
        if (!isConfirmed) return;
        try {
            const response = await fetch(`http://localhost:3000/updateUser/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    userid: user?._id
                },
                body: JSON.stringify({ name: editedName, email: editedEmail }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setFilteredUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === id ? { ...user, name: editedName, email: editedEmail } : user
                )
            );
            setEditingUser(null);
            setIsOpen(false)
        } catch (error) {
            console.log("Error updating user:", error);
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this user?");
        if (!isConfirmed) return;
        try {
            const response = await fetch(`http://localhost:3000/deleteUser/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    userid: user?._id
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setFilteredUsers(filteredUsers.filter(user => user._id !== id));
            setIsOpen(false)
        } catch (error) {
            console.log("Error deleting user:", error);
        }
    };

    if (user?.role !== "Admin") return <AccessDenial />;

    return (
        <div className='flex flex-col gap-8 mx-10 '>
            <h1 className='text-4xl mt-8 font-bold'>User Management</h1>
            <div className='flex items-center space-x-5'>
                <input
                    type="text"
                    placeholder='Search users...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='p-2 rounded-xl border w-2/5'
                />
            </div>
            <table className="min-w-full border-collapse  rounded-2xl shadow-lg">
                <thead className="bg-purple-800 text-white uppercase text-sm tracking-wider">
                    <tr className="text-left">
                        <th className="p-4 border-b border-gray-200 text-sm">Name</th>
                        <th className="p-4 border-b border-gray-200 text-sm">Email</th>
                        <th className="p-4 border-b border-gray-200 text-sm">Role</th>
                        <th className="p-4 border-b border-gray-200 text-sm">Status</th>
                        <th className="p-4 border-b border-gray-200 text-sm">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => (
                            <tr key={index} className="relative hover:bg-gray-50">
                                <td className="p-4 border-b border-gray-200 flex gap-4">
                                    <Avatar round={true} name={user.name} size="40" />
                                    {editingUser === user._id ? (
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="border rounded p-2"
                                        />
                                    ) : (
                                        user.name
                                    )}
                                </td>
                                <td className="p-4 border-b border-gray-200">
                                    {editingUser === user._id ? (
                                        <input
                                            type="email"
                                            value={editedEmail}
                                            onChange={(e) => setEditedEmail(e.target.value)}
                                            className="border rounded p-2"
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td className="p-4 border-b border-gray-200">{user.role}</td>
                                <td className="p-4 border-b border-gray-200"><span className={`px-3 py-1 rounded-full text-sm font-medium ${user.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {user.status}
                                </span></td>
                                <td
                                    className="p-4 border-b border-gray-200 hover:cursor-pointer"
                                    onClick={() => setIsOpen(isOpen === index ? null : index)}
                                >
                                    <MoreHorizontal />
                                </td>
                                {isOpen === index && (
                                    <td>
                                        <ul className="absolute right-10 top-14 bg-purple-800 text-white p-2 z-50 rounded-xl shadow-md">
                                            <li
                                                className="p-2 hover:bg-purple-600 cursor-pointer"
                                                onClick={() => {
                                                    if (editingUser == null) {
                                                        handleEdit(user)
                                                    }
                                                    else {
                                                        handleSaveEdit(editingUser)
                                                    }

                                                }
                                                }
                                            >
                                                {editingUser != null ? "Save User" : "Edit User"}
                                            </li>
                                            <li
                                                className="p-2 hover:bg-purple-600 cursor-pointer"
                                                onClick={() => handleRole(user.email)}
                                            >
                                                Change Role
                                            </li>
                                            <li
                                                className="p-2 hover:bg-purple-600 cursor-pointer"
                                                onClick={() => handleStatus(user.email)}
                                            >
                                                {user.status === "Active" ? "Deactivate User" : "Activate User"}
                                            </li>
                                            <li
                                                className="p-2 hover:bg-purple-600 cursor-pointer"
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                Delete User
                                            </li>
                                        </ul>
                                    </td>
                                )}

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="p-4 text-center" colSpan="5">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserManage;
