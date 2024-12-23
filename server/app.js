const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const usersRoutes = require('./routes/users');
const connectToDatabase = require('./utils/db');

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);

connectToDatabase();

app.use('/api/users', usersRoutes);
app.use('/api', apiRoutes);

module.exports = app;
