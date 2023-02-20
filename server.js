const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { createServer } = require('http');
const { Server } = require('socket.io');
const passport = require('passport');
const { isAuthenticated } = require('./controllers/auth/authHelper');
const User = require('./models/User');
const Chat = require('./models/Chat');
const app = require('./app');
// server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
// LOAD CONFIG
dotenv.config({ path: `${__dirname}/config.env` });

// CONNECT TO DATABASE
// const db = process.env.DATABASE.replace(
//   '<username>',
//   process.env.DATABASE_USERNAME
// ).replace('<password>', process.env.DATABASE_PASSWORD);
const db = process.env.DATABASE;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // eslint-disable-next-line no-console
    console.log(con.connections);
    // eslint-disable-next-line no-console
    console.log('DB connection successfully established');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err.message);
  });

io.use(wrap(passport.initialize()));
io.use(wrap(isAuthenticated));
io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'));
  }
});
io.on('connection', async (socket) => {
  const user = await User.findById(socket.request.user.id);
  user.status = 'online';
  await user.save();
  socket.join(socket.request.user.id.toString());
  socket.broadcast.emit('FRIEND_ONLINE', socket.request.user.id);
  socket.on('disconnect', async () => {
    user.status = 'offline';
    await user.save();
    socket.broadcast.emit('FRIEND_OFFLINE', socket.request.user.id);
  });

  socket.on('SEND_PRIVATE_MESSAGE', (message) => {
    socket.to(message.receiver).emit('NEW_PRIVATE_MESSAGE', message);
  });

  socket.on('SEND_NOTIFICATION', (notification) => {
    socket.to(notification.to).emit('NEW_NOTIFICATION', notification);
  });

  socket.on('READ_PRIVATE_MESSAGE', async (chatId, readerId) => {
    const chat = await Chat.findById(chatId);
    let target;
    for (const e of chat.users) {
      if (e.toString() !== readerId) {
        target = e.toString();
        break;
      }
    }
    socket.to(target).emit('READ_CHAT', chatId);
  });
  socket.on('JOIN_GROUP', (groupId) => {
    socket.join(groupId);
  });

  socket.on('LEAVE_GROUP', (groupId) => {
    socket.leave(groupId);
  });

  socket.on('SEND_GROUP_MESSAGE', (message, notifications) => {
    socket.to(message.group).emit('RECEIVE_GROUP_MESSAGE', message);
    notifications.forEach((v) => {
      socket.to(v.to).emit('NEW_NOTIFICATION', v);
    });
  });

  socket.on('SEND_GROUP_POST', (post) => {
    socket.to(post.group).emit('RECEIVE_GROUP_POST', post);
  });
});

// START LISTENING FOR REQUEST
const port = process.env.PORT;
httpServer.listen(port || 5000, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port: ${port || 5000}!`);
});
