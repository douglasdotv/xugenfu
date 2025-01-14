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
  Tooltip,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import leagueService from '../services/leagueService';
import VoidMatchDialog from '../components/VoidMatchDialog';
import Leaderboard from '../components/Leaderboard';
import UserScores from '../components/UserScores';

const StatusCell = ({ match, isAdmin, onEditClick }) => {
  const handleClick = (e) => {
    if (isAdmin) {
      e.stopPropagation();
      onEditClick();
    }
  };

  const icon = match.isVoided ? (
    <Cancel color="error" sx={{ cursor: isAdmin ? 'pointer' : 'default' }} />
  ) : (
    <CheckCircle
      color="success"
      sx={{ cursor: isAdmin ? 'pointer' : 'default' }}
    />
  );

  return (
    <Tooltip
      title={(() => {
        if (match.isVoided) {
          return `比赛作废 - ${match.voidReason}`;
        }
        if (isAdmin) {
          return '比赛正常（点击编辑）';
        }
        return '比赛状态';
      })()}
    >
      <Box onClick={handleClick} sx={{ display: 'inline-flex' }}>
        {icon}
      </Box>
    </Tooltip>
  );
};

const LeagueView = () => {
  const { fsid } = useParams();
  const { auth } = useContext(AuthContext);
  const [league, setLeague] = useState(null);
  const [latestFsid, setLatestFsid] = useState(null);
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
        setError(err.response?.data?.error || '获取联赛数据失败');
      } finally {
        setLoading(false);
      }

      try {
        const activeLeague = await leagueService.getActiveLeague();
        setLatestFsid(activeLeague.fsid);
      } catch {
        setError('获取最新联赛失败');
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
      setError(err.response?.data?.error || '更新比赛状态失败');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
        <Alert severity="info">未找到联赛数据</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 900,
              background:
                fsid === latestFsid
                  ? 'linear-gradient(135deg,rgb(4, 2, 3) 0%,rgb(17, 27, 17) 50%,rgb(51, 76, 76) 100%)'
                  : 'linear-gradient(135deg,rgb(51, 34, 34) 0%,rgb(35, 48, 48) 50%,rgb(24, 31, 32) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              transform: 'skew(-2deg)',
              letterSpacing: '2px',
            }}
          >
            联赛 {fsid}
            {fsid !== latestFsid ? (
              <Box
                component="span"
                sx={{
                  backgroundColor: 'gray',
                  color: 'white',
                  padding: '0.1px',
                  borderRadius: '12px',
                  fontSize: '0.1rem',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              ></Box>
            ) : (
              <Box
                component="span"
                sx={{
                  backgroundColor: 'lightgray',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                当前联赛
              </Box>
            )}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              to={`/leagues/${fsid}/predictions`}
              variant="contained"
              color="primary"
            >
              预测
            </Button>
            <Button
              component={Link}
              to={`/leagues/${fsid}/history`}
              variant="contained"
              color="secondary"
            >
              历史记录
            </Button>
          </Box>
        </Box>
      </Box>
      <Typography variant="subtitle1" gutterBottom>
        最后更新: {new Date(league.lastUpdated).toLocaleString()}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          alignItems: 'start',
        }}
      >
        <Box>
          {league.rounds.map((round) => (
            <Paper key={round.roundNumber} sx={{ mt: 4, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                第 {round.roundNumber} 轮 -{' '}
                {new Date(round.date).toLocaleString()}
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>主队</TableCell>
                      <TableCell align="center">比分</TableCell>
                      <TableCell>客队</TableCell>
                      <TableCell align="center">状态</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {round.matches.map((match) => (
                      <TableRow
                        key={match.matchId}
                        hover
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <a
                            href={`https://www.managerzone.com/?p=match&sub=result&mid=${match.matchId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                          >
                            {match.homeTeam}
                          </a>
                        </TableCell>
                        <TableCell align="center">
                          <a
                            href={`https://www.managerzone.com/?p=match&sub=result&mid=${match.matchId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                          >
                            {match.result || '未开始'}
                          </a>
                        </TableCell>
                        <TableCell>
                          <a
                            href={`https://www.managerzone.com/?p=match&sub=result&mid=${match.matchId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                          >
                            {match.awayTeam}
                          </a>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{ display: 'flex', justifyContent: 'center' }}
                          >
                            <StatusCell
                              match={match}
                              isAdmin={auth?.user?.isAdmin}
                              onEditClick={() => {
                                setSelectedMatch(match);
                                setVoidDialogOpen(true);
                              }}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ))}
        </Box>
        <Box sx={{ position: { md: 'sticky' }, top: 24 }}>
          <Leaderboard fsid={fsid} />
          {auth && <UserScores fsid={fsid} />}
        </Box>
      </Box>
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
