import React, { useState, useEffect } from 'react';
import { Users, Activity, BarChart2, Shield } from "lucide-react";
import UserActivity from './UserActivity';
import RecentUsers from './RecentUsers';
import CountUp from 'react-countup';
import './admin.css';
import { useAuth } from '../Context/AuthContext';
import AccessDenial from '../AuthRestrict/AccessDenial';

const AdminDash = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        userRoles: [],
        activityLevel: "",
        activePercentage:0,
        newUsersThisWeek:0,
        activityPercentageIncrease:0
    });
    const {user}=useAuth();

    // Fetching data from the backend
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:3000/dashboardStats',{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
            icon: <Users className="h-4 w-4 text-muted-foreground" />,
        },
        {
            title: "Active Users",
            value: stats.activeUsers,
            description: `${stats.activePercentage.toFixed(0)}% of total users`,
            icon: <Activity className="h-4 w-4 text-muted-foreground" />,
        },
        {
            title: "User Roles",
            value: stats.userRoles.length,
            description: stats.userRoles,
            icon: <Shield className="h-4 w-4 text-muted-foreground" />,
        },
        {
            title: "Activity Level",
            value: stats.activityLevel,
            description: `${stats.activePercentage.toFixed(0)}% increase this week`,
            icon: <BarChart2 className="h-4 w-4 text-muted-foreground" />,
        },
    ];
    if(user?.role!=="Admin")return <AccessDenial/>
    return (
        <div className='flex flex-col gap-8 mx-10'>
            <h1 className='text-4xl mt-8  font-bold '>Admin Dashboard</h1>
            <div className='grid grid-cols-4 py-2  space-x-5'>
                {dashboardStats.map((item, idx) => (
                    <div key={idx} className='p-4 rounded-xl bg-purple-800 text-white'>
                        <h1 className='flex items-center justify-between text-md'>
                            {item.title} {item.icon}
                        </h1>
                        {item.title !== "Activity Level" ? (
                            <span className='font-bold text-2xl'>
                                <CountUp end={item.value} />
                            </span>
                        ) : (
                            <span className='font-bold text-2xl'>{item.value}</span>
                        )}
                        <p className='text-sm'>{item.title==="User Roles"?(item.description.map(str=>str).join(',')):item.description}</p>
                    </div>
                ))}
            </div>
            <div className='flex space-x-5'>
                <UserActivity />
                <RecentUsers />
            </div>
        </div>
    );
};

export default AdminDash;
