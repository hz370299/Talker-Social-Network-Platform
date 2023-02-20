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
    name: 'testUser10',
  });

  if (res.length > 0) {
    await UserModel.deleteMany({ name: 'testUser10' });
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
      email: 'testUser10@gmail.com',
      name: 'testUser10',
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
        expect(resJson.email).toBe('testUser10@gmail.com');
        expect(resJson.name).toBe('testUser10');
        expect(resJson.password).not.toBeNull();
        expect(resJson.gender).toBe('male');
        expect(resJson.age).toBe(10);
      });
  });

  let jwt;
  const user = {
    email: 'testUser10@gmail.com',
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

  test('read message notifications', (done) => {
    request(app)
      .post('/api/handle/search')
      .set('Authorization', jwt)
      .send('name=testUser10')
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });
});
