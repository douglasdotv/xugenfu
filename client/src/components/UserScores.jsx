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
  IconButton,
  Collapse,
  Button,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import scoringService from '../services/scoringService';

const UserScores = ({ fsid }) => {
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const data = await scoringService.getUserScores(fsid);
        setScores(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch scores');
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h5">Your Scores</Typography>
        <Box>
          <IconButton onClick={() => setExpanded(!expanded)} size="small">
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      <Typography variant="h6" color="primary" gutterBottom>
        Total Points: {scores.totalScore}
      </Typography>

      <Collapse in={expanded}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Round</TableCell>
                <TableCell align="right">Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scores.roundScores
                .sort((a, b) => b.roundNumber - a.roundNumber)
                .slice(0, 5)
                .map((round) => (
                  <TableRow key={round.roundNumber}>
                    <TableCell>Round {round.roundNumber}</TableCell>
                    <TableCell align="right">{round.score}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            component={Link}
            to={`/leagues/${fsid}/scores`}
            variant="outlined"
            size="small"
          >
            View All Scores
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default UserScores;
