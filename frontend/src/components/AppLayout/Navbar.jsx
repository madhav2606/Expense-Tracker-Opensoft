import React from 'react'
import { Menu, Search } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
    return (
        <div className='h-12 flex items-center justify-between p-4 py-8 px-10 border-b-1 border-gray-400'>
            <button onClick={toggleSidebar} className='hover:cursor-pointer'><Menu className='w-8 h-8'/></button>
            <div className='flex space-x-4'>
                <input type="text" name="" id="" placeholder='Search' className='p-1 px-4 rounded-full  w-72  border ' />
                <button onClick={()=>{}} className='hover:cursor-pointer'><Search/></button>
            </div>

        </div>
    )
}

export default Navbar