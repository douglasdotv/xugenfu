import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

const Dashboard = () => {
  const { auth } = useContext(AuthContext)

  return (
    <div>
      <h2>Dashboard</h2>
      <p>You are logged in as {auth.user.username}.</p>
    </div>
  )
}

export default Dashboard
