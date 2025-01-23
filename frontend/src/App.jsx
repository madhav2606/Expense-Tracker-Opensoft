import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex items-center justify-center p-3 text-3xl bg-yellow-300'>
         Expense Tracker App
      </div>
    </>
  )
}

export default App
