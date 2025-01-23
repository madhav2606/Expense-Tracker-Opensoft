import React,{useState} from 'react'
import Sidebar from './components/AppLayout/Sidebar'
import App from './components/AppLayout/App'
import Footer from './components/AppLayout/Footer'
import Navbar from './components/AppLayout/Navbar'

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className='flex'>
            <div className={`h-screen ${isSidebarOpen && 'w-[30%]'}`} >
                {isSidebarOpen && <Sidebar/>}
            </div>
            <div className='w-full border border-l-1 border-gray-400'>
                <Navbar toggleSidebar={toggleSidebar} />
                <App />
                <Footer />
            </div>
        </div>
    )
}

export default Layout