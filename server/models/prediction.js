const mongoose = require('mongoose');

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
    validate: {
      validator: function (v) {
        return /^\d+-\d+$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid score format! Use format: 0-0`,
    },
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

module.exports = Prediction;
