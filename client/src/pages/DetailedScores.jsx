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
  Grid,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import scoringService from '../services/scoringService';

const DetailedScores = () => {
  const { fsid } = useParams();
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          Your Detailed Scores
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Summary
            </Typography>
            <Typography variant="h3" color="primary">
              {scores.totalScore}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Total Points
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Round Details
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Round</TableCell>
                    <TableCell align="right">Points</TableCell>
                    <TableCell>Predictions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scores.roundScores
                    .sort((a, b) => b.roundNumber - a.roundNumber)
                    .map((round) => (
                      <TableRow key={round.roundNumber}>
                        <TableCell>Round {round.roundNumber}</TableCell>
                        <TableCell align="right">{round.score}</TableCell>
                        <TableCell>
                          {round.predictions.map((pred) => (
                            <Typography
                              key={pred.matchId}
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 0.5 }}
                            >
                              {pred.prediction}
                            </Typography>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DetailedScores;
