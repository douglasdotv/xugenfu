import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import dayjs from 'dayjs';

const PredictionForm = ({ match, onSubmit, existingPrediction }) => {
  const [homeScore, setHomeScore] = useState(
    existingPrediction ? existingPrediction.split('-')[0] : ''
  );
  const [awayScore, setAwayScore] = useState(
    existingPrediction ? existingPrediction.split('-')[1] : ''
  );
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!homeScore || !awayScore) {
      setError('Please enter both scores');
      return;
    }

    if (isNaN(homeScore) || isNaN(awayScore)) {
      setError('Scores must be numbers');
      return;
    }

    const prediction = `${homeScore}-${awayScore}`;
    onSubmit(prediction);
  };

  const deadlineTime = dayjs(match.deadline).format('MMM D, YYYY h:mm A');
  const isDeadlinePassed = dayjs().isAfter(dayjs(match.deadline));

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {match.homeTeam} vs {match.awayTeam}
        </Typography>

        <Typography color="textSecondary" gutterBottom>
          Deadline: {deadlineTime}
        </Typography>

        {isDeadlinePassed ? (
          <Alert severity="warning">Prediction deadline has passed</Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                label={match.homeTeam}
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                type="number"
                slotProps={{ input: { min: 0 } }}
                size="small"
                sx={{ width: 100 }}
              />

              <Typography variant="h6">-</Typography>

              <TextField
                label={match.awayTeam}
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                type="number"
                slotProps={{ input: { min: 0 } }}
                size="small"
                sx={{ width: 100 }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isDeadlinePassed}
              >
                {existingPrediction ? 'Update' : 'Submit'}
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionForm;
