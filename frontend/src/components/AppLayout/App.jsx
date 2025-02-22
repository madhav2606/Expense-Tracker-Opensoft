import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "../../App.css"
import Dashboard from "../UserDashboard/Dashboard"
import AdminDash from "../Admin/AdminDash"
import BudgetGoals from "../Budget/BudgetGoals"
import GroupBill from "../Groups/GroupBill"
import Settings from "../AppSettings/Settings"
import ExpenseList from "../Expense/ExpenseList"
import UserManage from "../Admin/UserManage"
import ActivityMonitor from "../Admin/ActivityMonitor"
import SystemHealth from "../Admin/SystemHealth"
import { useAuth } from "../Context/AuthContext"
import BillDetails from "../Groups/BillDetails"

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Routes>
          <Route path="/admin" element={<AdminDash />} />
          <Route path="/admin/users" element={<UserManage />} />
          <Route path="/admin/activity" element={<ActivityMonitor />} />
          <Route path="/admin/health" element={<SystemHealth />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/budget" element={<BudgetGoals />} />
          <Route path="/groups" element={<GroupBill />} />
          <Route path="/groups/:groupId" element={<BillDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </div>
  )
}

export default App

