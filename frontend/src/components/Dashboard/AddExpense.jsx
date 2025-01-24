import React , {useState} from 'react'

const AddExpense = () => {

    const [newExpense, setNewExpense] = useState({
        date: '',
        amount: '',
        category: '',
        paymentMethod: '',
        description: '',
      });
    
      const handleChange = (e) => {
        setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = () => {
        if (Object.values(newExpense).every((value) => value !== '')) {
         // Navigate to main page with state as newExpense
        } else {
          alert('Please fill in all fields.');
        }
      };
    
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-20">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
            <div className="space-y-4">
              <input
                type="date"
                name="date"
                placeholder="Date"
                value={newExpense.date}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
              <input
                type="text"
                name="amount"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={newExpense.category}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
              <input
                type="text"
                name="paymentMethod"
                placeholder="Payment Method"
                value={newExpense.paymentMethod}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newExpense.description}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
              <button
                className="bg-yellow-400 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-500"
                onClick={handleSubmit}
              >
                Save Expense
              </button>
            </div>
          </div>
        </div>
  )
}

export default AddExpense
