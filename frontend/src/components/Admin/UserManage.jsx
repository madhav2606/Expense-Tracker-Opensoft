import { MoreHorizontal } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Avatar from 'react-avatar';
import { useAuth } from '../Context/AuthContext';
import AccessDenial from '../AuthRestrict/AccessDenial';
import Toast from '../Message/Toast';
import { ConfirmModal } from '../Message/ConfirmModal';

const UserManage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const { user } = useAuth();
    // const [isEditing, setisEditing] = useState(false)
    const [toasts, setToasts] = useState([]);
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        message: '',
        onConfirm: () => { },
    });

    const openConfirmModal = (message, action) => {
        setConfirmModal({
            isOpen: true,
            message,
            onConfirm: () => {
                action();
                setConfirmModal({ isOpen: false, message: '', onConfirm: () => { } });
            }
        });
        setIsOpen(false)
    };

    const showToast = (message, type) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };



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
        openConfirmModal("Are you sure you want to change the status of this user?", async () => {
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
                showToast("Status Changed successfully!", "success")
            } catch (error) {
                console.log("Error changing status:", error);
                showToast("Failed to change. Please try again.", "error")
            }
        })
    };


    const handleRole = async (email) => {
        openConfirmModal(`Are you sure you want to change the role of this user?`, async () => {
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
                showToast("Role changed successfully!", "success")
            } catch (error) {
                console.log("Error changing role:", error);
                showToast("Failed to change role. Please try again.", "error")
            }
        });
    };

    const handleEdit = (user) => {
        setEditingUser(user._id);
        setEditedName(user.name);
        setEditedEmail(user.email);
    };

    const handleSaveEdit = async (id) => {
        openConfirmModal("Are you sure you want to save the changes?", async () => {
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
                showToast("Edited successfully!", "success")
            } catch (error) {
                console.log("Error updating user:", error);
                showToast("Failed to Edit. Please try again.", "error")
            }
        });
    };

    const handleDelete = async (id) => {
        openConfirmModal("Are you sure you want to delete this user?", async () => {
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
                showToast("User deleted successfully!", "success")

            } catch (error) {
                console.log("Error deleting user:", error);
                showToast("Failed to delete . Please try again.", "error")
            }
        });
    };

    if (user?.role !== "Admin") return <AccessDenial />;

    return (
        <div className="flex flex-col gap-6 px-4 md:px-10">
  <h1 className="text-3xl md:text-4xl mt-6 font-bold text-gray-800">
    User Management
  </h1>

  <ConfirmModal
    isOpen={confirmModal.isOpen}
    message={confirmModal.message}
    onConfirm={confirmModal.onConfirm}
    onCancel={() => setConfirmModal({ isOpen: false, message: '', onConfirm: () => {} })}
  />

  
  <div className="fixed top-4 right-4 space-y-2 z-50">
    {toasts.map((toast) => (
      <Toast
        key={toast.id}
        message={toast.message}
        type={toast.type}
        onClose={() => removeToast(toast.id)}
      />
    ))}
  </div>

  
  <div className="flex items-center w-full">
    <input
      type="text"
      placeholder="Search users..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="p-3 w-full max-w-md  rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

 
  <div className="overflow-x-auto bg-white rounded-lg shadow-md">
    <table className="min-w-full border-collapse">
      <thead className="bg-purple-800 text-white uppercase text-sm tracking-wider">
        <tr>
          <th className="p-4 text-left">Name</th>
          <th className="p-4 text-left">Email</th>
          <th className="p-4 text-left">Role</th>
          <th className="p-4 text-left">Status</th>
          <th className="p-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <tr
              key={index}
              className="border-b hover:bg-gray-50 transition duration-200"
            >
              <td className="p-4 flex gap-4 items-center">
                <Avatar round={true} name={user.name} size="40" />
                {editingUser === user._id ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="border rounded-md p-2 w-full"
                  />
                ) : (
                  <span className="text-gray-800 font-medium">{user.name}</span>
                )}
              </td>
              <td className="p-4 text-gray-600">
                {editingUser === user._id ? (
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="border rounded-md p-2 w-full"
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="p-4 text-gray-700">{user.role}</td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="p-4 relative">
                <button
                  className="p-2 rounded-md hover:bg-gray-200"
                  onClick={() => setIsOpen(isOpen === index ? null : index)}
                >
                  <MoreHorizontal />
                </button>

                {isOpen === index && (
                  <ul className="absolute right-0 top-10 bg-purple-800 text-white p-2 z-50 rounded-lg shadow-md w-40">
                    <li
                      className="p-2 hover:bg-purple-600 cursor-pointer"
                      onClick={() => {
                        if (editingUser == null) {
                          handleEdit(user);
                        } else {
                          handleSaveEdit(editingUser);
                        }
                      }}
                    >
                      {editingUser != null ? 'Save User' : 'Edit User'}
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
                      {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </li>
                    <li
                      className="p-2 hover:bg-red-500 cursor-pointer"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete User
                    </li>
                  </ul>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="p-4 text-center text-gray-500" colSpan="5">
              No users found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

    );
};

export default UserManage;
