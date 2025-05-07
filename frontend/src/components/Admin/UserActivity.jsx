import { useState, useEffect } from "react";
import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { useAuth } from "../Context/AuthContext";
import { TrendingUp, UserPlus } from "lucide-react";

const UserActivity = () => {
    const [data, setData] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const response = await fetch("http://localhost:3000/activityChart", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        userid: user?._id
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const stats = await response.json();
                setData(stats.usersStatsPerDay);
            } catch (error) {
                console.error("Error fetching user stats:", error);
            }
        };
        fetchUserStats();
    }, [user]);

    // Custom tooltip style
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 shadow-md rounded-lg border border-gray-100">
                    <p className="font-medium text-gray-800">{label}</p>
                    <div className="flex items-center mt-2">
                        <span className="h-3 w-3 rounded-full bg-indigo-600 mr-2"></span>
                        <p className="text-sm text-gray-700">
                            Active Users: <span className="font-semibold">{payload[0].value}</span>
                        </p>
                    </div>
                    <div className="flex items-center mt-1">
                        <span className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></span>
                        <p className="text-sm text-gray-700">
                            New Users: <span className="font-semibold">{payload[1].value}</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Find the highest values to show in the summary
    const maxActiveUsers = data.length > 0 ? Math.max(...data.map(item => item.activeUsers)) : 0;
    const maxNewUsers = data.length > 0 ? Math.max(...data.map(item => item.newUsers)) : 0;
    const totalNewUsers = data.length > 0 ? data.reduce((sum, item) => sum + item.newUsers, 0) : 0;

    return (
        <div className="w-full h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-gray-800">User Activity Trends</h2>
                    <p className="text-sm text-gray-500">Daily active and new user statistics</p>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-md bg-indigo-100">
                            <TrendingUp className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Peak Activity</span>
                    </div>
                    <div className="mt-2">
                        <span className="text-2xl font-bold text-gray-800">{maxActiveUsers}</span>
                        <p className="text-xs text-gray-500 mt-1">Maximum active users in a day</p>
                    </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-md bg-emerald-100">
                            <UserPlus className="h-4 w-4 text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">New Users</span>
                    </div>
                    <div className="mt-2">
                        <span className="text-2xl font-bold text-gray-800">{totalNewUsers}</span>
                        <p className="text-xs text-gray-500 mt-1">Total new users in period</p>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg p-4 border border-gray-100">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart 
                        data={data}
                        margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="day" 
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                            axisLine={{ stroke: "#e5e7eb" }}
                            tickLine={{ stroke: "#e5e7eb" }}
                        />
                        <YAxis 
                            yAxisId="left" 
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                            axisLine={{ stroke: "#e5e7eb" }}
                            tickLine={{ stroke: "#e5e7eb" }}
                        />
                        <YAxis 
                            yAxisId="right" 
                            orientation="right" 
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                            axisLine={{ stroke: "#e5e7eb" }}
                            tickLine={{ stroke: "#e5e7eb" }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                            verticalAlign="top"
                            align="right"
                            height={36}
                            iconType="circle"
                            iconSize={8}
                        />
                        <Line
                            name="Active Users"
                            yAxisId="left"
                            type="monotone"
                            dataKey="activeUsers"
                            stroke="#4f46e5"
                            strokeWidth={2}
                            activeDot={{ r: 6, fill: "#4f46e5", stroke: "#fff", strokeWidth: 2 }}
                            dot={{ r: 0 }}
                        />
                        <Line
                            name="New Users"
                            yAxisId="right"
                            type="monotone"
                            dataKey="newUsers"
                            stroke="#10b981"
                            strokeWidth={2}
                            activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                            dot={{ r: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default UserActivity;