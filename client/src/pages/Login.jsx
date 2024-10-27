import { useState, useContext } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import authService from '../services/authService'
import { AuthContext } from '../contexts/AuthContext'
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  Box,
  Paper,
} from '@mui/material'

const Login = () => {
  const { auth, login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await authService.login({ username, password })
      login(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to log in')
    }
  }

  if (auth) {
    return <Navigate to="/dashboard" />
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ textAlign: 'center', mb: 3 }}
          >
            Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              size="large"
              sx={{ mt: 2, mb: 2, py: 1.5 }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login
