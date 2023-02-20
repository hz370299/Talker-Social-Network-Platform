const dotenv = require('dotenv');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const UserModel = require('../models/User');
const postModel = require('../models/Post');

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
    name: 'testUser6',
  });

  if (res.length > 0) {
    await UserModel.deleteMany({ name: 'testUser6' });
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

describe('getAllPost, getPostById, getPostById', () => {
  test('Registration', async () => {
    const newUser = {
      email: 'testUser6@gmail.com',
      name: 'testUser6',
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
        expect(resJson.email).toBe('testUser6@gmail.com');
        expect(resJson.name).toBe('testUser6');
        expect(resJson.password).not.toBeNull();
        expect(resJson.gender).toBe('male');
        expect(resJson.age).toBe(10);
      });
  });

  let jwt;
  const user = {
    email: 'testUser6@gmail.com',
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

  test('get all post', (done) => {
    request(app)
      .get('/api/post')
      .set('Authorization', jwt)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('get network posts', (done) => {
    request(app)
      .get('/api/post/getnetworkposts')
      .set('Authorization', jwt)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('get post by user id', (done) => {
    UserModel.findOne({ name: 'testUser6' })
      .then((result) => {
        const userId = result._id.toString();
        request(app)
          .get(`/api/post/user/${userId}`)
          .set('Authorization', jwt)
          .then((res) => {
            expect(res.statusCode).toBe(200);
            done();
          });
      });
  });

  let postId;

  test('create post', (done) => {
    request(app)
      .post('/api/post')
      .set('Authorization', jwt)
      .send('content=test')
      .then((res) => {
        expect(res.statusCode).toBe(200);
        postId = JSON.parse(res.text)._id;
        done();
      });
  });

  let commentId;

  test('comment post', (done) => {
    request(app)
      .post(`/api/post/comment/${postId}`)
      .set('Authorization', jwt)
      .send('content=goodtest')
      .then((res) => {
        expect(res.statusCode).toBe(201);
        // console.log(JSON.parse(res.text));
        commentId = JSON.parse(res.text).comment._id;
        // console.log(commentId);
        done();
      });
  });

  test('like post by id', (done) => {
    request(app)
      .post(`/api/post/like/${postId}`)
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('unlike post by id', (done) => {
    request(app)
      .post(`/api/post/unlike/${postId}`)
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('delete post by post id', (done) => {
    request(app)
      .delete(`/api/post/${postId}`)
      .set('Authorization', jwt)
      .then((res) => {
        // console.log(res);
        expect(res.statusCode).toBe(200);
        done();
      });
  });
});
