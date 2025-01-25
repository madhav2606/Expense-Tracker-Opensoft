import React from 'react'
import { Users, Activity, BarChart2, Shield } from "lucide-react";
import UserActivity from './UserActivity';
import RecentUsers from './RecentUsers';
import CountUp from 'react-countup';
import './admin.css'

const AdminDash = () => {
    const stats = [
        {
            title: "Total Users",
            value: "1234",
            description: "+21 new users this week",
            icon: <Users className="h-4 w-4 text-muted-foreground" />,
        },
        {
            title: "Active Users",
            value: "892",
            description: "72% of total users",
            icon: <Activity className="h-4 w-4 text-muted-foreground" />,
        },
        {
            title: "User Roles",
            value: "5",
            description: "Admin, Manager, User, etc.",
            icon: <Shield className="h-4 w-4 text-muted-foreground" />,
        },
        {
            title: "Activity Level",
            value: "High",
            description: "23% increase this week",
            icon: <BarChart2 className="h-4 w-4 text-muted-foreground" />,
        },
    ]
    return (
        <div className='flex flex-col gap-8 mx-10'>
            <h1 className='text-4xl mt-8  font-bold '>Admin Dashboard</h1>
            <div className='grid grid-cols-4 py-2  space-x-5'>
                {
                    stats?.map((item, idx) => {
                        return <div key={idx} className='p-4 rounded-xl bg-purple-800 text-white'>
                            <h1 className='flex items-center justify-between text-md'>{item.title} {item.icon}</h1>
                            {item.title != "Activity Level" ? <span className='font-bold text-2xl'>
                                <CountUp end={item.value} />
                            </span> : <span className='font-bold text-2xl'>
                                {item.value}
                            </span>}
                            <p className='text-sm'>{item.description}</p>
                        </div>
                    })
                }
            </div>
            <div className='flex space-x-5'>
                <UserActivity />
                <RecentUsers />
            </div>
        </div>
    )
}

export default AdminDash