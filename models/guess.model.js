const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const guessSchema = new Schema({
  remembered: {
    type: Number,
    required: true
  },
  guessSession: { type: Schema.Types.ObjectId, ref: 'GuessSession' },
  dataPoint: { type: Schema.Types.ObjectId, ref: 'DataPoint' }
}, {
  timestamps: true,
})

const Guess = mongoose.model('Guess', guessSchema)

module.exports = Guess;