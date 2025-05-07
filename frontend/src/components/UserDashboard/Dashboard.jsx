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
  Area,
  AreaChart
} from "recharts"
import { TrendingUp, PieChartIcon, CreditCard, Calendar, ArrowRight, DollarSign, Loader } from "lucide-react"
import { useAuth } from "../Context/AuthContext"

const SpendingAnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState("monthly")
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedMonth, setSelectedMonth] = useState(null)

  useEffect(() => {
    const fetchExpenses = async (userId, token) => {
      setLoading(true)
      try {
        const response = await fetch(`${process.env.VITE_BACKEND_URL}/expenses/get/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch expenses")
        }
        const data = await response.json()
        setExpenses(data)
      } catch (error) {
        console.log(error.message)
      } finally {
        setLoading(false)
      }
    }

    const user = JSON.parse(localStorage.getItem("user"))
    const token = localStorage.getItem("token")
    if (user?._id && token) {
      fetchExpenses(user._id, token)
    } else {
      setLoading(false)
    }
  }, [])

  // Process data
  const monthlyExpensesMap = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date)
    const month = date.toLocaleString("default", { month: "short" })
    acc[month] = (acc[month] || 0) + Number(expense.amount)
    return acc
  }, {})
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const monthlyExpenses = monthNames.map(month => ({
    month,
    amount: monthlyExpensesMap[month] || 0,
  }))

  const categoriesMap = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount)
    return acc
  }, {})
  
  const categoryColors = {
    Food: "#FF6384",
    Shopping: "#36A2EB", 
    Housing: "#FFCE56",
    Transportation: "#4BC0C0",
    Entertainment: "#9966FF",
    Utilities: "#FF9F40",
    Healthcare: "#8ED1FC",
    Education: "#FFD166",
    Travel: "#06D6A0",
    Other: "#EF476F"
  }

  const topCategories = Object.keys(categoriesMap)
    .map(category => ({
      name: category,
      value: categoriesMap[category],
      color: categoryColors[category] || "#CCCCCC"
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const paymentMethodsMap = expenses.reduce((acc, expense) => {
    acc[expense.paymentMethod] = (acc[expense.paymentMethod] || 0) + Number(expense.amount)
    return acc
  }, {})
  
  const paymentMethodColors = {
    "Credit Card": "#36A2EB",
    "Debit Card": "#FF6384",
    "Cash": "#FFCE56",
    "Online Transfer": "#4BC0C0",
    "Mobile Wallet": "#9966FF"
  }
  
  const paymentMethods = Object.keys(paymentMethodsMap)
    .map(method => ({
      method,
      amount: paymentMethodsMap[method],
      color: paymentMethodColors[method] || "#CCCCCC"
    }))
    .sort((a, b) => b.amount - a.amount)

  const totalSpending = Object.values(categoriesMap).reduce((sum, amount) => sum + amount, 0)
  const averageMonthlySpending = monthlyExpenses.length > 0 
    ? totalSpending / monthlyExpenses.filter(m => m.amount > 0).length 
    : 0

  const getFinancialProfile = (average) => {
    if (average < 1000) return { label: "Saver", color: "text-emerald-600", bgColor: "bg-emerald-100" }
    if (average < 1500) return { label: "Balanced", color: "text-blue-600", bgColor: "bg-blue-100" }
    return { label: "Spender", color: "text-rose-600", bgColor: "bg-rose-100" }
  }

  const profile = getFinancialProfile(averageMonthlySpending)

  // Generate summary stats
  const highestCategory = topCategories.length > 0 ? topCategories[0] : { name: "N/A", value: 0 }
  const highestMonth = [...monthlyExpenses].sort((a, b) => b.amount - a.amount)[0]
  
  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded">
          <p className="font-semibold">{label}</p>
          <p className="text-lg font-bold text-indigo-600">${payload[0].value.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-700">Loading your financial insights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeframe("monthly")}
                className={`px-3 py-2 text-sm font-medium rounded ${
                  timeframe === "monthly" 
                  ? "bg-indigo-100 text-indigo-700" 
                  : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTimeframe("quarterly")}
                className={`px-3 py-2 text-sm font-medium rounded ${
                  timeframe === "quarterly" 
                  ? "bg-indigo-100 text-indigo-700" 
                  : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                Quarterly
              </button>
              <button
                onClick={() => setTimeframe("yearly")}
                className={`px-3 py-2 text-sm font-medium rounded ${
                  timeframe === "yearly" 
                  ? "bg-indigo-100 text-indigo-700" 
                  : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8" aria-label="Dashboard Navigation">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === "overview"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === "categories"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === "payments"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Payment Methods
            </button>
          </nav>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center">
              <div className={`p-3 rounded-full mr-4 ${profile.bgColor}`}>
                <DollarSign className={`w-6 h-6 ${profile.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Monthly Average</p>
                <p className="text-2xl font-bold text-gray-900">${averageMonthlySpending.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded ${profile.bgColor} ${profile.color}`}>
                  {profile.label}
                </span>
                <span className="text-sm text-gray-500">Financial Profile</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${totalSpending.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Across all categories</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <PieChartIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Top Category</p>
                <p className="text-2xl font-bold text-gray-900">{highestCategory.name}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">${highestCategory.value.toFixed(2)}</span>
                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-600 rounded">
                  {totalSpending > 0 ? Math.round((highestCategory.value / totalSpending) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 mr-4">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Highest Month</p>
                <p className="text-2xl font-bold text-gray-900">{highestMonth.month}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">${highestMonth.amount.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Monthly Expense Chart */}
            <div className="bg-white rounded-lg shadow mb-8 border border-gray-100">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Trends</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyExpenses} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#6366F1" 
                      fillOpacity={1} 
                      fill="url(#colorAmount)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Spending Categories and Payment Methods in a grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Categories */}
              <div className="bg-white rounded-lg shadow border border-gray-100">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Spending Categories</h2>
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={topCategories}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={2}
                          >
                            {topCategories.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-1/2 mt-4 md:mt-0">
                      <ul className="space-y-3">
                        {topCategories.map((category, index) => (
                          <li key={index} className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <div className="flex-1 flex justify-between items-center">
                              <span className="text-sm text-gray-700">{category.name}</span>
                              <span className="font-medium">${category.value.toFixed(2)}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-lg shadow border border-gray-100">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method Breakdown</h2>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={paymentMethods}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis 
                        type="number" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="method" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        width={100}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
                      <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                        {paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "categories" && (
          <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Category Analysis</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={Object.keys(categoriesMap).map(category => ({
                        name: category,
                        value: categoriesMap[category],
                        color: categoryColors[category] || "#CCCCCC"
                      }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={140}
                      paddingAngle={2}
                      label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {Object.keys(categoriesMap).map((category, index) => (
                        <Cell key={`cell-${index}`} fill={categoryColors[category] || "#CCCCCC"} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-4">All Categories</h3>
                <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {Object.keys(categoriesMap)
                    .sort((a, b) => categoriesMap[b] - categoriesMap[a])
                    .map((category, index) => (
                      <li key={index} className="flex items-center p-2 hover:bg-gray-50 rounded">
                        <div
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: categoryColors[category] || "#CCCCCC" }}
                        ></div>
                        <div className="flex-1 flex justify-between items-center">
                          <span className="text-sm text-gray-700">{category}</span>
                          <div className="text-right">
                            <span className="block font-medium">${categoriesMap[category].toFixed(2)}</span>
                            <span className="text-xs text-gray-500">
                              {totalSpending > 0 ? ((categoriesMap[category] / totalSpending) * 100).toFixed(1) : 0}% of total
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Method Analysis</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={paymentMethods}
                    margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="method" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12, angle: -45, textAnchor: 'end' }}
                      height={60}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {paymentMethods.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-2">Payment Insights</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {paymentMethods.length > 0 ? 
                      `Your most used payment method is ${paymentMethods[0].method}, accounting for ${totalSpending > 0 ? ((paymentMethods[0].amount / totalSpending) * 100).toFixed(1) : 0}% of your total spending.` : 
                      "No payment data available."
                    }
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="text-xs text-gray-500">Methods Used</p>
                      <p className="text-lg font-bold">{paymentMethods.length}</p>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="text-xs text-gray-500">Preferred Method</p>
                      <p className="text-lg font-bold truncate">{paymentMethods.length > 0 ? paymentMethods[0].method : "N/A"}</p>
                    </div>
                  </div>
                </div>
                <ul className="space-y-3">
                  {paymentMethods.map((method, index) => (
                    <li key={index} className="flex items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                      <div className="p-2 rounded-full mr-3" style={{ backgroundColor: `${method.color}20` }}>
                        <CreditCard style={{ color: method.color }} className="w-5 h-5" />
                      </div>
                      <div className="flex-1 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-800">{method.method}</span>
                        <div className="text-right">
                          <span className="block font-medium">${method.amount.toFixed(2)}</span>
                          <span className="text-xs text-gray-500">
                            {totalSpending > 0 ? ((method.amount / totalSpending) * 100).toFixed(1) : 0}% of total
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SpendingAnalyticsDashboard