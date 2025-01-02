import { useState, useEffect, useContext } from 'react';
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
  Alert,
  CircularProgress,
  Button,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import leagueService from '../services/leagueService';
import VoidMatchDialog from '../components/VoidMatchDialog';
import Leaderboard from '../components/Leaderboard';
import UserScores from '../components/UserScores';

const LeagueView = () => {
  const { fsid } = useParams();
  const { auth } = useContext(AuthContext);
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);

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

  const handleVoidStatusUpdate = async (isVoided, voidReason) => {
    try {
      await leagueService.updateMatchVoidStatus(
        fsid,
        selectedMatch.matchId,
        isVoided,
        voidReason
      );

      const updatedLeague = {
        ...league,
        rounds: league.rounds.map((round) => ({
          ...round,
          matches: round.matches.map((match) =>
            match.matchId === selectedMatch.matchId
              ? { ...match, isVoided, voidReason }
              : match
          ),
        })),
      };
      setLeague(updatedLeague);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update match status');
    }
  };

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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          Active League
        </Typography>
        <Button
          component={Link}
          to={`/leagues/${fsid}/predictions`}
          variant="contained"
          color="primary"
        >
          Make Predictions
        </Button>
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Last Updated: {new Date(league.lastUpdated).toLocaleString()}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {league.rounds.map((round) => (
            <Paper key={round.roundNumber} sx={{ mt: 4, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Round {round.roundNumber} -{' '}
                {new Date(round.date).toLocaleString()}
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
                      {auth?.user?.isAdmin && (
                        <TableCell align="center">Actions</TableCell>
                      )}
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
                        {auth?.user?.isAdmin && (
                          <TableCell align="center">
                            <Tooltip title="Edit Match Status">
                              <IconButton
                                onClick={() => {
                                  setSelectedMatch(match);
                                  setVoidDialogOpen(true);
                                }}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ position: { md: 'sticky' }, top: 24 }}>
            <Leaderboard fsid={fsid} />
            {auth && <UserScores fsid={fsid} />}
          </Box>
        </Grid>
      </Grid>

      {selectedMatch && (
        <VoidMatchDialog
          open={voidDialogOpen}
          onClose={() => {
            setVoidDialogOpen(false);
            setSelectedMatch(null);
          }}
          match={selectedMatch}
          onSubmit={handleVoidStatusUpdate}
          initialIsVoided={selectedMatch.isVoided}
          initialVoidReason={selectedMatch.voidReason}
        />
      )}
    </Container>
  );
};

export default LeagueView;
