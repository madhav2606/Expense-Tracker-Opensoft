import React,{ useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "../../App.css"
import AdminDash from "../Admin/AdminDash"
import BudgetGoals from "../Budget/BudgetGoals"
import GroupBill from "../Groups/GroupBill"
import Settings from "../AppSettings/Settings"
import ExpenseList from "../Expense/ExpenseList"
import UserManage from "../Admin/UserManage"
import ActivityMonitor from "../Admin/ActivityMonitor"
import SystemHealth from "../Admin/SystemHealth"
import Dashboard from "../UserDashboard/Dashboard"

function App() {
  return (
    <div className="min-h-screen">
        <Routes>
          <Route path="/expenses" element={<ExpenseList />} />

          <Route path="/admin" element={<AdminDash />} />
          <Route path="/admin/users" element={<UserManage />} />
          <Route path="/admin/activity" element={<ActivityMonitor />} />
          <Route path="/admin/health" element={<SystemHealth />} />

          <Route path="/budget" element={<BudgetGoals />} />
          <Route path="/groups" element={<GroupBill />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </div>
  )
}

export default App

