import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import predictionService from '../services/predictionService';
import PredictionForm from '../components/PredictionForm';

const Predictions = () => {
  const { fsid } = useParams();
  const [availableMatches, setAvailableMatches] = useState([]);
  const [userPredictions, setUserPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matches, predictions] = await Promise.all([
          predictionService.getAvailableMatches(fsid),
          predictionService.getUserPredictions(fsid),
        ]);

        setAvailableMatches(matches);

        const predictionsMap = {};
        predictions.forEach((p) => {
          predictionsMap[p.matchId] = p.prediction;
        });
        setUserPredictions(predictionsMap);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fsid]);

  const handlePredictionSubmit = async (matchId, prediction) => {
    try {
      await predictionService.submitPrediction(matchId, prediction, fsid);

      setUserPredictions((prev) => ({
        ...prev,
        [matchId]: prediction,
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit prediction');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const matchesByRound = availableMatches.reduce((acc, match) => {
    const round = match.roundNumber;
    if (!acc[round]) {
      acc[round] = [];
    }
    acc[round].push(match);
    return acc;
  }, {});

  const rounds = Object.keys(matchesByRound).sort((a, b) => a - b);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Match Predictions
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {rounds.map((round) => (
            <Tab
              key={round}
              label={`Round ${round}`}
              id={`round-tab-${round}`}
            />
          ))}
        </Tabs>
      </Box>

      {rounds.map((round, index) => (
        <Box
          key={round}
          role="tabpanel"
          hidden={activeTab !== index}
          id={`round-tabpanel-${round}`}
        >
          {activeTab === index && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Round {round}
              </Typography>
              {matchesByRound[round].map((match) => (
                <PredictionForm
                  key={match.matchId}
                  match={match}
                  existingPrediction={userPredictions[match.matchId]}
                  onSubmit={(prediction) =>
                    handlePredictionSubmit(match.matchId, prediction)
                  }
                />
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Container>
  );
};

export default Predictions;
