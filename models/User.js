/*
    Schema for user model

*/

const mongoose = require('mongoose');

const User = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      // example: 'online'
      default: 'offline',
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    gender: {
      type: String,
      default: 'neutral',
    },
    phone: {
      type: String,
      default: '',
    },

    bio: {
      type: String,
      default: 'This user has nothing to say',
    },

    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/dtubqsxz5/image/upload/v1638668562/CIS557/default_avatar_biwwa1.jpg',
    },

    backgroundImg: {
      type: String,
      default:
        'https://res.cloudinary.com/dtubqsxz5/image/upload/v1638668668/CIS557/default_background_i8vcq9.jpg',
    },

    age: {
      type: Number,
      default: 0,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lockoutUntil: {
      type: Number,
      default: -1,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

User.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'user',
});

User.virtual('notifications', {
  ref: 'Notification',
  localField: '_id',
  foreignField: 'to',
});

module.exports = mongoose.model('User', User);
