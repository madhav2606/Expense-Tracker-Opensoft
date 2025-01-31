import React from 'react'

const Modal = ({ title, onClose, onSave, expense, handleInputChange }) => {
  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-md p-6 w-4/6 h-5/6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <form>
        <input
          type="date"
          name="date"
          value={expense.date}
          onChange={handleInputChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          name="amount"
          placeholder="Amount"
          value={expense.amount}
          onChange={handleInputChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={expense.category}
          onChange={handleInputChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          name="paymentMethod"
          placeholder="Payment Method"
          value={expense.paymentMethod}
          onChange={handleInputChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={expense.description}
          onChange={handleInputChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <button
          type="button"
          onClick={onSave}
          className="bg-yellow-400 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-500"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded-md shadow ml-2 hover:bg-gray-500"
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
  )
}

export default Modal
