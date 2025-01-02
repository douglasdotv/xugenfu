import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import scoringService from '../services/scoringService';

const Leaderboard = ({ fsid }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await scoringService.getLeaderboard(fsid);
        setLeaderboard(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [fsid]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Leaderboard
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Player</TableCell>
              <TableCell align="right">Total Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.map((entry) => (
              <TableRow
                key={entry.userId}
                sx={({ palette }) => {
                  let backgroundColor = 'inherit';
                  if (entry.rank === 1) {
                    backgroundColor = palette.warning.light;
                  } else if (entry.rank <= 3) {
                    backgroundColor = palette.action.hover;
                  }
                  return { backgroundColor };
                }}
              >
                <TableCell>{entry.rank}</TableCell>
                <TableCell>{entry.name || entry.username}</TableCell>
                <TableCell align="right">{entry.totalPoints}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Leaderboard;
