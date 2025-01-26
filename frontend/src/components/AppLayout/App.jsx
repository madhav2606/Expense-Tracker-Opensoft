import React,{ useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "../../App.css"
import Expenses from "../Expense/Expenses"
import AdminDash from "../Admin/AdminDash"
import BudgetGoals from "../Budget/BudgetGoals"
import GroupBill from "../Groups/GroupBill"
import Settings from "../AppSettings/Settings"
import ExpenseList from "../Dashboard/ExpenseList"
import SignUpPage from "../Authentication/SignUpPage"
import SignInPage from "../Authentication/SignInPage"
import UserManage from "../Admin/UserManage"
import ActivityMonitor from "../Admin/ActivityMonitor"
import RoleManage from "../Admin/RoleManage"

function App() {
  return (
    <div className="min-h-screen">
        <Routes>
          <Route path="/expenses" element={<ExpenseList />} />

          <Route path="/admin" element={<AdminDash />} />
          <Route path="/admin/users" element={<UserManage />} />
          <Route path="/admin/activity" element={<ActivityMonitor />} />
          <Route path="/admin/roles" element={<RoleManage />} />

          <Route path="/budget" element={<BudgetGoals />} />
          <Route path="/groups" element={<GroupBill />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </div>
  )
}

export default App

