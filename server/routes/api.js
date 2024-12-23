const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({ message: 'API is running', status: 'OK' });
});

module.exports = router;
