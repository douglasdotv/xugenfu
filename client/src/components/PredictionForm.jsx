import { useState } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
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
const MATCH_OUTCOMES = {
  HOME_WIN: 'HOME_WIN',
  DRAW: 'DRAW',
  AWAY_WIN: 'AWAY_WIN',
};

const OUTCOME_LABELS = {
  [MATCH_OUTCOMES.HOME_WIN]: '主赢',
  [MATCH_OUTCOMES.DRAW]: '平局',
  [MATCH_OUTCOMES.AWAY_WIN]: '客赢',
};

dayjs.extend(utc);
dayjs.extend(timezone);

const PredictionForm = ({ match, onSubmit, existingPrediction }) => {
  const [prediction, setPrediction] = useState(existingPrediction || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!prediction) {
      setError('请选择比赛结果');
      return;
    }

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
                  label={`已预测: ${OUTCOME_LABELS[existingPrediction]}`}
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
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  value={prediction}
                  onChange={(e) => setPrediction(e.target.value)}
                  displayEmpty
                  size="small"
                  sx={{
                    backgroundColor: 'background.paper',
                  }}
                >
                  <MenuItem value="" disabled>
                    选择比赛结果
                  </MenuItem>
                  <MenuItem value={MATCH_OUTCOMES.HOME_WIN}>
                    {OUTCOME_LABELS[MATCH_OUTCOMES.HOME_WIN]}
                  </MenuItem>
                  <MenuItem value={MATCH_OUTCOMES.DRAW}>
                    {OUTCOME_LABELS[MATCH_OUTCOMES.DRAW]}
                  </MenuItem>
                  <MenuItem value={MATCH_OUTCOMES.AWAY_WIN}>
                    {OUTCOME_LABELS[MATCH_OUTCOMES.AWAY_WIN]}
                  </MenuItem>
                </Select>
              </FormControl>

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
