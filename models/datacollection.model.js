const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const dataCollectionSchema = new Schema({
  collectionName: {
    type: String,
    required: true,
    trim: true,
  },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dataPoints: [{ type: Schema.Types.ObjectId, ref: 'DataPoint' }],
  guessSessions: [{type: Schema.Types.ObjectId, ref: 'GuessSession'}]
}, {
  timestamps: true,
})

const DataCollection = mongoose.model('DataCollection', dataCollectionSchema)

module.exports = DataCollection;