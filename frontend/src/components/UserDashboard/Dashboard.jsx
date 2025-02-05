import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"

const SpendingAnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState("monthly")
  const [expenses , setExpenses] = useState([]);

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
  

  const monthlyExpensesMap = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + Number(expense.amount);
    console.log(acc[month])
    return acc;
  }, {});
  
  const monthlyExpenses = Object.keys(monthlyExpensesMap).map(month => ({
    month,
    amount: monthlyExpensesMap[month],
  }));
  

  const categoriesMap = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
    return acc;
  }, {});
  
  const topCategories = Object.keys(categoriesMap).map((category, index) => ({
    name: category,
    value: categoriesMap[category],
    color: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"][index % 5],
  }));
  

  const paymentMethodsMap = expenses.reduce((acc, expense) => {
    acc[expense.paymentMethod] = (acc[expense.paymentMethod] || 0) + Number(expense.amount);
    return acc;
  }, {});
  
  const paymentMethods = Object.keys(paymentMethodsMap).map(method => ({
    method,
    amount: paymentMethodsMap[method],
  }));
  

  const totalSpending = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  // console.log(totalSpending)
  const averageMonthlySpending = totalSpending / monthlyExpenses.length

  const getFinancialProfile = (average) => {
    if (average < 1000) return { label: "Saver", color: "text-green-600" }
    if (average < 1500) return { label: "Balanced", color: "text-blue-600" }
    return { label: "Spender", color: "text-red-600" }
  }

  const profile = getFinancialProfile(averageMonthlySpending)

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Spending Analytics Dashboard</h1>

      {/* Financial Profile */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Financial Profile</h2>
        <div className="flex items-center">
          <span className="text-4xl font-bold mr-4">{profile.label}</span>
          <span className={`text-2xl ${profile.color}`}>${averageMonthlySpending.toFixed(2)} / month</span>
        </div>
      </div>

      
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Monthly Expense Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyExpenses}>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Top Spending Categories</h2>
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={topCategories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {topCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2 mt-4 md:mt-0">
            <ul className="space-y-2">
              {topCategories.map((category, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{category.name}</span>
                  <span className="font-bold">${category.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Payment Method Breakdown</h2>
        <ResponsiveContainer className="w-full h-full">
          <BarChart data={paymentMethods}>
            <XAxis dataKey="method" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default SpendingAnalyticsDashboard

