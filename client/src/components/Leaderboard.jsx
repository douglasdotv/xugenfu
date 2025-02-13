import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Button,
} from '@mui/material';
import scoringService from '../services/scoringService';

const Leaderboard = ({ fsid }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await scoringService.getLeaderboard(fsid);
        setLeaderboard(data);
      } catch (err) {
        setError(err.response?.data?.error || '获取排行榜失败');
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
        <Typography variant="h5">排行榜</Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>排名</TableCell>
              <TableCell>玩家</TableCell>
              <TableCell align="right">总分</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.slice(0, 5).map((entry) => (
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
                <TableCell>
                  {entry.mzUsername || entry.name || entry.username}
                </TableCell>
                <TableCell align="right">{entry.totalPoints}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          component={Link}
          to={`/leagues/${fsid}/leaderboard`}
          variant="outlined"
          size="small"
        >
          查看完整排行榜
        </Button>
      </Box>
    </Paper>
  );
};

export default Leaderboard;
