const mongoose = require('mongoose');

const Chat = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

Chat.virtual('lastMessage', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'chat',
  justOne: true,
  options: { sort: { createdAt: -1 } },
});
Chat.virtual('notifications', {
  ref: 'Notification',
  localField: '_id',
  foreignField: 'chat',
});

module.exports = mongoose.model('Chat', Chat);
