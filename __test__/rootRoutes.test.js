const dotenv = require('dotenv');
const request = require('supertest');
const mongoose = require('mongoose');
const webapp = require('../app');

dotenv.config({ path: '../config.env' });

const connect = async () => {
  const db = process.env.DATABASE;

  try {
    const res = await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // eslint-disable-next-line no-console
    // console.log('DB connection successfully established');
    // eslint-disable-next-line no-console
    // console.log(res.connections);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.message);
  }
};

beforeEach(async () => {
  await connect();
});

describe('Root test', () => {
  it('Root test', async () => {
    const res = await request(webapp)
      .get('/')
      .expect(200);
  });
});
