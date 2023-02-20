const dotenv = require('dotenv');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const UserModel = require('../models/User');

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
    name: 'testUser7',
  });

  if (res.length > 0) {
    await UserModel.deleteMany({ name: 'testUser7' });
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

describe('Request test', () => {
  test('Registration', async () => {
    const newUser = {
      email: 'testUser7@gmail.com',
      name: 'testUser7',
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
        expect(resJson.email).toBe('testUser7@gmail.com');
        expect(resJson.name).toBe('testUser7');
        expect(resJson.password).not.toBeNull();
        expect(resJson.gender).toBe('male');
        expect(resJson.age).toBe(10);
      });
  });

  let jwt;
  const user = {
    email: 'testUser7@gmail.com',
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

  test('friend request by id', (done) => {
    UserModel.findOne({ name: 'testUser7' })
      .then((result) => {
        const userId = result._id.toString();
        request(app)
          .post(`/api/request/friendrequest/${userId}`)
          .set('Authorization', jwt)
          .then((res) => {
            // console.log(res.body);
            expect(res.statusCode).toBe(200);
            // chatId = JSON.parse(res.text)._id;
            done();
          });
      });
  });
});
