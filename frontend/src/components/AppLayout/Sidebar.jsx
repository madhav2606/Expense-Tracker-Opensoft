import React, { useState , useEffect} from "react";
import {
  CircleDollarSign,
  HandCoins,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
  ChevronDown,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [selected, setSelected] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const location= useLocation();

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { id: "Dashboard", icon: <LayoutDashboard />, label: "Dashboard", path: "/dashboard" },
    { id: "Expense", icon: <HandCoins />, label: "Expenses", path: "/expenses" },
    { id: "Group", icon: <Users />, label: "Groups", path: "/groups" },
    { id: "Budget", icon: <Wallet />, label: "Budgets & Goals", path: "/budget" },
    { id: "Setting", icon: <Settings />, label: "Settings", path: "/settings" },
  ];

  const adminItems = [
    { id: "Admin Dashboard", label: "Dashboard", path: "/admin" },
    { id: "User Management", label: "User Management", path: "/admin/users" },
    { id: "Activity Monitor", label: "Activity Monitor", path: "/admin/activity" },
    { id: "System Health and Performance", label: "System Health", path: "/admin/health" },
  ];

  const changeFocusUser = (id) => {
    setSelected(id);
    setAdminOpen(false); 
    // if (isSidebarOpen) {
    //   toggleSidebar();
    // }
  };

  const ToggleAdminOpen=() => {
    setAdminOpen(!adminOpen);
    setSelected("");
  }

  useEffect(() => {
    const currentPath = location.pathname;
    const foundItemUser = menuItems.find(item => item.path.includes(currentPath));
    const foundItemAdmin = adminItems.find(item => item.path.includes(currentPath));
    if (foundItemUser) {
      setSelected(foundItemUser.id);
    } else if(foundItemAdmin){
      setAdminOpen(true);
      setSelected(foundItemAdmin.id);
    }else {
      setSelected("Dashboard");
    }
  }, [])
  


  return (
    <div
      className={`h-screen bg-white border-r border-gray-300 transition-all duration-500
      ${isSidebarOpen ? "w-79" : "w-0 overflow-hidden"} md:relative fixed z-50`}
    >
      {/* Toggle Button */}
      <button
        className="p-3 absolute right-[-12px] top-5 bg-gray-200 rounded-full shadow-md"
        onClick={toggleSidebar}
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Logo */}
      <div className="flex items-center justify-center py-4 space-x-2">
        <CircleDollarSign className="text-purple-800 w-8 h-8" />
        {isSidebarOpen && <p className="text-purple-800 text-2xl font-bold">SPEND <span className="text-black">Sense</span></p>}
      </div>

      {/* Menu Items */}
      <ul className="mt-6 space-y-2 px-3">
        {/* Admin Panel */}
        {user?.role === "Admin" && (
          <div>
            <button
              onClick={() => ToggleAdminOpen()}
              className={`flex items-center justify-between w-full p-3 rounded-lg transition-all 
              ${adminOpen ? "bg-purple-800 text-white font-semibold" : "hover:bg-purple-300"}`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck />
                {isSidebarOpen && "Admin"}
              </span>
              {isSidebarOpen && (adminOpen ? <ChevronDown /> : <ChevronRight />)}
            </button>

            {adminOpen && (
              <ul className="ml-5 mt-2 space-y-3">
                {adminItems.map((child, idx) => (
                  <Link to={child.path} key={idx}>
                    <li
                      onClick={() => setSelected(child.id)}
                      className={`p-2 rounded-lg transition-all my-1
                      ${selected === child.id ? "bg-purple-700 text-white" : "hover:bg-purple-300"}`}
                    >
                      {isSidebarOpen && child.label}
                    </li>
                  </Link>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* General Menu */}
        {menuItems.map((item, idx) => (
          <Link to={item.path} key={idx}>
            <li
              onClick={() => changeFocusUser(item.id)}
              className={`flex items-center gap-2 p-3 rounded-lg transition-all my-1
              ${selected === item.id ? "bg-purple-800 text-white font-semibold" : "hover:bg-purple-300"}`}
            >
              {item.icon}
              {isSidebarOpen && item.label}
            </li>
          </Link>
        ))}
      </ul>

      {/* Logout */}
      <div className="mt-auto px-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full p-3 rounded-lg text-red-600 hover:bg-red-100 transition-all"
        >
          <LogOut />
          {isSidebarOpen && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
