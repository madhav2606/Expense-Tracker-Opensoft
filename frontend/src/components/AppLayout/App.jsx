import { useState } from 'react'
import '../../App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex items-center justify-center p-3 text-3xl min-h-screen'>
         Expense Tracker App
      </div>
    </>
  )
}

export default App
