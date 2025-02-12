import { useState, useEffect } from "react";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../Context/AuthContext";

const UserActivity = () => {
    const [data, setData] = useState([]);
    const {user}=useAuth();

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const response = await fetch("http://4.186.56.130:3000/activityChart",{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        userid: user?._id
                    },
                    });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const stats = await response.json();
                setData(stats.usersStatsPerDay );
            } catch (error) {
                setError(error.message); 
            }
        };
        fetchUserStats();
    }, []);

    return (
        <div className='space-y-8 w-1/2 border border-gray-500 rounded-xl p-2'>
            <h1 className='px-5 text-2xl font-bold'>User Activity</h1>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="activeUsers" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="newUsers" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UserActivity;
