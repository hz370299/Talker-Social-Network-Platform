const dotenv = require('dotenv');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const UserModel = require('../models/User');
const notification = require('../models/Notification');

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
    name: 'testUser4',
  });

  if (res.length > 0) {
    await UserModel.deleteMany({ name: 'testUser4' });
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

describe('getAllNotification, getMyNotification, getNotificationById', () => {
  test('Registration', async () => {
    const newUser = {
      email: 'testUser4@gmail.com',
      name: 'testUser4',
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
        expect(resJson.email).toBe('testUser4@gmail.com');
        expect(resJson.name).toBe('testUser4');
        expect(resJson.password).not.toBeNull();
        expect(resJson.gender).toBe('male');
        expect(resJson.age).toBe(10);
      });
  });

  let jwt;
  const user = {
    email: 'testUser4@gmail.com',
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

  test('get all notifications', (done) => {
    request(app)
      .get('/api/notification')
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  let notificationId;
  test('get my notifications', (done) => {
    request(app)
      .get('/api/notification/getmynotifications')
      .set('Authorization', jwt)
      .then((res) => {
        // console.log(res.body);
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('read all notifications', (done) => {
    request(app)
      .post('/api/notification/readnonmessage')
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  // test('get notifications by id', async () => {
  //   const res = await UserModel.findOne({ name: 'testUser4' });
  //   const userId = res._id;
  //   // console.log(userId);
  //   request(app)
  //     .get('/api/notification')
  //     .query({ id: userId })
  //     .set('Authorization', jwt)
  //     .expect(200);
  // });

  // test('read notifications', async () => {
  //   const res = await UserModel.findOne({ name: 'testUser4' });
  //   const userId = res._id;
  //   // console.log(userId);
  //   request(app)
  //     .post('/api/notification/readnonmessagenotifications')
  //     .query({ id: userId })
  //     .set('Authorization', jwt)
  //     .expect(200);
  // });

  // test('read message notifications', async () => {
  //   const res = await UserModel.findOne({ name: 'testUser4' });
  //   const userId = res._id;
  //   // console.log(userId);
  //   request(app)
  //     .post('/api/notification/read')
  //     .query({ id: userId })
  //     .set('Authorization', jwt)
  //     .expect(200);
  // });
});
