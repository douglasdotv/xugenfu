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
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const CHINA_TIMEZONE = 'Asia/Shanghai';

dayjs.extend(utc);
dayjs.extend(timezone);

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
      setError('请输入两队比分');
      return;
    }

    if (isNaN(homeScore) || isNaN(awayScore)) {
      setError('比分必须是数字');
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

  const deadlineTime = dayjs(match.deadline)
    .tz(CHINA_TIMEZONE)
    .format('YYYY年MM月DD日 HH:mm');

  const isDeadlinePassed = dayjs()
    .tz(CHINA_TIMEZONE)
    .isAfter(dayjs(match.deadline).tz(CHINA_TIMEZONE));

  const timeToDeadline = dayjs(match.deadline)
    .tz(CHINA_TIMEZONE)
    .diff(dayjs().tz(CHINA_TIMEZONE), 'hour');

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
            </Typography>
          </Typography>
          <Box>
            {existingPrediction ? (
              <Fade in>
                <Chip
                  icon={<Check />}
                  label={`已预测: ${existingPrediction}`}
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
              '已过截止时间'
            ) : (
              <>
                截止时间: {deadlineTime} (剩余 {timeToDeadline} 小时)
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
            预测截止时间已过
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
                {existingPrediction ? '更新预测' : '提交预测'}
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionForm;
