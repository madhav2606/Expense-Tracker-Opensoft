import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
    { name: "Mon", activeUsers: 400, newUsers: 24 },
    { name: "Tue", activeUsers: 300, newUsers: 13 },
    { name: "Wed", activeUsers: 500, newUsers: 32 },
    { name: "Thu", activeUsers: 450, newUsers: 27 },
    { name: "Fri", activeUsers: 600, newUsers: 41 },
    { name: "Sat", activeUsers: 400, newUsers: 15 },
    { name: "Sun", activeUsers: 380, newUsers: 12 },
]

const UserActivity = () => {
    return (
        <div className='space-y-8 w-1/2 border border-gray-500 rounded-xl p-2'>
            <h1 className='px-5 text-2xl font-bold'>User Activity</h1>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="activeUsers" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="newUsers" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default UserActivity