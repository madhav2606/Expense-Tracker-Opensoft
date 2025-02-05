import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, Eye, X, Calendar, DollarSign, Tag, CreditCard, FileText } from 'lucide-react'
import Modal from './Modal';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import InactiveAccount from '../AuthRestrict/InactiveAccount';
import Toast from '../Message/Toast';

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

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.paymentMethod.toLocaleLowerCase().includes(searchQuery.toLowerCase())
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
      const amountA = parseFloat(a.amount.replace("$", ""));
      const amountB = parseFloat(b.amount.replace("$", ""));
      return isAscending ? amountA - amountB : amountB - amountA;
    } else {
      return 0;
    }
  });

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
      alert("you are not signed in");
      navigate('/signin');
      return;
    }
    console.log(newExpense);

    try {
      const user = JSON.parse(localStorage.getItem("user"))
      const response = await axios.post(`http://localhost:3000/expenses/add/${user._id}`, newExpense,
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
        console.log("Error adding expense:", response.data.message);
        alert("Failed to add expense. Please try again.");
      }
    } catch (error) {
      console.log("Error adding expense:", error.message);
      showToast("Failed to add expense. Please try again.", "error")
    }
  };

  function handleEditExpense(expense) {
    setExpenseToEdit(expense);
    setEditExpenseModal(true);
  }

  function handleViewExpense(expense) {
    setSelectedExpense(expense);
    setViewExpenseModal(true);
  }

  const handleDeleteExpense = async (id) => {
    const token = localStorage.getItem("token");
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    if (!token) {
      alert("You are not signed in");
      navigate('/signin');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this expense?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/expenses/delete/${id}/${userId}`, {
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
      alert("An error occurred while deleting the expense. Please try again.");
      showToast("Failed to delete expense. Please try again.", "error")
    }
  };

  const handleSaveEditedExpense = async () => {
    const token = localStorage.getItem("token");
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    if (!token) {
      alert("you are not signed in");
      navigate('/signin');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/expenses/update/${expenseToEdit._id}/${userId}`, {
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
      setExpenses(expenses.map((expense) => (expense._id === expenseToEdit._id ? expenseToEdit : expense)));
      showToast("edited successfully!", "success")
    } catch (error) {
      showToast("Failed to edit. Please try again.", "error")

    }

    setEditExpenseModal(false);
    setExpenseToEdit(null);
  };

  useEffect(() => {
    const fetchExpenses = async (userId, token) => {
      try {
        const response = await fetch(`http://localhost:3000/expenses/get/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }
        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        console.log(error.message)
      }
    };

    const user = JSON.parse(localStorage.getItem("user"))
    const token = localStorage.getItem("token")
    if (user._id && token) {
      fetchExpenses(user._id, token);
    }
  }, []);


  if (user?.status === "Inactive" && user?.role === "User") return <InactiveAccount />
  return (
    <div className='flex  min-h-screen'>
      <main className="flex-1 bg-white rounded-md  p-4 ml-4">
        <div>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
        </div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Expenses</h1>
          <button onClick={() => setAddExpenseModal(true)} className="bg-yellow-400 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-500 cursor-pointer">
            Add New Expense
          </button>
        </div>


        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by category/description/payment method..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 border rounded"
          />
        </div>


        <div className="flex justify-end mb-4 space-x-4">
          <button
            onClick={() => handleSort("date")}
            className={`px-4 py-2 rounded-md shadow ${sortBy === "date"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            Sort by Date {sortBy === "date" ? (isAscending ? "↑" : "↓") : ""}
          </button>
          <button
            onClick={() => handleSort("amount")}
            className={`px-4 py-2 rounded-md shadow ${sortBy === "amount"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            Sort by Amount {sortBy === "amount" ? (isAscending ? "↑" : "↓") : ""}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-200 rounded-xl  shadow-xl bg-white overflow-hidden">
            {/* Table Head */}
            <thead className="bg-yellow-400 border-b border-gray-300">
              <tr className="text-gray-700 text-left">
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Payment Method</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {sortedExpenses.map((expense, index) => (
                <tr
                  key={index}
                  className="odd:bg-white even:bg-gray-50 hover:bg-yellow-100 transition-all duration-200 border-b border-gray-200"
                >
                  <td className="px-6 py-4">{formatDate(expense.date)}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">${expense.amount}</td>
                  <td className="px-6 py-4">{expense.category}</td>
                  <td className="px-6 py-4">{expense.paymentMethod}</td>
                  <td className="px-6 py-4">{expense.description}</td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => handleEditExpense(expense)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-all"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => handleViewExpense(expense)}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-all"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {addExpenseModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center bg-yellow-400 text-white px-6 py-4">
              <h2 className="text-2xl font-bold">Add New Expense</h2>
              <button
                onClick={() => setAddExpenseModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <form className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3   top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                  <input
                    type="text"
                    id="category"
                    name="category"
                    placeholder="Category"
                    value={newExpense.category}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    id="paymentMethod"
                    name="paymentMethod"
                    placeholder="Payment Method"
                    value={newExpense.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
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
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setAddExpenseModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddExpense}
                className="px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {viewExpenseModal && selectedExpense && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center bg-yellow-400 text-white px-6 py-4">
              <h2 className="text-2xl font-bold">Expense Details</h2>
              <button
                onClick={() => setViewExpenseModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Calendar className="text-yellow-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold">{formatDate(selectedExpense.date)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-semibold">${selectedExpense.amount}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Tag className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-semibold">{selectedExpense.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <CreditCard className="text-purple-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-semibold">{selectedExpense.paymentMethod}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <FileText className="text-red-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-semibold">{selectedExpense.description}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <button
                onClick={() => setViewExpenseModal(false)}
                className="w-full bg-yellow-400 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
