import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  Alert,
  CircularProgress,
} from '@mui/material';
import leagueService from '../services/leagueService';

const LeagueView = () => {
  const { fsid } = useParams();
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        const data = await leagueService.getLeague(fsid);
        setLeague(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch league data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeague();
  }, [fsid]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!league) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">No league data found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Active League
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Last Updated: {new Date(league.lastUpdated).toLocaleString()}
      </Typography>

      {league.rounds.map((round) => (
        <Paper key={round.roundNumber} sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Round {round.roundNumber} - {new Date(round.date).toLocaleString()}
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Home Team</TableCell>
                  <TableCell align="center">Result</TableCell>
                  <TableCell>Away Team</TableCell>
                  <TableCell align="center">Match ID</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {round.matches.map((match) => (
                  <TableRow key={match.matchId}>
                    <TableCell>{match.homeTeam}</TableCell>
                    <TableCell align="center">
                      {match.result || 'Not Played'}
                    </TableCell>
                    <TableCell>{match.awayTeam}</TableCell>
                    <TableCell align="center">{match.matchId}</TableCell>
                    <TableCell align="center">
                      {match.isVoided ? (
                        <Typography color="error">
                          Voided - {match.voidReason}
                        </Typography>
                      ) : (
                        'Valid'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ))}
    </Container>
  );
};

export default LeagueView;
