import { MoreHorizontal, ChevronLeft, ChevronRight, Search, Filter, Loader } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Avatar from 'react-avatar';
import { useAuth } from '../Context/AuthContext';
import AccessDenial from '../AuthRestrict/AccessDenial';
import Toast from '../Message/Toast';
import { ConfirmModal } from '../Message/ConfirmModal';

const UserManage = () => {
  const [isOpen, setIsOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: '',
    onConfirm: () => { },
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const openConfirmModal = (message, action) => {
    setConfirmModal({
      isOpen: true,
      message,
      onConfirm: () => {
        action();
        setConfirmModal({ isOpen: false, message: '', onConfirm: () => { } });
      }
    });
    setIsOpen(null);
  };

  const showToast = (message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Fetch users data
  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getUsers`, {
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
        setAllUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        showToast("Failed to fetch users", "error");
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [user]);

  // Filter users based on search query and filters
  useEffect(() => {
    let result = allUsers;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply role filter
    if (filterRole !== 'All') {
      result = result.filter(user => user.role === filterRole);
    }

    // Apply status filter
    if (filterStatus !== 'All') {
      result = result.filter(user => user.status === filterStatus);
    }

    // Apply sorting
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchQuery, allUsers, filterRole, filterStatus, sortConfig]);

  // Request sort function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle status change
  const handleStatus = async (email) => {
    openConfirmModal("Are you sure you want to change the status of this user?", async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/changeStatus`, {
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

        setAllUsers(prevUsers =>
          prevUsers.map(user =>
            user.email === email
              ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
              : user
          )
        );
        showToast("Status changed successfully!", "success");
      } catch (error) {
        console.error("Error changing status:", error);
        showToast("Failed to change status. Please try again.", "error");
      }
    });
  };

  // Handle role change
  const handleRole = async (email) => {
    openConfirmModal(`Are you sure you want to change the role of this user?`, async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/changeRole`, {
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

        setAllUsers(prevUsers =>
          prevUsers.map(user =>
            user.email === email
              ? { ...user, role: user.role === "Admin" ? "User" : "Admin" }
              : user
          )
        );
        showToast("Role changed successfully!", "success");
      } catch (error) {
        console.error("Error changing role:", error);
        showToast("Failed to change role. Please try again.", "error");
      }
    });
  };

  // Handle edit user
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditedName(user.name);
    setEditedEmail(user.email);
    setIsOpen(null);
  };

  // Handle save edit
  const handleSaveEdit = async (id) => {
    openConfirmModal("Are you sure you want to save the changes?", async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/updateUser/${id}`, {
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

        setAllUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === id ? { ...user, name: editedName, email: editedEmail } : user
          )
        );
        setEditingUser(null);
        showToast("User updated successfully!", "success");
      } catch (error) {
        ("Error updating user:", error);
        showToast("Failed to update user. Please try again.", "error");
      }
    });
  };

  // Handle delete user
  const handleDelete = async (id) => {
    openConfirmModal("Are you sure you want to delete this user?", async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/deleteUser/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            userid: user?._id
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setAllUsers(prevUsers => prevUsers.filter(user => user._id !== id));
        showToast("User deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting user:", error);
        showToast("Failed to delete user. Please try again.", "error");
      }
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setIsOpen(null);
      }
      if (!e.target.closest('.filter-container')) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Pagination functions
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  if (user?.role !== "Admin") return <AccessDenial />;
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-700">Loading Platform Users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto w-full">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            User Management
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-auto">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
              />
            </div>
            <div className="relative filter-container">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="px-4 py-2 bg-purple-800 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-sm"
              >
                <Filter size={18} />
                <span>Filter</span>
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg z-50 p-4 w-60 border border-gray-200">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="All">All Roles</option>
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                      <option value="Manager">Manager</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        setFilterRole('All');
                        setFilterStatus('All');
                      }}
                      className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="px-3 py-1 text-sm bg-purple-800 text-white hover:bg-purple-700 rounded-md transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-purple-800 text-white">
                <tr>
                  <th
                    className="p-4 text-left text-sm font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Name</span>
                      {sortConfig.key === 'name' && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="p-4 text-left text-sm font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('email')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Email</span>
                      {sortConfig.key === 'email' && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="p-4 text-left text-sm font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('role')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Role</span>
                      {sortConfig.key === 'role' && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="p-4 text-left text-sm font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {sortConfig.key === 'status' && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar
                            round={true}
                            name={user.name}
                            size="40"
                            textSizeRatio={2.5}
                          />
                          {editingUser === user._id ? (
                            <input
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          ) : (
                            <span className="text-gray-800 font-medium">{user.name}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        {editingUser === user._id ? (
                          <input
                            type="email"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.role === 'Admin'
                          ? 'bg-purple-100 text-purple-700'
                          : user.role === 'Manager'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                          }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 relative dropdown-container">
                        <button
                          className="p-2 rounded-md hover:bg-gray-200 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(isOpen === index ? null : index);
                          }}
                        >
                          <MoreHorizontal size={20} />
                        </button>

                        {isOpen === index && (
                          <ul className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden w-40">
                            <li
                              className="p-3 hover:bg-purple-50 cursor-pointer text-gray-700 flex items-center border-b border-gray-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (editingUser === null) {
                                  handleEdit(user);
                                } else {
                                  handleSaveEdit(editingUser);
                                }
                              }}
                            >
                              {editingUser === user._id ? 'Save User' : 'Edit User'}
                            </li>
                            <li
                              className="p-3 hover:bg-purple-50 cursor-pointer text-gray-700 flex items-center border-b border-gray-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRole(user.email);
                              }}
                            >
                              Change Role
                            </li>
                            <li
                              className="p-3 hover:bg-purple-50 cursor-pointer text-gray-700 flex items-center border-b border-gray-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatus(user.email);
                              }}
                            >
                              {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </li>
                            <li
                              className="p-3 hover:bg-red-50 cursor-pointer text-red-600 flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(user._id);
                              }}
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
                    <td className="p-6 text-center text-gray-500" colSpan="5">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredUsers.length > 0 && (
            <div className="px-4 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastUser, filteredUsers.length)}
                </span>{" "}
                of <span className="font-medium">{filteredUsers.length}</span> users
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={usersPerPage}
                  onChange={(e) => {
                    setUsersPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => paginate(pageNum)}
                        className={`w-10 h-10 rounded-md ${currentPage === pageNum
                          ? 'bg-purple-800 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toasts */}
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

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, message: '', onConfirm: () => { } })}
      />
    </div>
  );
};

export default UserManage;