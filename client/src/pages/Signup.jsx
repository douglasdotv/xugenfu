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

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const TEAMID_REGEX = /^\d+$/;

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
  const [emailError, setEmailError] = useState('');
  const [teamIdError, setTeamIdError] = useState('');

  const validateForm = () => {
    let isValid = true;

    if (!EMAIL_REGEX.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!TEAMID_REGEX.test(teamId)) {
      setTeamIdError('Team ID must be a number');
      isValid = false;
    } else {
      setTeamIdError('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      await authService.register({
        username,
        email: email.toLowerCase().trim(),
        name: name.trim(),
        mzUsername: mzUsername.trim(),
        teamId: teamId.trim(),
        teamName: teamName.trim(),
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
      <Box sx={{ marginTop: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Signup
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              error={error.includes('Username')}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={!!emailError}
              helperText={emailError}
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
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="MZ Team ID"
              fullWidth
              margin="normal"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              required
              error={!!teamIdError}
              helperText={teamIdError}
              sx={{ mb: 2 }}
            />
            <TextField
              label="MZ Team Name"
              fullWidth
              margin="normal"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
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
              sx={{ mb: 2 }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={!!confirmPasswordError}
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
              Create Account
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
