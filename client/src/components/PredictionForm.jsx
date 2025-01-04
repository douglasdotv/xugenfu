import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  Chip,
  Fade,
} from '@mui/material';
import { Check, Timer, Edit } from '@mui/icons-material';
import dayjs from 'dayjs';

const PredictionForm = ({ match, onSubmit, existingPrediction }) => {
  const [homeScore, setHomeScore] = useState(
    existingPrediction ? existingPrediction.split('-')[0] : ''
  );
  const [awayScore, setAwayScore] = useState(
    existingPrediction ? existingPrediction.split('-')[1] : ''
  );
  const [error, setError] = useState('');

  const handleScoreChange = (setValue) => (e) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 99)) {
      setValue(value);
    }
  };

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

  const getBorderColor = (theme) => {
    if (isDeadlinePassed) {
      return theme.palette.error.main;
    }
    if (existingPrediction) {
      return theme.palette.success.main;
    }
    return theme.palette.warning.main;
  };

  const deadlineTime = dayjs(match.deadline).format('MMM D, YYYY h:mm A');
  const isDeadlinePassed = dayjs().isAfter(dayjs(match.deadline));
  const timeToDeadline = dayjs(match.deadline).diff(dayjs(), 'hour');

  return (
    <Card
      sx={{
        mb: 2,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 6,
        },
        borderLeft: (theme) => `6px solid ${getBorderColor(theme)}`,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6">
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', color: 'text.primary' }}
            >
              {match.homeTeam} vs {match.awayTeam}
            </Typography>{' '}
          </Typography>
          <Box>
            {existingPrediction ? (
              <Fade in>
                <Chip
                  icon={<Check />}
                  label={`Prediction: ${existingPrediction}`}
                  color="success"
                  variant="outlined"
                  size="small"
                />
              </Fade>
            ) : null}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Timer sx={{ color: 'text.secondary', fontSize: '1rem' }} />
          <Typography variant="body2" color="text.secondary">
            {isDeadlinePassed ? (
              'Deadline has passed'
            ) : (
              <>
                Deadline: {deadlineTime} ({timeToDeadline} hours remaining)
              </>
            )}
          </Typography>
        </Box>

        {isDeadlinePassed ? (
          <Alert
            severity="error"
            sx={{
              backgroundColor: 'error.lighter',
              color: 'error.dark',
            }}
          >
            Prediction deadline has passed
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                backgroundColor: 'action.hover',
                p: 2,
                borderRadius: 1,
              }}
            >
              <TextField
                label={match.homeTeam}
                value={homeScore}
                onChange={handleScoreChange(setHomeScore)}
                type="number"
                size="small"
                sx={{
                  width: 100,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper',
                  },
                }}
              />

              <Typography variant="h6">-</Typography>

              <TextField
                label={match.awayTeam}
                value={awayScore}
                onChange={handleScoreChange(setAwayScore)}
                type="number"
                size="small"
                sx={{
                  width: 100,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper',
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color={existingPrediction ? 'info' : 'primary'}
                disabled={isDeadlinePassed}
                startIcon={existingPrediction ? <Edit /> : <Check />}
                sx={{
                  minWidth: 120,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
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
