const mongoose = require('mongoose');

const MATCH_OUTCOMES = {
  HOME_WIN: 'HOME_WIN',
  DRAW: 'DRAW',
  AWAY_WIN: 'AWAY_WIN',
};

const predictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  matchId: {
    type: String,
    required: true,
  },
  fsid: {
    type: String,
    required: true,
  },
  prediction: {
    type: String,
    required: true,
    enum: Object.values(MATCH_OUTCOMES),
    message: '{VALUE} is not a valid prediction!',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

predictionSchema.index({ userId: 1, matchId: 1 }, { unique: true });

predictionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Prediction = mongoose.model('Prediction', predictionSchema);

module.exports = {
  Prediction,
  MATCH_OUTCOMES,
};
