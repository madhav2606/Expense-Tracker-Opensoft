import { MoreHorizontal } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'

const role = [
    { id: 1, name: "Admin", permissions: ["Full Access"], userCount: 5 },
    { id: 2, name: "Manager", permissions: ["User Management", "Content Management"], userCount: 15 },
    { id: 3, name: "User", permissions: ["View Content", "Create Posts"], userCount: 980 },
    { id: 4, name: "Guest", permissions: ["View Content"], userCount: 234 },
  ]
  

const RoleManage = () => {

    const [roles, setroles] = useState(role)

    return (
        <div className='flex flex-col gap-8 mx-10'>
            <h1 className='text-4xl mt-8 font-bold'>Role Management</h1>
            <div className='flex items-center space-x-5'>
                <button className='px-4 p-2 text-white bg-purple-800 rounded-xl hover:cursor-pointer'>Create New Role</button>
            </div>
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="text-left">
                        <th className="p-4 border-b border-gray-200 text-sm text-gray-600 col-span-2">Role Name</th>
                        <th className="p-4 border-b border-gray-200 text-sm text-gray-600">Permissions</th>
                        <th className="p-4 border-b border-gray-200 text-sm text-gray-600">User Count</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.length > 0 ? (roles?.map((item, index) => (
                        <tr key={index} className="relative hover:bg-gray-50">
                            <td className="p-4 border-b border-gray-200">{item.name}</td>
                            <td className="p-4 border-b border-gray-200">{item.permissions}</td>
                            <td className="p-4 border-b border-gray-200">{item.userCount}</td>
                        </tr>
                    ))) : (
                        <tr>
                            <td>No user roles created yet</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default RoleManage
