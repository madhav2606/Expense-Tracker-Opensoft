import React, { useState } from 'react';
import { 
  CircleUserRound, 
  Menu, 
  Bell, 
  CircleDollarSign,
  Search,
  Calendar,
  BarChart3,
  HelpCircle,
  Settings,
  LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Navbar = ({ isOpen, toggleSidebar }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const {user} =useAuth();

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showProfileDropdown) setShowProfileDropdown(false);
  };


  return (
    <div className="h-16 flex items-center justify-between px-4 md:px-6 py-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30 transition-all duration-300">
      {/* Left Section: Sidebar Toggle & Logo */}
      <div className="flex items-center space-x-3 md:space-x-5">
        <button 
          onClick={toggleSidebar} 
          className="hover:bg-gray-100 p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          aria-label="Toggle sidebar"
        >
          <Menu className={`w-5 h-5 text-gray-700 ${isOpen && "hidden"}`} />
        </button>
        
        {!isOpen && (
          <Link to="/dashboard" className="flex items-center space-x-1 group">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-1.5 rounded-md shadow-sm">
              <CircleDollarSign className="text-white w-5 h-5" />
            </div>
            <div className="flex items-baseline">
              <p className="text-purple-800 text-xl font-bold group-hover:text-purple-900 transition-colors">$PEND</p>
              <p className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">Sense</p>
            </div>
          </Link>
        )}
      </div>
      
      
      {/* Right Section: Notifications & Profile */}
      <div className="flex items-center space-x-2 md:space-x-6">
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={toggleNotifications}
            className="hover:bg-gray-100 p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-700" />
            {/* <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
              2
            </span> */}
          </button>
          
          {/* Notification Dropdown */}
          {/* {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
              <div className="py-2">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  <button className="text-xs text-purple-600 hover:text-purple-800">Mark all as read</button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map(notification => (
                    <div key={notification.id} className={`flex px-4 py-3 hover:bg-gray-50 ${notification.isNew ? 'bg-purple-50' : ''}`}>
                      <div className="flex-shrink-0 mr-3">
                        <div className={`h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center ${notification.isNew ? 'bg-purple-200' : ''}`}>
                          <BarChart3 className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                      <div className="w-full">
                        <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      {notification.isNew && (
                        <div className="flex-shrink-0 self-center">
                          <div className="h-2 w-2 bg-purple-600 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center py-2 border-t border-gray-100">
                  <Link to="/notifications" className="text-sm text-purple-600 hover:text-purple-800">View all notifications</Link>
                </div>
              </div>
            </div>
          )} */}
        </div>
        
        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={toggleProfileDropdown}
            className="flex items-center space-x-2 hover:bg-gray-100 p-1 pr-2 md:pr-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            aria-label="User menu"
          >
            <CircleUserRound className="w-6 h-6 text-gray-700" />
            <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name}</span>
          </button>
          
          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
              <div className="py-1">
                <Link to="/profile" onClick={()=>setShowProfileDropdown(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <CircleUserRound className="w-4 h-4 mr-3 text-gray-600" />
                  <span>Profile</span>
                </Link>
                <Link to="/settings" onClick={()=>setShowProfileDropdown(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings className="w-4 h-4 mr-3 text-gray-600" />
                  <span>Settings</span>
                </Link>
                {/* <Link to="/calendar" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Calendar className="w-4 h-4 mr-3 text-gray-600" />
                  <span>Calendar</span>
                </Link>
                <Link to="/help" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <HelpCircle className="w-4 h-4 mr-3 text-gray-600" />
                  <span>Help Center</span>
                </Link>
                <div className="border-t border-gray-100"></div>
                <Link to="/logout" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  <LogOut className="w-4 h-4 mr-3 text-red-600" />
                  <span>Sign out</span>
                </Link> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;