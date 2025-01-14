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
        setError(err.response?.data?.error || '分数获取失败');
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
          返回联赛
        </Button>
        <Typography variant="h4" gutterBottom>
          你的详细分数
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
        }}
      >
        <Box>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              概览
            </Typography>
            <Typography variant="h3" color="primary">
              {scores.totalScore}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              总分
            </Typography>
          </Paper>
        </Box>

        <Box>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              每轮详情
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>轮次</TableCell>
                    <TableCell align="right">分数</TableCell>
                    <TableCell>预测</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scores.roundScores
                    .sort((a, b) => b.roundNumber - a.roundNumber)
                    .map((round) => (
                      <TableRow key={round.roundNumber}>
                        <TableCell>第 {round.roundNumber} 轮</TableCell>
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
        </Box>
      </Box>
    </Container>
  );
};

export default DetailedScores;
