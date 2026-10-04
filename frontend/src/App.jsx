import { useState } from 'react'
import Login from './Login.jsx'
import Register from './Register.jsx'

function App() {
  const [page, setPage] = useState('login')

  if (page === 'register') {
    return <Register onNavigate={setPage} />
  }

  return <Login onNavigate={setPage} />
}

export default App