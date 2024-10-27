import { useState, useContext } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import authService from '../services/authService'
import { AuthContext } from '../contexts/AuthContext'

const Signup = () => {
  const { auth } = useContext(AuthContext)
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await authService.register({ username, name, password })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to sign up')
    }
  }

  if (auth) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div>
      <h2>Signup</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username:{' '}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Name:{' '}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Password:{' '}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default Signup
