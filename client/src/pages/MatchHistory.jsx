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
  CircularProgress,
  Alert,
  Button,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { ArrowBack, Check, Clear } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import leagueService from '../services/leagueService';
import predictionService from '../services/predictionService';
import dayjs from 'dayjs';

const MatchHistory = () => {
  const { fsid } = useParams();
  const { auth } = useContext(AuthContext);
  const [league, setLeague] = useState(null);
  const [userPredictions, setUserPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leagueData, predictionsData] = await Promise.all([
          leagueService.getLeague(fsid),
          auth
            ? predictionService.getUserPredictions(fsid)
            : Promise.resolve([]),
        ]);

        const predictionsMap = {};
        predictionsData.forEach((p) => {
          predictionsMap[p.matchId] = p.prediction;
        });

        setLeague(leagueData);
        setUserPredictions(predictionsMap);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fsid, auth]);

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

  if (!league) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">No league data found</Alert>
      </Container>
    );
  }

  const pastRounds = league.rounds.filter(
    (round) => new Date(round.date) < new Date()
  );

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
          Match History
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {pastRounds.map((round, index) => (
            <Tab
              key={round.roundNumber}
              label={`Round ${round.roundNumber}`}
              id={`round-tab-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      {pastRounds.map((round, index) => (
        <Box
          key={round.roundNumber}
          role="tabpanel"
          hidden={activeTab !== index}
          id={`round-tabpanel-${index}`}
        >
          {activeTab === index && (
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Round {round.roundNumber} -{' '}
                {dayjs(round.date).format('MMM D, YYYY h:mm A')}
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Home Team</TableCell>
                      <TableCell align="center">Result</TableCell>
                      <TableCell>Away Team</TableCell>
                      <TableCell align="center">Your Prediction</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {round.matches.map((match) => {
                      const prediction = userPredictions[match.matchId];
                      const isCorrect =
                        prediction &&
                        match.result &&
                        prediction === match.result;

                      return (
                        <TableRow
                          key={match.matchId}
                          sx={{
                            backgroundColor: match.isVoided
                              ? 'action.hover'
                              : 'inherit',
                          }}
                        >
                          <TableCell>{match.homeTeam}</TableCell>
                          <TableCell align="center">
                            {match.isVoided ? (
                              <Chip
                                label="VOID"
                                size="small"
                                color="error"
                                title={match.voidReason}
                              />
                            ) : (
                              match.result || 'Not Played'
                            )}
                          </TableCell>
                          <TableCell>{match.awayTeam}</TableCell>
                          <TableCell align="center">
                            {prediction || '-'}
                          </TableCell>
                          <TableCell align="center">
                            {(() => {
                              if (match.isVoided) {
                                return (
                                  <Chip
                                    label="Voided"
                                    size="small"
                                    color="error"
                                  />
                                );
                              }
                              if (!prediction) {
                                return '-';
                              }
                              return isCorrect ? (
                                <Check color="success" />
                              ) : (
                                <Clear color="error" />
                              );
                            })()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>
      ))}
    </Container>
  );
};

export default MatchHistory;
