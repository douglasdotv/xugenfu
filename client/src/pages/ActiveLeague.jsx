import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, CircularProgress, Alert } from '@mui/material';
import leagueService from '../services/leagueService';

const ActiveLeague = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await leagueService.getActiveLeague();
        if (data && data.fsid) {
          navigate(`/leagues/${data.fsid}`);
        } else {
          setError('No league found');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch latest league');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return null;
};

export default ActiveLeague;
