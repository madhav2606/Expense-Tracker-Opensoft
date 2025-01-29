import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, Eye } from 'lucide-react'
import Modal from './Modal';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

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

  const [newExpense, setNewExpense] = useState(
    { amount: "", description: "", date: "", paymentMethod: "", category: "" }
  );

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.paymentMethod.toLocaleLowerCase().includes(searchQuery.toLowerCase())
  );


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
      } else {
        console.log("Error adding expense:", response.data.message);
        alert("Failed to add expense. Please try again.");
      }
    } catch (error) {
      console.log("Error adding expense:", error.message);
      alert("An error occurred while adding the expense. Please try again.");
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
    if (!token) {
      alert("You are not signed in");
      navigate('/signin');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this expense?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/expenses/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      setExpenses(prev => prev.filter(expense => expense._id !== id));

    } catch (error) {
      console.error("Error deleting expense:", error.message);
      alert("An error occurred while deleting the expense. Please try again.");
    }
  };

  const handleSaveEditedExpense = async() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("you are not signed in");
      navigate('/signin');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/expenses/update/${expenseToEdit._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify(expenseToEdit)
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }
      setExpenses(expenses.map((expense) => (expense._id === expenseToEdit._id ? expenseToEdit : expense)));
    } catch (error) {

    }

    setEditExpenseModal(false);
    setExpenseToEdit(null);
  };

  //fetch all expenses of loggedIn user
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

  return (
    <div className='flex  min-h-screen'>
      <main className="flex-1 bg-white rounded-md  p-4 ml-4">
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
          <table className="table-auto w-full border-collapse">

            <thead>
              <tr>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-left px-4 py-2">Amount</th>
                <th className="text-left px-4 py-2">Category</th>
                <th className="text-left px-4 py-2">Payment Method</th>
                <th className="text-left px-4 py-2">Description</th>
              </tr>
            </thead>


            <tbody>
              {sortedExpenses.map((expense, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-50 h-[10rem]">
                  <td className="px-4 py-2">{expense.date}</td>
                  <td className="px-4 py-2">{expense.amount}</td>
                  <td className=" px-4 py-2">{expense.category}</td>
                  <td className=" px-4 py-2">{expense.paymentMethod}</td>
                  <td className="px-4 py-2">{expense.description}</td>
                  <td className=" px-4 py-2 text-center space-x-2">
                    <button onClick={() => handleEditExpense(expense)} className="text-yellow-500 hover:text-yellow-600 cursor-pointer">
                      <Pencil />
                    </button>
                    <button onClick={() => handleDeleteExpense(expense._id)} className=" text-yellow-500 hover:text-yellow-600 cursor-pointer">
                      <Trash2 />
                    </button>
                    <button onClick={() => handleViewExpense(expense)} className=' text-yellow-500 hover:text-yellow-600 cursor-pointer'>
                      <Eye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {addExpenseModal && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-md p-6 w-4/6 h-5/6">
            <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
            <form>
              <input
                type="date"
                name="date"
                value={newExpense.date}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="text"
                name="amount"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={newExpense.category}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="text"
                name="paymentMethod"
                placeholder="Payment Method"
                value={newExpense.paymentMethod}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newExpense.description}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded"
              />
              <button
                type="button"
                onClick={handleAddExpense}
                className="bg-yellow-400 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-500 cursor-pointer "
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setAddExpenseModal(false)}
                className="bg-gray-400 text-white px-4 py-2 ml-2 rounded-md shadow  hover:bg-gray-500 cursor-pointer"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}


      {viewExpenseModal && selectedExpense && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-md p-6  w-3xl h-5/6">
            <div className="flex flex-col items-center justify-center pt-28">
              <h2 className="text-xl font-bold mb-4">Expense Details</h2>
              <p><strong>Date:</strong> {selectedExpense.date}</p>
              <p><strong>Amount:</strong> {selectedExpense.amount}</p>
              <p><strong>Category:</strong> {selectedExpense.category}</p>
              <p><strong>Payment Method:</strong> {selectedExpense.paymentMethod}</p>
              <p><strong>Description:</strong> {selectedExpense.description}</p>
              <button
                onClick={() => setViewExpenseModal(false)}
                className="bg-yellow-400 text-white px-4 py-2 rounded-md shadow mt-4 hover:bg-yellow-500 cursor-pointer"
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
