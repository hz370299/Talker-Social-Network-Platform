const Chat = require('../../models/Chat');
const Message = require('../../models/Message');
const User = require('../../models/User');
const Group = require('../../models/Group');
const Notification = require('../../models/Notification');

const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({});
    return res.json(chats);
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const getMessagesByChatId = async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const chat = await Chat.findById(chatId).populate(
      'users',
      '_id name avatar',
    );
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    let target = chat.users[0];
    for (const e of chat.users) {
      if (e._id.toString() !== req.user._id.toString()) {
        target = e;
        break;
      }
    }
    const messages = await Message.find({
      chat: chatId,
    })
      .populate({
        path: 'sender',
        select: '_id avatar name',
      })
      .sort({
        createdAt: -1,
      })
      .limit(10);

    return res.json({ target, messages });
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const getMoreChatMessages = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id: chatId } = req.params;
    const { page = 0 } = req.query;
    const skip = page * 10;
    console.log(skip);
    const messages = await Message.find({
      chat: chatId,
    })
      .populate({
        path: 'sender',
        select: '_id avatar name',
      })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(10);
    return res.json(messages);
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const isFriendsOrShareGroup = async (req, res, next) => {
  try {
    console.log('ok');
    const { id: targetId } = req.params;
    const { _id: userId } = req.user;
    const user1 = await User.findById(userId);
    const user2 = await User.findById(targetId);
    const user1Group = await Group.find({
      $or: [
        { creator: user1._id },
        { administrators: user1._id },
        { members: user1._id },
      ],
    });
    const user2Group = await Group.find({
      $or: [
        { creator: user2._id },
        { administrators: user2._id },
        { members: user2._id },
      ],
    });
    const user1Groups = new Set();
    let shareGroup = false;
    for (const e of user1Group) {
      user1Groups.add(e.toString());
    }
    for (const e of user2Group) {
      if (user1Groups.has(e.toString())) {
        shareGroup = true;
        break;
      }
    }
    if (
      user1.friends.indexOf(targetId) === -1
      && !shareGroup
      && user1._id.toString() !== user2._id.toString()
    ) {
      return res.json({
        message: 'You are not friends and does not share a group',
      });
    }
    next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const getOrCreateChat = async (req, res) => {
  try {
    const { id: targetId } = req.params;
    const { _id: userId } = req.user;
    const chat = await Chat.find({
      $or: [{ users: [targetId, userId] }, { users: [userId, targetId] }],
    });
    if (chat.length > 0) {
      const cleaned = await Chat.findById(chat[0]._id)
        .populate('lastMessage', 'content media createdAt')
        .populate('users', '_id name avatar');
      return res.json(cleaned);
    }
    const newChat = new Chat({
      users: [targetId, userId],
    });
    await newChat.save();
    const populated = await Chat.findById(newChat._id)
      .populate('lastMessage', 'content media createdAt')
      .populate('users', '_id name avatar');
    return res.json(populated);
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const sendPrivateMessage = async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const { _id: senderId } = req.user;
    // find the receiver
    const chat = await Chat.findById(chatId);
    // check if the sender is in chat
    if (chat.users.indexOf(senderId) === -1) {
      return res.status(400).json({ message: 'You are not in chat' });
    }

    let receiverId;
    for (const e of chat.users) {
      if (e.toString() !== senderId.toString()) {
        receiverId = e;
        break;
      }
    }
    // create a new message
    // check message type
    if (req.file) {
      const message = new Message({
        type: req.file.mimetype,
        chat: chatId,
        sender: senderId,
        receiver: receiverId,
        media: req.body.media,
      });
      await message.save();
      // notify the receiver
      const notification = new Notification({
        from: senderId,
        to: receiverId,
        type: 'message',
        status: 'success',
        chat: chatId,
      });
      await notification.save();
      const cleaned = await Message.findById(message._id).populate({
        path: 'sender',
        select: '_id name avatar',
      });
      return res.json({ message: cleaned, notification });
    }
    // plain text message
    const message = new Message({
      type: 'text',
      chat: chatId,
      sender: senderId,
      receiver: receiverId,
      content: req.body.content,
    });
    await message.save();
    // notify the receiver
    const notification = new Notification({
      from: senderId,
      to: receiverId,
      type: 'message',
      status: 'success',
      chat: chatId,
    });
    await notification.save();
    const cleaned = await Message.findById(message._id).populate({
      path: 'sender',
      select: '_id name avatar',
    });
    return res.json({ message: cleaned, notification });
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const getMyChats = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const chats = await Chat.find({
      users: userId,
    })
      .populate('lastMessage', 'content media createdAt')
      .populate('users', '_id name avatar');
    return res.json(chats);
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const { _id: userId } = req.user;
    const chat = await Chat.findById(chatId);
    if (!chat || chat.users.indexOf(userId) === -1) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    await Chat.findByIdAndDelete(chatId);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(400).json({ message: 'Unauthorized' });
  }
};

module.exports = {
  getAllChats,
  getMessagesByChatId,
  isFriendsOrShareGroup,
  getOrCreateChat,
  sendPrivateMessage,
  getMyChats,
  deleteChat,
  getMoreChatMessages,
};
