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
        setError(err.response?.data?.error || '数据获取失败');
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
        <Alert severity="info">未找到联赛数据</Alert>
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
          返回联赛
        </Button>
        <Typography variant="h4" gutterBottom>
          比赛历史记录
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
              label={`第 ${round.roundNumber} 轮`}
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
                第 {round.roundNumber} 轮 -{' '}
                {dayjs(round.date).format('YYYY年MM月DD日 HH:mm')}
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>主队</TableCell>
                      <TableCell align="center">比赛结果</TableCell>
                      <TableCell>客队</TableCell>
                      <TableCell align="center">你的预测</TableCell>
                      <TableCell align="center">状态</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {round.matches.map((match) => {
                      const prediction = userPredictions[match.matchId];

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
                                label="无效比赛"
                                size="small"
                                color="error"
                                title={match.voidReason}
                              />
                            ) : (
                              match.result || '未进行'
                            )}
                          </TableCell>
                          <TableCell>{match.awayTeam}</TableCell>
                          <TableCell align="center">
                            {(() => {
                              if (!prediction) return '-';
                              if (prediction === 'HOME_WIN') return '主赢';
                              if (prediction === 'DRAW') return '平局';
                              return '客赢';
                            })()}
                          </TableCell>
                          <TableCell align="center">
                            {(() => {
                              if (match.isVoided) {
                                return (
                                  <Chip
                                    label="无效"
                                    size="small"
                                    color="error"
                                  />
                                );
                              }
                              if (!prediction || !match.result) {
                                return (
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                  >
                                    -
                                  </Typography>
                                );
                              }

                              const [homeScore, awayScore] = match.result
                                .split('-')
                                .map(Number);
                              let actualOutcome;
                              if (homeScore > awayScore)
                                actualOutcome = 'HOME_WIN';
                              else if (homeScore < awayScore)
                                actualOutcome = 'AWAY_WIN';
                              else actualOutcome = 'DRAW';

                              const isCorrect = prediction === actualOutcome;

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
