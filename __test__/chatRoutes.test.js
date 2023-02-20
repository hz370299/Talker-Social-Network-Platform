const dotenv = require('dotenv');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const UserModel = require('../models/User');
const chat = require('../models/Chat');

dotenv.config({ path: '../config.env' });

const connect = async () => {
  const db = process.env.DATABASE;

  try {
    const res = await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.message);
  }
};

const clearDatabase = async () => {
  const res = await UserModel.find({
    name: 'testUser5',
  });

  if (res.length > 0) {
    await UserModel.deleteMany({ name: 'testUser5' });
  } else {
    // eslint-disable-next-line no-console
    console.log('No test user!');
  }
};

beforeAll(async () => {
  await connect();
  await clearDatabase();
});

afterAll(() => {
  clearDatabase();
});

describe('getAllChat, getMyChat, getOrCreateChatById, getrecommend, getChatById', () => {
  test('Registration', async () => {
    const newUser = {
      email: 'testUser5@gmail.com',
      name: 'testUser5',
      password: 'testPassword',
      gender: 'male',
      bio: 'testBio',
      age: 10,
    };
    await request(app)
      .post('/api/registration')
      .send(newUser)
      .set('Content-Type', 'application/json')
      .expect(200)
      .then((res) => {
        const resJson = JSON.parse(res.text);
        expect(resJson.email).toBe('testUser5@gmail.com');
        expect(resJson.name).toBe('testUser5');
        expect(resJson.password).not.toBeNull();
        expect(resJson.gender).toBe('male');
        expect(resJson.age).toBe(10);
      });
  });

  let jwt;
  const user = {
    email: 'testUser5@gmail.com',
    password: 'testPassword',
  };

  test('login', async () => {
    const res = await request(app)
      .post('/api/login')
      .send(user)
      .set('Content-Type', 'application/json')
      .expect(200);

    jwt = JSON.parse(res.text).token;
    expect(jwt).not.toBeNull();
  });

  test('get all chat', (done) => {
    request(app)
      .get('/api/chat')
      .set('Authorization', jwt)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('get my chat', (done) => {
    request(app)
      .get('/api/chat/getmychats')
      .set('Authorization', jwt)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  let chatId;

  test('get or create chat by id', (done) => {
    UserModel.findOne({ name: 'testUser5' })
      .then((result) => {
        const userId = result._id.toString();
        request(app)
          .get(`/api/chat/getorcreatechat/${userId}`)
          .set('Authorization', jwt)
          .then((res) => {
            expect(res.statusCode).toBe(200);
            chatId = JSON.parse(res.text)._id;
            done();
          });
      });
  });

  test('get chat by chat id', (done) => {
    request(app)
      .get(`/api/chat/${chatId}`)
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('read message notifications', (done) => {
    request(app)
      .post(`/api/notification/readgroupmessage/${chatId}`)
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('read message notifications by id', (done) => {
    request(app)
      .post(`/api/notification/readmessage/${chatId}`)
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('send private message by id', (done) => {
    // const res = await UserModel.findOne({ name: 'testUser5' });
    // const userId = res._id.toString();
    // console.log(userId);
    request(app)
      .post(`/api/chat/message/${chatId}`)
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('delete private message by chat id', (done) => {
    // const res = await UserModel.findOne({ name: 'testUser5' });
    // const userId = res._id.toString();
    // console.log(userId);
    request(app)
      .delete(`/api/chat/delete/${chatId}`)
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });
});
