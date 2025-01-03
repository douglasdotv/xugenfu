import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import authService from '../services/authService';
import { AuthContext } from '../contexts/AuthContext';
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  Box,
  Paper,
} from '@mui/material';

const Signup = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mzUsername, setMzUsername] = useState('');
  const [teamId, setTeamId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password && e.target.value !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await authService.register({
        username,
        email,
        name,
        mzUsername,
        teamId,
        teamName,
        password,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to sign up');
    }
  };

  if (auth) {
    return <Navigate to="/dashboard" />;
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
            Signup
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
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="MZ Username"
              fullWidth
              margin="normal"
              value={mzUsername}
              onChange={(e) => setMzUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="MZ Team ID"
              fullWidth
              margin="normal"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="MZ Team Name"
              fullWidth
              margin="normal"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={handlePasswordChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              error={Boolean(confirmPasswordError)}
              helperText={confirmPasswordError}
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
              Create
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
