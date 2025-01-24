import React , {useState} from 'react'
import {Pencil , Trash2 , Eye} from 'lucide-react'
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


  //handle add expenses
  function handleAddExpense(){
    //Navigate to AddExpense page
  }

  //handle edit expenses
  function handleEditExpense(){
    //Navigate to EditExpense Page
  }

 //handle view expense
 function handleViewExpense(){
  //Navigate to view Expense page
 }

 //handle delete expense
function handleDeleteExpense(id){
  const confirmDelete = window.confirm('Are you sure you want to delete this expense?');
  if (confirmDelete) {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
  }
}

  return (
    <div className='flex  min-h-screen'>
      <main className="flex-1 bg-white rounded-md  p-4 ml-4">
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold">Expenses</h1>
      <button onClick={handleAddExpense} className="bg-yellow-400 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-500">
        Add New Expense
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse">
        {/* Table header */}
        <thead>
          <tr>
            <th className="text-left px-4 py-2">Date</th>
            <th className="text-left px-4 py-2">Amount</th>
            <th className="text-left px-4 py-2">Category</th>
            <th className="text-left px-4 py-2">Payment Method</th>
            <th className="text-left px-4 py-2">Description</th>
          </tr>
        </thead>

        {/* Table body */}
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={index} className="odd:bg-white even:bg-gray-50 h-[10rem]">
              <td className="px-4 py-2">{expense.date}</td>
              <td className="px-4 py-2">{expense.amount}</td>
              <td className=" px-4 py-2">{expense.category}</td>
              <td className=" px-4 py-2">{expense.paymentMethod}</td>
              <td className="px-4 py-2">{expense.description}</td>
              <td className=" px-4 py-2 text-center space-x-2">
                <button onClick={handleEditExpense} className="text-yellow-500 hover:text-yellow-600 cursor-pointer">
                  <Pencil />
                </button>
                <button onClick={() => handleDeleteExpense(expense.id)} className=" text-yellow-500 hover:text-yellow-600 cursor-pointer">
                  <Trash2 />
                </button>
                <button onClick={handleViewExpense} className=' text-yellow-500 hover:text-yellow-600 cursor-pointer'>
                  <Eye />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </main>
    </div>
  )
}

export default ExpenseList
