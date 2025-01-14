import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Button,
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import leagueService from '../services/leagueService';
import predictionService from '../services/predictionService';
import PredictionForm from '../components/PredictionForm';

const CurrentRound = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentRound, setCurrentRound] = useState(null);
  const [predictions, setPredictions] = useState({});
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const league = await leagueService.getActiveLeague();

        if (!league) {
          setError('未找到活跃联赛');
          return;
        }

        const now = new Date();
        const nextRound = league.rounds.find((round) => {
          const roundDate = new Date(round.date);
          return roundDate > now;
        });

        if (!nextRound) {
          setError('未找到即将进行的场次');
          return;
        }

        if (auth) {
          const userPredictions = await predictionService.getUserPredictions(
            league.fsid
          );
          const predictionsMap = {};
          userPredictions.forEach((p) => {
            predictionsMap[p.matchId] = p.prediction;
          });
          setPredictions(predictionsMap);
        }

        setCurrentRound({
          ...nextRound,
          fsid: league.fsid,
        });
      } catch (err) {
        setError(err.response?.data?.error || '加载数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth]);

  const handlePredictionSubmit = async (matchId, prediction) => {
    if (!auth) return;

    try {
      await predictionService.submitPrediction(
        matchId,
        prediction,
        currentRound.fsid
      );
      setPredictions((prev) => ({
        ...prev,
        [matchId]: prediction,
      }));
    } catch (err) {
      setError(err.response?.data?.error || '提交预测失败');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          场次信息加载中...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          错误：{error}
        </Alert>
      </Container>
    );
  }

  if (!currentRound) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">未找到即将进行的比赛</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          第 {currentRound.roundNumber} 轮 -{' '}
          {new Date(currentRound.date).toLocaleDateString()}
        </Typography>

        {!auth && (
          <Alert severity="info" sx={{ mb: 2 }}>
            提示：请 <Link to="/login">登录</Link> 后进行预测
          </Alert>
        )}

        <Button
          component={Link}
          to={`/leagues/${currentRound.fsid}`}
          variant="outlined"
          sx={{ mb: 3 }}
        >
          查看完整联赛
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        {currentRound.matches.map((match) => (
          <PredictionForm
            key={match.matchId}
            match={{
              ...match,
              deadline: new Date(currentRound.date).setHours(
                new Date(currentRound.date).getHours() - 2
              ),
            }}
            existingPrediction={predictions[match.matchId]}
            onSubmit={(prediction) =>
              handlePredictionSubmit(match.matchId, prediction)
            }
          />
        ))}
      </Paper>
    </Container>
  );
};

export default CurrentRound;
