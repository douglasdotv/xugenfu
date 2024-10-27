import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav>
      <Link to="/">Xugenfu</Link> |{' '}
      {auth ? (
        <>
          <Link to="/dashboard">Dashboard</Link> |{' '}
          <span>Welcome, {auth.user.username}!</span>
          <button onClick={handleLogout}>Log out</button>
        </>
      ) : (
        <>
          <Link to="/login">Log in</Link> | <Link to="/signup">Sign up</Link>
        </>
      )}
    </nav>
  )
}

export default Navbar
