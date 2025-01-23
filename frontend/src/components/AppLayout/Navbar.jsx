import React from 'react'
import { CircleUserRound, Menu, Search,CircleDollarSign } from 'lucide-react';

const Navbar = ({ isOpen, toggleSidebar }) => {
    return (
        <div className='h-12 flex items-center justify-between p-4 py-8 px-10 border-b-1 border-gray-400'>
            <div className='flex items-center space-x-5'>
            <button onClick={toggleSidebar} className='hover:cursor-pointer'><Menu className='w-8 h-8' /></button>
            {!isOpen && <h1 className='flex items-center space-x-1 mx-auto'>
                <CircleDollarSign className='text-purple-800 pt-0.5 w-8 h-8' />
                <p className='text-purple-800 text-3xl font-bold'>SPEND</p><p className='text-3xl font-bold'>Sense</p>
            </h1>}
            </div>
            <div className='flex space-x-4'>
                <input type="text" name="" id="" placeholder='Search' className='p-1 px-4 rounded-full  w-96  border ' />
                <button onClick={() => { }} className='hover:cursor-pointer'><Search /></button>
            </div>
            <div className='flex items-center gap-2 text-xl hover:cursor-pointer'>
                <CircleUserRound className='w-8 h-8' />Profile
            </div>
        </div>
    )
}

export default Navbar