import React, { useState } from 'react';
import {
  CircleDollarSign,
  HandCoins,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  Users,
  Wallet
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [selected, setSelected] = useState('Dashboard');
  const [adminOpen, setAdminOpen] = useState(false);

  const menuItems = [
    {
      id: "Admin",
      icon: <ShieldCheck />,
      label: "Admin",
      path: "/admin",
      children: [
        { id: "Admin Dashboard", label: "Dashboard", path: "/admin" },
        { id: "User Management", label: "User Management", path: "/admin/users" },
        { id: "Activity Monitor", label: "Activity Monitor", path: "/admin/activity" },
        { id: "Role Management", label: "Role Management", path: "/admin/roles" }
      ],
    },
    { id: "Dashboard", icon: <LayoutDashboard />, label: "Dashboard", path: '/dashboard' },
    { id: "Expense", icon: <HandCoins />, label: "Expenses", path: '/expenses' },
    { id: "Group", icon: <Users />, label: "Groups", path: '/groups' },
    { id: "Budget", icon: <Wallet />, label: "Budgets & Goals", path: '/budget' },
    { id: "Setting", icon: <Settings />, label: "Settings", path: '/settings' },
  ];

  return (
    <div className='flex flex-col p-4 justify-between h-screen w-72'>
      <h1 className='flex items-center space-x-1 mx-auto'>
        <CircleDollarSign className='text-purple-800 pt-0.5 w-8 h-8' />
        <p className='text-purple-800 text-3xl font-bold'>SPEND</p>
        <p className='text-3xl font-bold'>Sense</p>
      </h1>

      <ul className='mt-10 space-y-3'>
        {menuItems.map((item, idx) => (
          <div key={idx}>
            {item.id !== "Admin" ? (
              <Link to={item.path}>
                <li
                  onClick={() => { setSelected(item.id); setAdminOpen(false) }}
                  className={`text-lg flex items-center gap-2 p-3 
                  ${selected === item.id && 'bg-purple-800 text-white font-bold'} 
                  rounded-2xl hover:cursor-pointer 
                  ${selected !== item.id && 'hover:bg-purple-300 hover:font-bold'} mt-2`}
                >
                  {item.icon} {item.label}
                </li>
              </Link>
            ) : (
              <div>
                <Link to="/admin">
                  <li
                    onClick={() => { setAdminOpen(!adminOpen); setSelected("Admin Dashboard") }}
                    className={`text-lg flex items-center justify-between gap-2 p-3 
                  ${adminOpen && 'bg-purple-800 text-white font-bold'} 
                  rounded-2xl hover:cursor-pointer 
                  ${!adminOpen && 'hover:bg-purple-300 hover:font-bold'} mt-2`}
                  >
                    <span className='flex items-center gap-2'>{item.icon} {item.label}</span>
                  </li>
                </Link>
                {adminOpen && (
                  <ul className="ml-8 mt-2 space-y-2">
                    {item.children.map((child, idx) => (
                      <Link to={child.path} key={idx}>
                        <li
                          onClick={() => setSelected(child.id)}
                          className={`text-md p-2 pl-5 rounded-lg 
                          ${selected === child.id ? 'bg-purple-700 text-white font-semibold' : 'hover:bg-purple-300 hover:font-bold'}`}
                        >
                          {child.label}
                        </li>
                      </Link>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </ul>

      <div className='mt-auto'>
        <li
          className='hover:cursor-pointer flex items-center gap-2 text-lg p-3 
          hover:bg-purple-300 hover:font-bold rounded-2xl'
        >
          <LogOut /> Logout
        </li>
      </div>
    </div>
  );
}

export default Sidebar;
