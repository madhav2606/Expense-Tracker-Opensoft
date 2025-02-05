import { useState } from "react"
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

  // Sample data
  const monthlyExpenses = [
    { month: "Jan", amount: 1200 },
    { month: "Feb", amount: 1400 },
    { month: "Mar", amount: 1100 },
    { month: "Apr", amount: 1300 },
    { month: "May", amount: 1500 },
    { month: "Jun", amount: 1200 },
  ]

  const topCategories = [
    { name: "Food", value: 500, color: "#FF6384" },
    { name: "Housing", value: 800, color: "#36A2EB" },
    { name: "Transportation", value: 300, color: "#FFCE56" },
    { name: "Entertainment", value: 200, color: "#4BC0C0" },
  ]

  const paymentMethods = [
    { method: "Credit Card", amount: 1200 },
    { method: "Debit Card", amount: 800 },
    { method: "Cash", amount: 300 },
    { method: "Digital Wallet", amount: 200 },
  ]

  const totalSpending = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
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

      {/* Monthly Expense Trends */}
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

      {/* Top Spending Categories */}
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

      {/* Payment Method Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Payment Method Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
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

