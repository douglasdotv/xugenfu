import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import scoringService from '../services/scoringService';

const DetailedLeaderboard = () => {
  const { fsid } = useParams();
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
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          to={`/leagues/${fsid}`}
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Back to League
        </Button>
        <Typography variant="h4" gutterBottom>
          Detailed Leaderboard
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>MZ Username</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Team</TableCell>
                <TableCell align="right">Total Points</TableCell>
                <TableCell>Round Scores</TableCell>
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
                  <TableCell>{entry.mzUsername}</TableCell>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell>
                    {entry.teamId !== undefined ? (
                      <a
                        href={`https://www.managerzone.com/?p=team&tid=${entry.teamId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'inherit',
                          textDecoration: 'underline',
                        }}
                      >
                        {entry.teamName}
                      </a>
                    ) : (
                      entry.teamName
                    )}
                  </TableCell>
                  <TableCell align="right">{entry.totalPoints}</TableCell>
                  <TableCell>
                    {Object.entries(entry.roundScores)
                      .sort(([a], [b]) => Number(b) - Number(a))
                      .map(([round, score]) => (
                        <Typography
                          key={round}
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          Round {round}: {score} pts
                        </Typography>
                      ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default DetailedLeaderboard;
