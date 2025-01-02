const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');
const usersRoutes = require('./routes/users');
const leaguesRoutes = require('./routes/leagues');
const predictionsRoutes = require('./routes/predictions');
const scoresRoutes = require('./routes/scores');
const connectToDatabase = require('./utils/db');

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: '*',
  })
);

connectToDatabase();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
}

app.use('/api/users', usersRoutes);
app.use('/api/leagues', leaguesRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/scoring', scoresRoutes);
app.use('/api', apiRoutes);

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
  });
}

module.exports = app;
