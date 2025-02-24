import { useState, useEffect } from "react";
import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { useAuth } from "../Context/AuthContext";
import './admin.css'

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
    }, []);

    return (
        <div className="w-full mx-auto sm:w-3/4 md:w-1/2 bg-white border border-gray-300 shadow-lg rounded-xl p-5">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">User Activity</h1>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#ddd" />
                    <XAxis dataKey="day" tick={{ fill: "#555" }} />
                    <YAxis yAxisId="left" tick={{ fill: "#555" }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: "#555" }} />
                    <Tooltip />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="activeUsers"
                        stroke="#4f46e5"
                        strokeWidth={2.5}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="newUsers"
                        stroke="#10b981"
                        strokeWidth={2.5}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UserActivity;
