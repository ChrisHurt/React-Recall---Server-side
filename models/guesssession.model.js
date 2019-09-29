const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const guessSessionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dataCollection: {type: Schema.Types.ObjectId, ref: 'DataCollection', required: true},
  guesses: [{ type: Schema.Types.ObjectId, ref: 'Guess' }]
}, {
  timestamps: true,
})

const GuessSession = mongoose.model('GuessSession', guessSessionSchema)

module.exports = GuessSession;