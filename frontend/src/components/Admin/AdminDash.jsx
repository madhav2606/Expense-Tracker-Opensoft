import React, { useState, useEffect } from "react";
import { Users, Activity, BarChart2, Shield, TrendingDownIcon, TrendingUpIcon, Loader } from "lucide-react";
import UserActivity from "./UserActivity";
import RecentUsers from "./RecentUsers";
import CountUp from "react-countup";
import { useAuth } from "../Context/AuthContext";
import AccessDenial from "../AuthRestrict/AccessDenial";

const AdminDash = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        userRoles: [],
        activityLevel: "",
        activePercentage: 0,
        newUsersThisWeek: 0,
        activityPercentageIncrease: 0,
    });

    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/dashboardStats`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        userid: user?._id,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                setLoading(false);
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const dashboardStats = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            description: `+${stats.newUsersThisWeek} new users this week`,
            icon: <Users className="h-6 w-6 text-white" />,
            bgColor: "from-blue-500 to-indigo-600",
        },
        {
            title: "Active Users",
            value: stats.activeUsers,
            description: `${stats.activePercentage.toFixed(0)}% of total users`,
            icon: <Activity className="h-6 w-6 text-white" />,
            bgColor: "from-green-500 to-teal-600",
        },
        {
            title: "User Roles",
            value: stats.userRoles.length,
            description: stats.userRoles,
            icon: <Shield className="h-6 w-6 text-white" />,
            bgColor: "from-purple-500 to-pink-600",
        },
        {
            title: "Activity Level",
            value: stats.activityLevel,
            description: `${stats.activePercentage.toFixed(0)}% increase this week`,
            icon: <BarChart2 className="h-6 w-6 text-white" />,
            bgColor: "from-yellow-500 to-orange-600",
        },
    ];

    if (user?.role !== "Admin") return <AccessDenial />;
    if (loading) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
              <p className="mt-4 text-lg text-gray-700">Loading Platform insights...</p>
            </div>
          </div>
        )
      }

    return (
        <div className="bg-gray-50 min-h-screen p-6 sm:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                        Admin Dashboard
                    </h1>
                    <div className="bg-white p-2 rounded-full shadow-sm">
                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                            <Users className="h-4 w-4 text-white" />
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardStats.map((item, idx) => (
                        <div
                            key={idx}
                            className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.bgColor}"></div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-medium text-gray-500">{item.title}</h2>
                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${item.bgColor}`}>
                                        {item.icon}
                                    </div>
                                </div>
                                <div className="flex items-end space-x-2">
                                    {item.title === "Activity Level" && (
                                        <span className="text-sm font-medium text-gray-500 mb-1 ml-1">
                                            {item.value === "High" ? <TrendingUpIcon/> : item.value === "Medium" ? "" : <TrendingDownIcon/>}
                                        </span>
                                    )}
                                    <span className="text-2xl font-bold text-gray-800">
                                        {item.value}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    {item.title === "User Roles"
                                        ? item.description.map((role) => (
                                            <span key={role} className="inline-block bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-xs mr-1 mb-1">
                                                {role}
                                            </span>
                                        ))
                                        : item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                        <UserActivity />
                    </div>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                        <RecentUsers />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDash;