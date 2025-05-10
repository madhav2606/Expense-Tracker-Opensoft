import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, Eye, X, Calendar, DollarSign, Tag, CreditCard, FileText, Search, ChevronUp, ChevronDown, Plus, Menu, Loader, IndianRupeeIcon } from 'lucide-react'
import Modal from './Modal';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import InactiveAccount from '../AuthRestrict/InactiveAccount';
import Toast from '../Message/Toast';
import { ConfirmModal } from '../Message/ConfirmModal';
import MobileActionMenu from './MobileActionMenu';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [addExpenseModal, setAddExpenseModal] = useState(false);
  const [viewExpenseModal, setViewExpenseModal] = useState(false);
  const [editExpenseModal, setEditExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isAscending, setIsAscending] = useState(true);
  const { user } = useAuth();
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState(window.innerWidth < 768);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: '',
    onConfirm: () => { },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Adjust items per page as needed

  const openConfirmModal = (message, action) => {
    setConfirmModal({
      isOpen: true,
      message,
      onConfirm: () => {
        action();
        setConfirmModal({ isOpen: false, message: '', onConfirm: () => { } });
      }
    });
  };

  const categories = [
    "Food",
    "Shopping",
    "Housing",
    "Transport",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Other"
  ];

  const paymentMethods = [
    "Credit Card",
    "Debit Card",
    "Cash",
    "Online Transfer",
    "Mobile Wallet"
  ];

  const showToast = (message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const [newExpense, setNewExpense] = useState(
    { amount: "", description: "", date: "", paymentMethod: "", category: "" }
  );

  const filteredExpenses = expenses?.filter(
    (expense) =>
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  }

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === "date") {
      return isAscending
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else if (sortBy === "amount") {
      const amountA = parseFloat(a.amount.replace("₹", ""));
      const amountB = parseFloat(b.amount.replace("₹", ""));
      return isAscending ? amountA - amountB : amountB - amountA;
    } else {
      return 0;
    }
  });

  // Calculate the total number of pages
  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);

  // Get the expenses for the current page
  const paginatedExpenses = sortedExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      setIsAscending(!isAscending);
    } else {
      setSortBy(criteria);
      setIsAscending(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editExpenseModal) {
      setExpenseToEdit({ ...expenseToEdit, [name]: value });
    } else {
      setNewExpense({ ...newExpense, [name]: value });
    }
  };

  const handleAddExpense = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("You're not Signed in", "error")
      navigate('/signin');
      return;
    }
    (newExpense);

    try {
      const user = JSON.parse(localStorage.getItem("user"))
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/expenses/add/${user._id}`, newExpense,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 201) {
        const addedExpense = response.data;
        setExpenses([...expenses, { ...addedExpense }]);
        setAddExpenseModal(false);
        setNewExpense({ amount: "", description: "", date: "", paymentMethod: "", category: "" });
        showToast("Expense Added successfully!", "success")

      } else {
        showToast("Failed to add expense. Please try again.", "error")
      }
    } catch (error) {
      showToast("Failed to add expense. Please try again.", "error")
    }
  };

  const handleEditExpense = (expense) => {
    setExpenseToEdit(expense);
    setEditExpenseModal(true);
  }

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense);
    setViewExpenseModal(true);
  }

  const handleDeleteExpense = async (id) => {
    const token = localStorage.getItem("token");
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    if (!token) {
      showToast("You're not Signed in", "error")
      navigate('/signin');
      return;
    }

    openConfirmModal('Are you sure you want to delete this expense?', async () => {

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/expenses/delete/${id}/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete expense");
        }

        setExpenses(prev => prev.filter(expense => expense._id !== id));
        showToast("Expense deleted successfully!", "success")

      } catch (error) {
        console.error("Error deleting expense:", error.message);
        showToast("Failed to delete expense. Please try again.", "error")
      }
    });
  };

  const handleSaveEditedExpense = async () => {
    const token = localStorage.getItem("token");
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    if (!token) {
      showToast("You're not Signed in", "error")
      navigate('/signin');
      return;
    }
    openConfirmModal("Are you sure you want to save the changes?", async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/expenses/update/${expenseToEdit._id}/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(expenseToEdit)
        });

        if (!response.ok) {
          throw new Error("Failed to delete expense");
        }
        setExpenses(expenses?.map((expense) => (expense._id === expenseToEdit._id ? expenseToEdit : expense)));
        showToast("edited successfully!", "success")
      } catch (error) {
        showToast("Failed to edit. Please try again.", "error")

      }
    })

    setEditExpenseModal(false);
    setExpenseToEdit(null);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchExpenses = async (userId, token) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/expenses/get/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          showToast("Failed to Fetch Expenses", "error")
        }
        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        showToast("Failed to Fetch Expenses", "error")
      }finally {
        setLoading(false);
      }
    };

    const user = JSON.parse(localStorage.getItem("user"))
    const token = localStorage.getItem("token")
    if (user?._id && token) {
      fetchExpenses(user._id, token);
    }
  }, []);


  if (user?.status === "Inactive" && user?.role === "User") return <InactiveAccount />
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-700">Loading Expenses...</p>
        </div>
      </div>
    )
  }
  return (
    <div className='flex min-h-screen bg-gray-50'>
      <main className="flex-1 p-4 md:p-6 mx-2 md:mx-4 my-2 md:my-4 bg-white rounded-lg shadow-lg">
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal({ isOpen: false, message: '', onConfirm: () => { } })}
        />
        <div className="fixed top-4 right-4 z-50">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>

        {/* Header with Title and Add Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Expense Tracker</h1>
          <button
            onClick={() => setAddExpenseModal(true)}
            className="flex items-center justify-center gap-2 bg-yellow-400 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg shadow-md hover:bg-yellow-500 transition-all duration-200 font-medium"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add New Expense</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4 md:mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={mobileView ? "Search..." : "Search by category, description or payment method..."}
            value={searchQuery}
            onChange={handleSearch}
            className="block w-full pl-10 pr-3 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent shadow-sm"
          />
        </div>

        {/* Sorting Controls */}
        <div className="flex justify-end mb-4 md:mb-6 space-x-2 md:space-x-3">
          <button
            onClick={() => handleSort("date")}
            className={`flex items-center justify-center gap-1 px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-sm transition-all text-sm md:text-base ${sortBy === "date"
              ? "bg-yellow-400 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
          >
            Date
            {sortBy === "date" && (
              isAscending ? <ChevronUp size={16} /> : <ChevronDown size={16} />
            )}
          </button>
          <button
            onClick={() => handleSort("amount")}
            className={`flex items-center justify-center gap-1 px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-sm transition-all text-sm md:text-base ${sortBy === "amount"
              ? "bg-yellow-400 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
          >
            Amount
            {sortBy === "amount" && (
              isAscending ? <ChevronUp size={16} /> : <ChevronDown size={16} />
            )}
          </button>
        </div>

        {/* Mobile Card View */}
        {mobileView && (
          <div className="space-y-4 mb-4">
            {paginatedExpenses.length > 0 ? (
              paginatedExpenses.map((expense, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                      <p className="text-lg font-semibold text-gray-900">₹{expense.amount}</p>
                    </div>
                    <MobileActionMenu expense={expense} handleDeleteExpense={handleDeleteExpense} handleEditExpense={handleEditExpense} handleViewExpense={handleViewExpense} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Tag size={16} className="text-gray-500 mr-2" />
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {expense.category}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">{expense.paymentMethod}</span>
                    </div>
                    <div className="flex items-start">
                      <FileText size={16} className="text-gray-500 mr-2 mt-0.5" />
                      <span className="text-sm text-gray-700">{expense.description}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-white border border-gray-200 rounded-lg">
                <p className="text-gray-500">No expenses found. Add a new expense to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Desktop Table View */}
        {!mobileView && (
          <div className="overflow-x-auto w-full rounded-lg border border-gray-200 shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table Head */}
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th scope="col" className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-4 md:px-6 py-3 md:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedExpenses.length > 0 ? (
                  paginatedExpenses.map((expense, index) => (
                    <tr
                      key={index}
                      className="hover:bg-yellow-50 transition-colors duration-150"
                    >
                      <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(expense.date)}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{expense.amount}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-700">{expense.paymentMethod}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700 max-w-xs truncate">{expense.description}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm font-medium text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleViewExpense(expense)}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditExpense(expense)}
                            className="p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(expense._id)}
                            className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 md:px-6 py-8 md:py-12 text-center text-gray-500">
                      No expenses found. Add a new expense to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>

      {/* Add Expense Modal */}
      {addExpenseModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center bg-yellow-400 text-white px-4 md:px-6 py-3 md:py-4">
              <h2 className="text-xl md:text-2xl font-bold">Add New Expense</h2>
              <button
                onClick={() => setAddExpenseModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <form className="p-4 md:p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newExpense.date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <div className="relative">
                  <IndianRupeeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    id="amount"
                    name="amount"
                    placeholder="Amount"
                    value={newExpense.amount}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    id="category"
                    name="category"
                    value={newExpense.category}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={newExpense.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">Select Payment Method</option>
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Description"
                    value={newExpense.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
            </form>
            <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setAddExpenseModal(false)}
                className="px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddExpense}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Expense Modal */}
      {viewExpenseModal && selectedExpense && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center bg-yellow-400 text-white px-6 py-4">
              <h2 className="text-xl font-semibold">Expense Details</h2>
              <button
                onClick={() => setViewExpenseModal(false)}
                className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-yellow-500"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Calendar className="text-yellow-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Date</p>
                  <p className="font-semibold text-gray-800">{formatDate(selectedExpense.date)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <IndianRupeeIcon className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Amount</p>
                  <p className="font-semibold text-gray-800">₹{selectedExpense.amount}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Tag className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Category</p>
                  <p className="font-semibold text-gray-800">{selectedExpense.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <CreditCard className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Payment Method</p>
                  <p className="font-semibold text-gray-800">{selectedExpense.paymentMethod}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <FileText className="text-red-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Description</p>
                  <p className="font-semibold text-gray-800">{selectedExpense.description}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <button
                onClick={() => setViewExpenseModal(false)}
                className="w-full bg-yellow-400 text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-yellow-500 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {editExpenseModal && expenseToEdit && (
        <Modal
          title="Edit Expense"
          onClose={() => setEditExpenseModal(false)}
          onSave={handleSaveEditedExpense}
          expense={expenseToEdit}
          handleInputChange={handleInputChange}
        />
      )}
    </div>
  )
}

export default ExpenseList