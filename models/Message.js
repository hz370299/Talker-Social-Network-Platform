const mongoose = require('mongoose');

const Message = new mongoose.Schema(
  {
    type: {
      type: String,
      require: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // only contains plain message
    content: {
      type: String,
      default: '',
    },

    // only contains stream
    media: {
      type: String,
      default: '',
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

module.exports = mongoose.model('Message', Message);
