const express = require('express');
// const path = require('path');
const cors = require('cors');
const passport = require('passport');
// IMPORTING ROUTERS
const userRouter = require('./routes/userRoutes');
const loginRouter = require('./routes/loginRoutes');
const registrationRouter = require('./routes/registrationRoutes');
const profileRouter = require('./routes/profileRoutes');
const groupRouter = require('./routes/groupRoutes');
const postRouter = require('./routes/postRoutes');
const rootRouter = require('./routes/rootRoutes');
const requestRouter = require('./routes/requestRoutes');
const notificationRouter = require('./routes/notificationRoutes');
const handleRouter = require('./routes/handleRoutes');
const chatRouter = require('./routes/chatRoutes');

// SETUP EXPRESS
const app = express();
// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.text());
app.use(express.static(`${__dirname}/client/build`));
app.use(passport.initialize());
require('./config/passport')(passport);

// STATIC SITE
// webapp.use(express.static(path.join(__dirname, '/client/build')));

// USE ROUTERS
app.use('/api/user', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/handle', handleRouter);
app.use('/api/registration', registrationRouter);
app.use('/api/request', requestRouter);
app.use('/api/profile', profileRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/group', groupRouter);
app.use('/api/post', postRouter);
app.use('/api/chat', chatRouter);
app.use('/', rootRouter);
app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/client/build/index.html`);
});
app.use((_req, res) => {
  res.status(404).json({ error: 'no such route' });
});

module.exports = app;
