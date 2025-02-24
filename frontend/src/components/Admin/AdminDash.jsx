import React, { useState, useEffect } from "react";
import { Users, Activity, BarChart2, Shield } from "lucide-react";
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

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("http://localhost:3000/dashboardStats", {
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
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    const dashboardStats = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            description: `+${stats.newUsersThisWeek} new users this week`,
            icon: <Users className="h-6 w-6 text-white opacity-80" />,
            bgColor: "bg-gradient-to-r from-blue-500 to-indigo-500",
        },
        {
            title: "Active Users",
            value: stats.activeUsers,
            description: `${stats.activePercentage.toFixed(0)}% of total users`,
            icon: <Activity className="h-6 w-6 text-white opacity-80" />,
            bgColor: "bg-gradient-to-r from-green-500 to-teal-500",
        },
        {
            title: "User Roles",
            value: stats.userRoles.length,
            description: stats.userRoles,
            icon: <Shield className="h-6 w-6 text-white opacity-80" />,
            bgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
        },
        {
            title: "Activity Level",
            value: stats.activityLevel,
            description: `${stats.activePercentage.toFixed(0)}% increase this week`,
            icon: <BarChart2 className="h-6 w-6 text-white opacity-80" />,
            bgColor: "bg-gradient-to-r from-yellow-500 to-orange-500",
        },
    ];

    if (user?.role !== "Admin") return <AccessDenial />;

    return (
        <div className="p-6 sm:px-10 space-y-5">

            <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((item, idx) => (
                    <div
                        key={idx}
                        className={`p-6 rounded-2xl shadow-md text-white ${item.bgColor} transition-all transform hover:scale-105`}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">{item.title}</h2>
                            {item.icon}
                        </div>
                        <span className="font-extrabold text-3xl">
                            <CountUp end={item.value} />
                        </span>
                        <p className="text-sm opacity-90 mt-1">
                            {item.title === "User Roles"
                                ? item.description.map((str) => str).join(", ")
                                : item.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Additional Sections */}
            <div className="flex flex-col md:flex-row gap-6 mt-8">
                <UserActivity />
                <RecentUsers />
            </div>


        </div>
    );
};

export default AdminDash;
