import { ChevronLeft, ChevronRight, Filter, Loader, MoreHorizontal, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Avatar from 'react-avatar';
import { useAuth } from '../Context/AuthContext';
import AccessDenial from '../AuthRestrict/AccessDenial';

const ActivityMonitor = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'descending' });
    const [filterAction, setFilterAction] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getActivity`, {
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
                setLoading(false);
                const activities = await response.json();
                setAllUsers(activities);
                setFilteredUsers(activities);
            } catch (error) {
                console.error("Error fetching activities", error);
                setLoading(false);
            }
        };
        fetchActivity();
    }, []);


    // Filter users based on search query and filters
    useEffect(() => {
        let result = allUsers;

        if (searchQuery) {
            result = result?.filter(users =>
                users.user.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterAction !== 'All') {
            result = result?.filter(user => user.action === filterAction);
        }

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
        setCurrentPage(1);
    }, [searchQuery, allUsers, filterAction, sortConfig]);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.filter-container')) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    const renderActionBadge = (action) => {
        let bgColor = 'bg-gray-100 text-gray-800';

        switch (action) {
            case 'Login':
                bgColor = 'bg-green-100 text-green-800';
                break;
            case 'LogOut':
                bgColor = 'bg-blue-100 text-blue-800';
                break;
            case 'Expense addition':
                bgColor = 'bg-purple-100 text-purple-800';
                break;
            case 'Expense deletion':
                bgColor = 'bg-red-100 text-red-800';
                break;
            case 'Expense update':
                bgColor = 'bg-yellow-100 text-yellow-800';
                break;
            default:
                bgColor = 'bg-gray-100 text-gray-800';
        }

        return (
            <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${bgColor}`}>
                {action}
            </span>
        );
    };

    if (user?.role !== "Admin") return <AccessDenial />;
    if (loading) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
              <p className="mt-4 text-lg text-gray-700">Loading Platform Activities...</p>
            </div>
          </div>
        )
      }

    return (
        <div className='flex flex-col gap-6 p-6 bg-gray-50 min-h-screen'>
            <div className=" max-w-7xl mx-auto w-full ">
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0'>
                    <h1 className="text-4xl font-bold text-gray-800">Activity Monitor</h1>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-auto ">
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                                        <select
                                            value={filterAction}
                                            onChange={(e) => setFilterAction(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="All">All Actions</option>
                                            <option value="Login">Login</option>
                                            <option value="LogOut">LogOut</option>
                                            <option value="Expense addition">Expense addition</option>
                                            <option value="Expense deletion">Expense deletion</option>
                                            <option value="Expense update">Expense update</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => {
                                                setFilterAction('All');
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

                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-purple-800 text-white uppercase text-sm tracking-wider">
                                <tr>
                                    <th className="p-4 text-left text-sm font-medium uppercase tracking-wider cursor-pointer">User</th>
                                    <th className="p-4 text-left text-sm font-medium uppercase tracking-wider cursor-pointer">Action</th>
                                    <th className="p-4 text-left text-sm font-medium uppercase tracking-wider cursor-pointer" onClick={() => requestSort('timestamp')}>
                                        <div className="flex items-center space-x-1">
                                            <span>Timestamp</span>
                                            {sortConfig.key === 'name' && (
                                                <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200 '>
                                {currentUsers.length > 0 ? (
                                    currentUsers.map((item, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-100 transition">
                                            <td className="p-4 flex items-center space-x-3">
                                                <Avatar round={true} name={item.user} size="40" />
                                                <span className="font-medium text-gray-800">{item.user}</span>
                                            </td>
                                            <td className="p-4 text-gray-700">{renderActionBadge(item.action)}</td>
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

                    {filteredUsers.length > 0 && (
                        <div className="px-4 py-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                                <span className="font-medium">
                                    {Math.min(indexOfLastUser, filteredUsers.length)}
                                </span>{" "}
                                of <span className="font-medium">{filteredUsers.length}</span> activities
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
        </div>
    );
};

export default ActivityMonitor;
