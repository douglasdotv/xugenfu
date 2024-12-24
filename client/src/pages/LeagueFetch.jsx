import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Paper,
} from '@mui/material';
import leagueService from '../services/leagueService';

const LeagueFetch = () => {
  const navigate = useNavigate();
  const [fsid, setFsid] = useState('');
  const [phpsessid, setPhpsessid] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await leagueService.fetchLeagueData(fsid, phpsessid);
      setStatus({
        type: 'success',
        message: 'League data fetched successfully',
      });
      navigate(`/leagues/${fsid}`);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.error || 'Failed to fetch league data',
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Fetch Friendly League Data
          </Typography>
          {status.message && (
            <Alert severity={status.type} sx={{ mb: 2 }}>
              {status.message}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Friendly League ID (fsid)"
              fullWidth
              margin="normal"
              value={fsid}
              onChange={(e) => setFsid(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="PHPSESSID"
              fullWidth
              margin="normal"
              value={phpsessid}
              onChange={(e) => setPhpsessid(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
            >
              Fetch Data
            </Button>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              align="center"
              sx={{ mt: 2 }}
            >
              Note: only xugenfu106/admin can see this page.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LeagueFetch;
