const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    // minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    // minlength: 3
  },
  password_digest: {
    type: String,
    required: true,
    // minlength: 3
  },
  dataCollections: [{ type: Schema.Types.ObjectId, ref: 'DataCollection' }],
  guessSessions: [{ type: Schema.Types.ObjectId, ref: 'GuessSession' }]
}, {
  timestamps: true,
})

const User = mongoose.model('User', userSchema)

module.exports = User;