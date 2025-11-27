import { useState } from 'react'
import AppRoutes from './routes/AppRoutes'
import Home from './components/Home'
import './App.css'
import { UserProvider } from './context/user.context'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    
        <UserProvider>
 

        <AppRoutes  />
    </UserProvider>
  
   
    </>
  )
}

export default App
