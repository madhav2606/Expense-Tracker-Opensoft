import React , {useState} from 'react'
import {Pencil , Trash2 , Eye} from 'lucide-react'
import Modal from './Modal';

const ExpenseList = () => {

  //sample data array
  const [expenses , setExpenses] = useState([
    {
      id:1,
      date: '2025-01-20',
      amount: '$100',
      category: 'Transport',
      paymentMethod: 'Cash',
      description: 'Bus fare',
    },
    {
      id:2,
      date: '2025-01-21',
      amount: '$50',
      category: 'Food',
      paymentMethod: 'Card',
      description: 'Lunch at a cafe',
    },
    {
      id:3,
      date: '2025-01-22',
      amount: '$200',
      category: 'Shopping',
      paymentMethod: 'UPI',
      description: 'Bought clothes',
    },
    {
      id:4,
      date: '2025-01-23',
      amount: '$300',
      category: 'Entertainment',
      paymentMethod: 'Credit Card',
      description: 'Movie tickets',
    },
    {
      id:5,
      date: '2025-01-24',
      amount: '$150',
      category: 'Groceries',
      paymentMethod: 'PayPal',
      description: 'Weekly groceries',
    },
  ]);

  //Modal state

  const [addExpenseModal , setAddExpenseModal] = useState(false);
  const [viewExpenseModal , setViewExpenseModal] = useState(false);
  const [editExpenseModal , setEditExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState(
    { date: '', amount: '', category: '', paymentMethod: '', description: '' }
  );
  const [selectedExpense , setSelectedExpense] = useState(null);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const [searchQuery, setSearchQuery] = useState(""); 
  const [sortBy, setSortBy] = useState(""); 
  const [isAscending, setIsAscending] = useState(true);

//search function
  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //sort functionality
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === "date") {
      return isAscending
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else if (sortBy === "amount") {
      return isAscending ? a.amount - b.amount : b.amount - a.amount;
    } else {
      return 0; // Default (no sorting applied)
    }
  });

    
    const handleSearch = (e) => {
      setSearchQuery(e.target.value);
    };
  
    // Handle sort criteria and order
    const handleSort = (criteria) => {
      if (sortBy === criteria) {
        setIsAscending(!isAscending);
      } else {
        setSortBy(criteria);
        setIsAscending(true);
      }
    };

    // Handle input changes for new expense
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      if (editExpenseModal) {
        setExpenseToEdit({ ...expenseToEdit, [name]: value });
      } else {
        setNewExpense({ ...newExpense, [name]: value });
      }
    };

  //handle add expenses
  function handleAddExpense(){
    setExpenses([...expenses, { id: expenses.length + 1, ...newExpense }]);
    setAddExpenseModal(false);
    setNewExpense({ date: '', amount: '', category: '', paymentMethod: '', description: '' });
  }

  //handle edit expenses
  function handleEditExpense(expense){
    setExpenseToEdit(expense);
    setEditExpenseModal(true);
  }

 //handle view expense
 function handleViewExpense(expense){
  setSelectedExpense(expense);
  setViewExpenseModal(true);
 }

 //handle delete expense
function handleDeleteExpense(id){
  const confirmDelete = window.confirm('Are you sure you want to delete this expense?');
  if (confirmDelete) {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
  }
}

// Save edited expense
const handleSaveEditedExpense = () => {
  setExpenses(expenses.map((expense) => (expense.id === expenseToEdit.id ? expenseToEdit : expense)));
  setEditExpenseModal(false);
  setExpenseToEdit(null);
};

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
            placeholder="Search by category or description..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 border rounded"
          />
        </div>

        
        <div className="flex justify-end mb-4 space-x-4">
          <button
            onClick={() => handleSort("date")}
            className={`px-4 py-2 rounded-md shadow ${
              sortBy === "date"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Sort by Date {sortBy === "date" ? (isAscending ? "↑" : "↓") : ""}
          </button>
          <button
            onClick={() => handleSort("amount")}
            className={`px-4 py-2 rounded-md shadow ${
              sortBy === "amount"
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
                <button onClick={() => handleDeleteExpense(expense.id)} className=" text-yellow-500 hover:text-yellow-600 cursor-pointer">
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
