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
    name: 'testUser2',
  });

  if (res.length > 0) {
    await UserModel.deleteMany({ name: 'testUser2' });
  } else {
    // eslint-disable-next-line no-console
    console.log('No test user!');
  }
};

beforeAll(async () => {
  await connect();
});

afterAll(() => {
  clearDatabase();
});

describe('Registration, login, get all users, get current user, get user by id, and update user', () => {
  test('Registration', async () => {
    const newUser = {
      email: 'testUser1@gmail.com',
      name: 'testUser1',
      password: 'testPassword',
      gender: 'male',
      bio: 'testBio',
      age: 10,
    };
    await request(app)
      .post('/api/registration')
      .send(newUser)
      .set('Content-Type', 'application/json')
      .then((res) => {
        expect(res.statusCode).toBe(200);
        const resJson = JSON.parse(res.text);
        expect(resJson.email).toBe('testUser1@gmail.com');
        expect(resJson.name).toBe('testUser1');
        expect(resJson.password).not.toBeNull();
        expect(resJson.gender).toBe('male');
        expect(resJson.age).toBe(10);
      });
  });

  let jwt;
  const user = {
    email: 'testUser1@gmail.com',
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

  test('get all users', async () => {
    request(app)
      .get('/api/user')
      .set('Authorization', jwt)
      .expect(200)
      .then((res) => {
        expect(JSON.parse(res.text).length).toBeGreaterThan(0);
      });
  });

  test('get current user', () => {
    request(app)
      .get('/api/user/getinfo')
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        const results = JSON.parse(res.text);
        expect(results.email).toBe('testUser1@gmail.com');
        expect(results.password).not.toBeNull();
        expect(results.email).toBe('testUser1@gmail.com');
      });
  });

  test('get user by id', async () => {
    const result = await UserModel.findOne({ name: 'testUser1' });
    const userId = result._id.toString();
    request(app)
      .get(`/api/user/${userId}`)
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        const results = JSON.parse(res.text);
        expect(results.user.name).toBe('testUser1');
        expect(results.user.id).not.toBeNull();
        expect(results.user.id).toBe(userId);
      });
  });

  test('update profile', async () => {
    const res = await UserModel.findOne({ name: 'testUser1' });
    const userId = res._id;
    const newProfile = {
      name: 'testUser2',
      gender: 'female',
      age: 20,
      bio: 'testBio',
    };
    await request(app)
      .post('/api/user/update/')
      .field('name', newProfile.name)
      .field('gender', newProfile.gender)
      .field('age', newProfile.age)
      .field('bio', newProfile.bio)
      .query({ id: userId })
      .set('Authorization', jwt)
      .expect(200);
  });
});
