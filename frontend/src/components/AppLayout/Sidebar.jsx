import React, { useState } from 'react'
import { CircleDollarSign, HandCoins, Layout, LayoutDashboard, LogOut, Settings, ShieldCheck, Users, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
const Sidebar = () => {

  const [selected, setselected] = useState('Admin' | 'Dashboard')
  const menuItems = [
    { id: "Admin", icon: <ShieldCheck />, label: "Admin", path: '/admin' },
    { id: "Dashboard", icon: <LayoutDashboard />, label: "Dashboard", path: '/dashboard' },
    { id: "Expense", icon: <HandCoins />, label: "Expenses", path: '/expenses' },
    { id: "Group", icon: <Users />, label: "Groups", path: '/groups' },
    { id: "Budget", icon: <Wallet />, label: "Budgets & Goals", path: '/budget' },
    { id: "Setting", icon: <Settings />, label: "Settings", path: '/settings' },
  ]

  return (
    <div className='flex flex-col p-4 justify-around'>
      <h1 className='flex items-center space-x-1 mx-auto'>
        <CircleDollarSign className='text-purple-800 pt-0.5 w-8 h-8' />
        <p className='text-purple-800 text-3xl font-bold'>SPEND</p><p className='text-3xl font-bold'>Sense</p>
      </h1>
      <ul className='mt-10 space-y-3'>
        {
          menuItems?.map((item, idx) => {
            return <Link to={item.path} key={idx}>
               <li  onClick={() => setselected(item.id)} className={`text-lg flex items-center gap-2 p-3 ${selected == item.id && 'bg-purple-800 text-white font-bold'} rounded-2xl hover:cursor-pointer ${selected != item.id && 'hover:bg-purple-300 hover:font-bold'} mt-2`}>{item.icon} {item.label}</li>
            </Link>
          })
        }
      </ul>
      <div className='mt-20'>
        <li className='hover:cursor-pointer flex items-center gap-2 text-lg p-3 hover:bg-purple-300  hover:font-bold rounded-2xl'><LogOut />Logout</li>
      </div>
    </div>
  )
}

export default Sidebar