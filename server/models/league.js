const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  matchId: { type: String, required: true },
  result: String,
  isVoided: { type: Boolean, default: false },
  voidReason: String,
});

const roundSchema = new mongoose.Schema({
  roundNumber: { type: Number, required: true },
  date: { type: Date, required: true },
  matches: [matchSchema],
});

const leagueSchema = new mongoose.Schema({
  fsid: { type: String, required: true, unique: true },
  lastUpdated: { type: Date, default: Date.now },
  rounds: [roundSchema],
});

module.exports = mongoose.model('League', leagueSchema);
