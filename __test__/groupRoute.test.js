const dotenv = require('dotenv');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const UserModel = require('../models/User');
const group = require('../models/Group');
const groupPost = require('../models/GroupPost');
const groupMessage = require('../models/GroupMessage');

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
    name: 'testUser3',
  });

  if (res.length > 0) {
    await UserModel.deleteMany({ name: 'testUser3' });
  } else {
    // eslint-disable-next-line no-console
    console.log('No test user!');
  }

  // const res2 = await UserModel.find({
  //   name: 'testUser11',
  // });

  // if (res2.length > 0) {
  //   await UserModel.deleteMany({ name: 'testUser11' });
  // } else {
  //   // eslint-disable-next-line no-console
  //   console.log('No test user!');
  // }
};

beforeAll(async () => {
  await connect();
  await clearDatabase();
});

afterAll(() => {
  clearDatabase();
});

describe('getAllGroups, getMyGroup, getAllGroupPosts, getPostById, getrecommend, getbyid, getMessageByGroupId', () => {
  test('Registration', async () => {
    const newUser = {
      email: 'testUser3@gmail.com',
      name: 'testUser3',
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
        expect(resJson.email).toBe('testUser3@gmail.com');
        expect(resJson.name).toBe('testUser3');
        expect(resJson.password).not.toBeNull();
        expect(resJson.gender).toBe('male');
        expect(resJson.age).toBe(10);
      });
  });

  let jwt;
  const user = {
    email: 'testUser3@gmail.com',
    password: 'testPassword',
  };

  test('login', async () => {
    const res = await request(app)
      .post('/api/login')
      .send(user)
      .set('Content-Type', 'application/json')
      .expect(200);

    jwt = JSON.parse(res.text).token;
    // console.log(jwt);
    expect(jwt).not.toBeNull();
  });

  test('get all groups', (done) => {
    request(app)
      .get('/api/group')
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('get my groups', (done) => {
    request(app)
      .get('/api/group/getmygroups')
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('get all post', (done) => {
    request(app)
      .get('/api/group/post')
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('get recommendation groups by user id', (done) => {
    request(app)
      .get('/api/group/getrecommendedgroups')
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  let publicGroupId;
  test('create public group', (done) => {
    request(app)
      .post('/api/group/public')
      .set('Authorization', jwt)
      .send('name=CIS557&bio=ProgrammingfortheWeb')
      .then((res) => {
        expect(res.statusCode).toBe(200);
        // console.log(res.text);
        publicGroupId = JSON.parse(res.text)._id.toString();
        done();
      });
  });

  test('get more messages by group id', (done) => {
    request(app)
      .get(`/api/group/getmoremessages/${publicGroupId}`)
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('get more posts by group id', (done) => {
    request(app)
      .get(`/api/group/getmoreposts/${publicGroupId}`)
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('get group by group id', (done) => {
    request(app)
      .get(`/api/group/${publicGroupId}`)
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('read group notification by id', (done) => {
    request(app)
      .post(`/api/notification/readgroupmessage/${publicGroupId}`)
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  // // second user
  // test('Registration2', async () => {
  //   const newUser2 = {
  //     email: 'testUser11@gmail.com',
  //     name: 'testUser11',
  //     password: 'testPassword',
  //     gender: 'male',
  //     bio: 'testBio',
  //     age: 10,
  //   };
  //   await request(app)
  //     .post('/api/registration')
  //     .send(newUser2)
  //     .set('Content-Type', 'application/json')
  //     .expect(200)
  //     .then((res) => {
  //       const resJson = JSON.parse(res.text);
  //       expect(resJson.email).toBe('testUser11@gmail.com');
  //       expect(resJson.name).toBe('testUser11');
  //       expect(resJson.password).not.toBeNull();
  //       expect(resJson.gender).toBe('male');
  //       expect(resJson.age).toBe(10);
  //     });
  // });

  // const user2 = {
  //   email: 'testUser11@gmail.com',
  //   password: 'testPassword',
  // };

  // test('login', async () => {
  //   const res = await request(app)
  //     .post('/api/login')
  //     .send(user2)
  //     .set('Content-Type', 'application/json')
  //     .expect(200);
  // });

  test('invite user to the group', (done) => {
    request(app)
      .post(`/api/request/groupinvite/${publicGroupId}`)
      .set('Authorization', jwt)
      .send()
      .then((res) => {
        expect(res.statusCode).toBe(400);
        done();
      });
  });

  test('add admin to the group', (done) => {
    request(app)
      .post(`/api/request/addadmin/${publicGroupId}`)
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(404);
        done();
      });
  });

  test('join group by group id', (done) => {
    request(app)
      .post(`/api/request/joingroup/${publicGroupId}`)
      .set('Authorization', jwt)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('update group by group id', (done) => {
    request(app)
      .post(`/api/group/update/${publicGroupId}`)
      .set('Authorization', jwt)
      .send('name=CIS557&bio=Programming')
      .then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  // no leave group test
  // test('leave group', (done) => {
  //   request(app)
  //     .post(`/api/group/leave/${publicGroupId}`)
  //     .set('Authorization', jwt)
  //     .then((res) => {
  //       console.log(res.body);
  //       expect(res.statusCode).toBe(200);
  //       done();
  //     });
  // });

  let groupPostId;

  test('create group post by group id', (done) => {
    request(app)
      .post(`/api/group/post/${publicGroupId}`)
      .set('Authorization', jwt)
      .send('content=createGroupPostTest')
      .then((res) => {
        expect(res.statusCode).toBe(200);
        // console.log(res.text);
        groupPostId = JSON.parse(res.text)._id.toString();
        done();
      });
  });

  // no comment group post test
  // test('comment group post by group post id', (done) => {
  //   request(app)
  //     .post(`/api/group/post/comment/${groupPostId}`)
  //     .set('Authorization', jwt)
  //     .send('content=groupPostCommentTest')
  //     .then((res) => {
  //       console.log(res.text);
  //       expect(res.statusCode).toBe(200);
  //       done();
  //     });
  // });

  test('like post', (done) => {
    request(app)
      .post(`/api/group/post/like/${groupPostId}`)
      .set('Authorization', jwt)
      // .send('content=createGroupPostTest')
      .then((res) => {
        expect(res.statusCode).toBe(200);
        // console.log(res.text);
        done();
      });
  });

  test('unlike post', (done) => {
    request(app)
      .post(`/api/group/post/unlike/${groupPostId}`)
      .set('Authorization', jwt)
      // .send('content=createGroupPostTest')
      .then((res) => {
        expect(res.statusCode).toBe(200);
        // console.log(res.text);
        done();
      });
  });

  test('flag post', (done) => {
    request(app)
      .post(`/api/group/post/flag/${groupPostId}`)
      .set('Authorization', jwt)
      // .send('content=createGroupPostTest')
      .then((res) => {
        expect(res.statusCode).toBe(200);
        // console.log(res.text);
        done();
      });
  });

  test('send message to group', (done) => {
    request(app)
      .post(`/api/group/message/${publicGroupId}`)
      .set('Authorization', jwt)
      .send('')
      .then((res) => {
        expect(res.statusCode).toBe(200);
        // console.log(res.text);
        done();
      });
  });

  // no remove user test
  // test('remove user from group', (done) => {
  //   UserModel.findOne({ name: 'testUser3' })
  //     .then((result) => {
  //       const userId = result._id.toString();
  //       request(app)
  //         .post(`/api/group/removeuser/${publicGroupId}`)
  //         .set('Authorization', jwt)
  //         .send(`targetId=${userId}`)
  //         .then((res) => {
  //           expect(res.statusCode).toBe(200);
  //           done();
  //         });
  //     });
  // });

  let privateGroupId;
  test('create private group', (done) => {
    request(app)
      .post('/api/group/private')
      .set('Authorization', jwt)
      .send('name=group11&bio=thisisgroup11')
      .then((res) => {
        expect(res.statusCode).toBe(200);
        // console.log(res.text);
        privateGroupId = JSON.parse(res.text)._id.toString();
        done();
      });
  });

  test('delete public group by group id', (done) => {
    request(app)
      .delete(`/api/group/${publicGroupId}`)
      .set('Authorization', jwt)
      .then((res) => {
        // console.log(res.body);
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('delete private group by group id', (done) => {
    request(app)
      .delete(`/api/group/${privateGroupId}`)
      .set('Authorization', jwt)
      .then((res) => {
        // console.log(res.body);
        expect(res.statusCode).toBe(200);
        done();
      });
  });
});
