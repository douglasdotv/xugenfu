import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

const Dashboard = () => {
  const { auth } = useContext(AuthContext)

  if (!auth) {
    return <Navigate to="/login" replace />
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>You are logged in as {auth.user.username}.</p>
    </div>
  )
}

export default Dashboard
