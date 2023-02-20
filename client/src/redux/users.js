import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { io } from 'socket.io-client';
import setAuthToken from '../utils/setAuthToken';
import { addGroup } from './groups';
import { setHasMore, setPosts } from './posts';
import {
  setCommonError,
  setIsLoading,
  setLoginError,
  setLoginSubmitting,
  setLoginSuccess,
  setRegistrationError,
  setRegistrationSubmitting,
  setRegistrationSuccess,
  setUpdateError,
  setUpdateSubmitting,
} from './ui';

export const register = createAsyncThunk(
  'user/register',
  async (payload, { dispatch, extra }) => {
    try {
      const { url } = extra;
      dispatch(setRegistrationSubmitting(true));
      await new Promise((res) => {
        setTimeout(() => {
          res();
        }, 2000);
      });
      await axios.post(`${url}/api/registration`, payload);
      dispatch(setRegistrationSuccess(true));
      dispatch(setRegistrationSubmitting(false));
      dispatch(setRegistrationError(false));
    } catch (err) {
      dispatch(setRegistrationError(true));
      dispatch(setRegistrationSuccess(false));
      dispatch(setRegistrationSubmitting(false));
    }
  },
);

export const login = createAsyncThunk(
  'user/login',
  async (payload, { dispatch, extra }) => {
    try {
      const { url } = extra;
      dispatch(setLoginSubmitting(true));
      const res = await axios.post(`${url}/api/login`, payload);
      localStorage.setItem('jwtToken', res.data.token);
      setAuthToken(res.data.token);
      const userInfo = jwtDecode(res.data.token);
      dispatch(setIsAuthenticated(true));
      dispatch(setUser(userInfo));
      dispatch(setLoginSuccess(true));
      dispatch(setLoginError(false));
      dispatch(setLoginSubmitting(false));
      window.location.href = '/home';
    } catch (err) {
      dispatch(setLoginError(true));
      dispatch(setLoginSuccess(false));
      dispatch(setLoginSubmitting(false));
    }
  },
);

export const deactivateAccount = createAsyncThunk(
  'user/deactivate',
  async (_, { dispatch, extra }) => {
    try {
      const { url } = extra;
      await axios.post(`${url}/api/user/deactivate`);
      dispatch(logout());
    } catch (err) {
      console.log(err);
    }
  },
);

export const changePassword = createAsyncThunk(
  'user/changepassword',
  async ({ prevPassword, newPassword }, { extra }) => {
    try {
      const { url } = extra;
      await axios.post(`${url}/api/user/changepassword`, {
        prevPassword,
        newPassword,
      });
    } catch (err) {
      console.log(err);
    }
  },
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(clearUser());
    window.location.href = '/';
  },
);

export const getinfo = createAsyncThunk(
  'user/getinfo',
  async (_, { dispatch, extra }) => {
    try {
      dispatch(setHasMore(true));
      dispatch(setIsLoading(true));
      const { url } = extra;
      const res = await axios.get(`${url}/api/user/getinfo`);
      const res2 = await axios.get(`${url}/api/post/getnetworkposts`);
      const { posts } = res2.data;
      const user = res.data;
      dispatch(setUser(user));
      dispatch(setPosts(posts));
      dispatch(setCommonError(false));
      dispatch(setIsLoading(false));
      if (posts.length !== 5) {
        dispatch(setHasMore(false));
      }
    } catch (err) {
      dispatch(setCommonError(true));
    }
  },
);

export const sendFriendRequest = createAsyncThunk(
  'user/sendfriendrequest',
  async (to, { extra, dispatch }) => {
    try {
      const { url } = extra;
      await axios.post(`${url}/api/request/friendrequest/${to}`);
      dispatch(setCommonError(false));
    } catch (err) {
      dispatch(setCommonError(true));
    }
  },
);

export const replyFriendRequest = createAsyncThunk(
  'user/replyfriendrequest',
  async (payload, { extra, dispatch }) => {
    try {
      const { url } = extra;
      const { id, message } = payload;
      const response = await axios.post(
        `${url}/api/request/replyfriendrequest/${id}`,
        {
          message,
        },
      );
      const { user } = response.data;
      if (message !== 'yes') {
        dispatch(setFriendRequest({ id, status: 'rejected' }));
      } else {
        dispatch(setFriendRequest({ id, status: 'success' }));
        dispatch(addOneFriend(user));
      }
    } catch (err) {
      console.log('reply failed');
    }
  },
);

export const updateProfile = createAsyncThunk(
  'user/updateprofile',
  async (formdata, { extra, dispatch }) => {
    try {
      dispatch(setUpdateSubmitting(true));
      const { url } = extra;
      const response = await axios.post(`${url}/api/user/update`, formdata);
      console.log(response.data);
      dispatch(setUser(response.data));
      dispatch(setUpdateError(false));
      dispatch(setUpdateSubmitting(false));
    } catch (err) {
      dispatch(setUpdateError(true));
      dispatch(setUpdateSubmitting(false));
    }
  },
);

export const readNonMessageNotifications = createAsyncThunk(
  'user/readnonmessagenotifications',
  async (_, { extra, dispatch }) => {
    try {
      const { url } = extra;
      await axios.post(`${url}/api/notification/readnonmessage`);
      dispatch(readNonMessage());
    } catch (err) {
      console.log(err);
    }
  },
);

export const readMessageNotification = createAsyncThunk(
  'user/readmessage',
  async (chatId, { extra }) => {
    try {
      const { url } = extra;
      await axios.post(`${url}/api/notification/readmessage/${chatId}`);
      return chatId;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
);
export const readGroupMessageNotifications = createAsyncThunk(
  'groups/readgroupmessages',
  async (groupId, { extra, dispatch }) => {
    try {
      const { url } = extra;
      await axios.post(`${url}/api/notification/readgroupmessage/${groupId}`);
      dispatch(readGroupMessage(groupId));
    } catch (err) {
      console.log(err);
    }
  },
);

export const replyGroupInvite = createAsyncThunk(
  'user/replygroupinvite',
  async ({ notificationId, message }, { extra, dispatch }) => {
    try {
      const { url } = extra;
      const response = await axios.post(
        `${url}/api/request/replygroupinvite/${notificationId}`,
        { message },
      );
      const group = response.data;
      if (message !== 'yes') {
        dispatch(setGroupInvite({ id: notificationId, status: 'rejected' }));
      } else {
        dispatch(setGroupInvite({ id: notificationId, status: 'success' }));
        dispatch(addGroup(group));
      }
    } catch (err) {
      console.log(err);
    }
  },
);
export const acceptJoinGroupRequest = createAsyncThunk(
  'groups/acceptjoingrouprequest',
  async (id, { extra, dispatch }) => {
    try {
      const { url } = extra;
      await axios.post(`${url}/api/request/replygrouprequest/${id}`, {
        message: 'yes',
      });
      dispatch(setNotification({ id, status: 'success' }));
    } catch (err) {
      console.log(err);
    }
  },
);

export const rejectJoinGroupRequest = createAsyncThunk(
  'groups/rejectjoingrouprequest',
  async (id, { extra, dispatch }) => {
    try {
      const { url } = extra;
      await axios.post(`${url}/api/request/replygrouprequest/${id}`, {
        message: 'no',
      });
      dispatch(setNotification({ id, status: 'rejected' }));
    } catch (err) {
      console.log(err);
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false,
    id: '',
    email: '',
    name: '',
    status: '',
    gender: '',
    avatar: '',
    age: '',
    bio: '',
    phone: '',
    backgroundImg: '',
    posts: [],
    friends: [],
    notifications: [],
  },
  reducers: {
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action) => {
      for (const key in action.payload) {
        if (state[key] !== undefined) {
          state[key] = action.payload[key];
        }
      }
    },
    clearUser: (state) => {
      for (const key in state) {
        if (key === 'isAuthenticated') {
          state[key] = false;
        } else if (
          key === 'posts'
          || key === 'friends'
          || key === 'notifications'
        ) {
          state[key] = [];
        } else {
          state[key] = '';
        }
      }
    },
    addOneFriend: (state, action) => {
      state.friends.unshift(action.payload);
    },
    addToMyPosts: (state, action) => {
      state.posts = state.posts.unshift(action.payload);
    },
    readNonMessage: (state) => {
      state.notifications.forEach((v) => {
        if (v.type !== 'message' && v.type !== 'groupMessage') {
          v.read = true;
        }
      });
    },
    setFriendRequest: (state, { payload }) => {
      const { id, status } = payload;
      const notification = state.notifications.find((v) => v.id === id);
      if (notification) {
        notification.status = status;
      }
    },
    setGroupInvite: (state, { payload }) => {
      const { id, status } = payload;
      const notification = state.notifications.find((v) => v.id === id);
      if (notification) {
        notification.status = status;
      }
    },
    readGroupMessage: (state, action) => {
      const groupId = action.payload;
      const notifcations = state.notifications;
      for (const e of notifcations) {
        if (e.type === 'groupMessage' && e.group === groupId) {
          e.read = true;
        }
      }
    },
    setNotification: (state, action) => {
      const { id, status } = action.payload;
      const cur = state.notifications.find((v) => v.id === id);
      cur.status = status;
    },
    friendOnline: (state, action) => {
      const cur = state.friends.find((v) => v.id === action.payload);
      if (cur) {
        cur.status = 'online';
      }
    },
    friendOffline: (state, action) => {
      const cur = state.friends.find((v) => v.id === action.payload);
      if (cur) {
        cur.status = 'offline';
      }
    },
    addOneNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(readMessageNotification.fulfilled, (state, action) => {
      for (const e of state.notifications) {
        if (e.chat === action.payload) {
          e.read = true;
        }
      }
    });
  },
});

export default userSlice.reducer;
export const {
  setIsAuthenticated,
  setUser,
  clearUser,
  addToMyPosts,
  setFriendRequest,
  addOneFriend,
  readNonMessage,
  setGroupInvite,
  readGroupMessage,
  setNotification,
  friendOnline,
  friendOffline,
  addOneNotification,
} = userSlice.actions;
