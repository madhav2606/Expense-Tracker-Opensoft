import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('monthly');
  const [filteredExpenseData, setFilteredExpenseData] = useState([]);

  const data = {
    income: 1200,
    expense: 300,
    stocks: 500,
    expenses: [
      { name: 'Jan', value: 50 },
      { name: 'Feb', value: 30 },
      { name: 'Mar', value: 80 },
      { name: 'Apr', value: 70 },
      { name: 'May', value: 90 },
      { name: 'Jun', value: 110 },
      { name: 'Jul', value: 100 },
      { name: 'Aug', value: 60 },
      { name: 'Sep', value: 95 },
      { name: 'Oct', value: 85 },
      { name: 'Nov', value: 75 },
      { name: 'Dec', value: 120 }
    ],
    weeklyExpenses: [ 
        { name: 'Week 1', value: 20 },
        { name: 'Week 2', value: 35 },
        { name: 'Week 3', value: 50 },
        { name: 'Week 4', value: 45 },
        { name: 'Week 5', value: 60 },
      ],
      yearlyExpenses: [ 
        { name: '2023', value: 900 },
        { name: '2024', value: 1200 },
      ],
    categoryExpenseData: [
      { name: 'Rent', value: 150, color: '#9b59b6' },
      { name: 'Groceries', value: 80, color: '#f39c12' },
      { name: 'Utilities', value: 50, color: '#3498db' },
      { name: 'Entertainment', value: 20, color: '#e74c3c' },
    ],
    recentExpenses: [
      { item: 'Coffee', amount: 5 },
      { item: 'Electric Bill', amount: 60 },
      { item: 'Groceries', amount: 40 },
      { item: 'Gym Membership', amount: 30 },
    ]
  };

  
  useEffect(() => {
    let filteredData;
    if (timeframe === 'monthly') {
      filteredData = data.expenses;
    } else if (timeframe === 'weekly') {
      filteredData = data.weeklyExpenses;
    } else {
      filteredData = data.yearlyExpenses;
    }
    setFilteredExpenseData(filteredData);
  }, [timeframe]);

  
  const totalExpense = data.categoryExpenseData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
     
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-800 p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-white">Income</h3>
          <p className="text-xl font-bold text-white">${data.income}</p>
        </div>
        <div className="bg-purple-800 p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-white">Expense</h3>
          <p className="text-xl font-bold text-white">${data.expense}</p>
        </div>
        <div className="bg-purple-800 p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-white">Stocks</h3>
          <p className="text-xl font-bold text-white">${data.stocks}</p>
        </div>
      </div>

      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Expense Overview</h3>
        <div className="flex gap-3 mb-4">
          <button className={`px-4 py-2 rounded-md cursor-pointer ${timeframe === 'weekly' ? 'bg-purple-800 text-white' : 'bg-gray-200  hover:bg-purple-300 hover:font-bold'}`} onClick={() => setTimeframe('weekly')}>Weekly</button>
          <button className={`px-4 py-2 rounded-md cursor-pointer ${timeframe === 'monthly' ? 'bg-purple-800 text-white' : 'bg-gray-200  hover:bg-purple-300 hover:font-bold'}`} onClick={() => setTimeframe('monthly')}>Monthly</button>
          <button className={`px-4 py-2 rounded-md cursor-pointer  ${timeframe === 'yearly' ? 'bg-purple-800 text-white' : 'bg-gray-200  hover:bg-purple-300 hover:font-bold'}`} onClick={() => setTimeframe('yearly')}>Yearly</button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredExpenseData}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Expenses</h3>
          <ul>
            {data.recentExpenses.map((expense, index) => (
              <li key={index} className="flex justify-between border-b py-2">
                <span className="text-gray-600">{expense.item}</span>
                <span className="font-bold text-red-500">${expense.amount}</span>
              </li>
            ))}
          </ul>
        </div>

       
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Category Expense</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.categoryExpenseData}
                dataKey="value"
                nameKey="name"
                label={({ name, value }) => `${name}: ${(value / totalExpense * 100).toFixed(1)}%`}
                stroke="#fff"
                strokeWidth={2}
              >
                {data.categoryExpenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${((value / totalExpense) * 100).toFixed(1)}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
