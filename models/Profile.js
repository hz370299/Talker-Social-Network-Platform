const mongoose = require('mongoose');

const Profile = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },

  nickname: {
    type: String,
    default: '',
  },

  gender: {
    type: String,
    default: 'Undecided',
  },

  bio: {
    type: String,
    default: '',
  },

  avatar: {
    type: Buffer,
    default: null,
  },

  backgroundImg: {
    type: Buffer,
    default: null,
  },

  age: {
    type: Number,
    default: 0,
  },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('Profile', Profile);
