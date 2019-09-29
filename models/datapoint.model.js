const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const dataPointSchema = new Schema({
  memoryText: {
    type: String,
    required: true,
    trim: true,
    // minlength: 3
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true,
    // minlength: 3
  },
  dataCollection: { type: Schema.Types.ObjectId, ref: 'DataCollection', required: true },
  guesses: [{ type: Schema.Types.ObjectId, ref: 'Guess' }]
}, {
  timestamps: true,
})

const DataPoint = mongoose.model('DataPoint', dataPointSchema)

module.exports = DataPoint;