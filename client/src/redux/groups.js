import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import socket from '../service/socket';

export const fetchGroups = createAsyncThunk(
  'groups/fetchgroups',
  async (_, { extra, dispatch }) => {
    try {
      dispatch(setIsLoading({ groups: true }));
      const { url } = extra;
      const response = await axios.get(`${url}/api/group/getmygroups`);
      const response1 = await axios.get(
        `${url}/api/group/getrecommendedgroups`,
      );
      const recommendedGroups = response1.data;
      dispatch(setRecommendedGroups(recommendedGroups));
      const groups = response.data;
      dispatch(setIsLoading({ groups: false }));
      return groups;
    } catch (err) {
      console.log(err);
      dispatch(setIsLoading({ groups: false }));
      return err;
    }
  },
);

export const fetchCurrentGroup = createAsyncThunk(
  'groups/fetchcurrentgroup',
  async (groupId, { extra, dispatch }) => {
    try {
      dispatch(setIsLoading({ group: true }));
      const { url } = extra;
      const response = await axios.get(`${url}/api/group/${groupId}`);
      const { data } = response;
      return data;
    } catch (err) {
      console.log(err);
      dispatch(setIsLoading({ group: false }));
      return err;
    }
  },
);

export const createPublicGroup = createAsyncThunk(
  'groups/createpublicgroup',
  async (formData, { extra, dispatch }) => {
    try {
      dispatch(setIsSubmitting(true));
      const { url } = extra;
      const response = await axios.post(`${url}/api/group/public`, formData);
      const group = response.data;
      dispatch(addGroup(group));
      dispatch(setIsSubmitting(false));
      dispatch(setError({ create: false }));
    } catch (err) {
      dispatch(setIsSubmitting(false));
      dispatch(setError({ create: true }));
    }
  },
);

export const createPrivateGroup = createAsyncThunk(
  'groups/createprivategroup',
  async (formData, { extra, dispatch }) => {
    try {
      dispatch(setIsSubmitting(true));
      const { url } = extra;
      const response = await axios.post(`${url}/api/group/private`, formData);
      const group = response.data;
      dispatch(addGroup(group));
      dispatch(setIsSubmitting(false));
      dispatch(setError({ create: false }));
    } catch (err) {
      dispatch(setIsSubmitting(false));
      dispatch(setError({ create: true }));
    }
  },
);

export const searchUsers = createAsyncThunk(
  'groups/searchusers',
  async (name, { extra, dispatch }) => {
    try {
      const { url } = extra;
      const response = await axios.post(`${url}/api/handle/search`, {
        query: name,
      });
      const { users } = response.data;
      dispatch(setSearchedMembers(users));
    } catch (err) {
      console.log(err);
    }
  },
);

export const updateGroup = createAsyncThunk(
  'groups/updategroup',
  async ({ formData, groupId, onClose }, { extra, dispatch }) => {
    try {
      dispatch(setIsSubmitting(true));
      const { url } = extra;
      const response = await axios.post(
        `${url}/api/group/update/${groupId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      const updated = response.data;
      dispatch(updateGroupInfo(updated));
      dispatch(setIsSubmitting(false));
      dispatch(setError({ update: false }));
      onClose();
    } catch (err) {
      dispatch(setIsSubmitting(false));
      dispatch(setError({ update: true }));
    }
  },
);

export const addMembers = createAsyncThunk(
  'groups/addmembers',
  async ({ users, onClose, groupId }, { extra }) => {
    try {
      const { url } = extra;
      await axios.post(`${url}/api/request/groupinvite/${groupId}`, { users });
      onClose();
    } catch (err) {
      console.log(err);
    }
  },
);

export const leaveGroup = createAsyncThunk(
  'groups/leavegroup',
  async (groupId, { extra, dispatch }) => {
    try {
      const { url } = extra;
      await axios.post(`${url}/api/group/leave/${groupId}`);
      dispatch(removeGroup(groupId));
    } catch (err) {
      console.log(err);
    }
  },
);

export const removeMember = createAsyncThunk(
  'groups/removeuser',
  async ({ user, groupId }, { extra, dispatch }) => {
    try {
      const { url } = extra;
      await axios.post(`${url}/api/group/removeuser/${groupId}`, { user });
      dispatch(removeMemberFromGroup({ user, groupId }));
    } catch (err) {
      console.log(err);
    }
  },
);

export const promoteMember = createAsyncThunk(
  'groups/promotemember',
  async ({ target, groupId }, { extra, dispatch }) => {
    try {
      const { url } = extra;
      await axios.post(`${url}/api/request/addadmin/${groupId}`, { target });
      dispatch(addMemberToAdmin({ target, groupId }));
    } catch (err) {
      console.log(err);
    }
  },
);

export const demoteAdmin = createAsyncThunk(
  'groups/demoteadmin',
  async ({ target, groupId }, { extra, dispatch }) => {
    try {
      const { url } = extra;
      await axios.post(`${url}/api/request/canceladmin/${groupId}`, { target });
      dispatch(moveAdminToMembers({ target, groupId }));
    } catch (err) {
      console.log(err);
    }
  },
);

export const sendGroupMessage = createAsyncThunk(
  'groups/sendgroupmessage',
  async ({ formData, groupId, scrollToBottom }, { extra, dispatch }) => {
    try {
      dispatch(setIsSending(true));
      const { url } = extra;
      const response = await axios.post(
        `${url}/api/group/message/${groupId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      const { message, notifications } = response.data;
      dispatch(addOneGroupMessage(message));
      dispatch(setIsSending(false));
      scrollToBottom();
      socket.emit('SEND_GROUP_MESSAGE', message, notifications);
    } catch (err) {
      console.log(err);
      dispatch(setIsSending(false));
    }
  },
);

export const getMoreGroupMessages = createAsyncThunk(
  'groups/getmoregroupmessages',
  async (groupId, { extra, dispatch, getState }) => {
    try {
      const { url } = extra;
      const nextPage = getState().group.page.messages + 1;
      const response = await axios.get(
        `${url}/api/group/getmoremessages/${groupId}?page=${nextPage}`,
      );
      const messages = response.data;
      const curMessages = getState().group.messages.map((v) => v.id);
      const memo = new Set(curMessages);
      const ans = [];
      messages.forEach((v) => {
        if (!memo.has(v.id)) {
          ans.push(v);
        }
      });
      if (messages.length !== 10) {
        dispatch(setHasMore({ messages: false }));
      }
      dispatch(loadMoreGroupMessages(ans));
      dispatch(setPage({ messages: nextPage }));
    } catch (err) {
      console.log(err);
    }
  },
);

export const getMoreGroupPosts = createAsyncThunk(
  'groups/getmoregroupposts',
  async (groupId, { extra, dispatch, getState }) => {
    try {
      const { url } = extra;
      const nextPage = getState().group.page.posts + 1;
      const response = await axios.get(
        `${url}/api/group/getmoreposts/${groupId}?page=${nextPage}`,
      );
      const curPosts = getState().group.posts.map((v) => v.id);
      const memo = new Set(curPosts);
      const posts = response.data;
      const ans = [];
      posts.forEach((v) => {
        if (!memo.has(v.id)) {
          ans.push(v);
        }
      });
      if (posts.length !== 5) {
        dispatch(setHasMore({ posts: false }));
      }
      dispatch(loadMoreGroupPosts(ans));
      dispatch(setPage({ posts: nextPage }));
    } catch (err) {
      console.log(err);
    }
  },
);

export const createGroupPost = createAsyncThunk(
  'groups/creategrouppost',
  async ({ groupId, formData, clearup }, { extra, dispatch }) => {
    try {
      dispatch(setIsPosting(true));
      const { url } = extra;
      const response = await axios.post(
        `${url}/api/group/post/${groupId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      const post = response.data;
      dispatch(addOneGroupPost(post));
      dispatch(setIsPosting(false));
      clearup();
      socket.emit('SEND_GROUP_POST', post);
    } catch (err) {
      console.log(err);
      dispatch(setIsPosting(false));
    }
  },
);

export const likeGroupPost = createAsyncThunk(
  'groups/likegrouppost',
  async (groupPostId, { extra, dispatch, getState }) => {
    try {
      const { url } = extra;
      const userId = getState().user.id;
      await axios.post(`${url}/api/group/post/like/${groupPostId}`);
      dispatch(addOneLikeToGroupPost({ userId, groupPostId }));
    } catch (err) {
      console.log(err);
    }
  },
);

export const unlikeGroupPost = createAsyncThunk(
  'groups/unlikegrouppost',
  async (groupPostId, { extra, dispatch, getState }) => {
    try {
      const { url } = extra;
      const userId = getState().user.id;
      await axios.post(`${url}/api/group/post/unlike/${groupPostId}`);
      dispatch(removeOneLikeFromGroupPost({ userId, groupPostId }));
    } catch (err) {
      console.log(err);
    }
  },
);

export const commentGroupPost = createAsyncThunk(
  'groups/commentgrouppost',
  async ({ groupPostId, content }, { extra, dispatch }) => {
    try {
      dispatch(setIsCommenting({ [groupPostId]: true }));
      const { url } = extra;
      const response = await axios.post(
        `${url}/api/group/post/comment/${groupPostId}`,
        { content },
      );
      const comment = response.data;
      dispatch(addCommentToGroupPost({ groupPostId, comment }));
      dispatch(setIsCommenting({ [groupPostId]: false }));
    } catch (err) {
      console.log(err);
      dispatch(setIsCommenting({ [groupPostId]: false }));
    }
  },
);

export const deleteGroupPost = createAsyncThunk(
  'groups/deleteGroupPost',
  async (groupPostId, { extra, dispatch }) => {
    try {
      dispatch(setIsDeleting(true));
      const { url } = extra;
      await Promise.resolve(
        new Promise((res) => {
          setTimeout(res, 2000);
        }),
      );
      await axios.delete(`${url}/api/group/post/${groupPostId}`);
      dispatch(removeOneGroupPost(groupPostId));
      dispatch(setIsDeleting(false));
    } catch (err) {
      console.log(err);
      dispatch(setIsDeleting(false));
    }
  },
);

export const reportGroupPost = createAsyncThunk(
  'groups/reportgrouppost',
  async (groupPostId, { extra, dispatch, getState }) => {
    try {
      const { url } = extra;
      const { user } = getState();
      await axios.post(`${url}/api/group/post/report/${groupPostId}`);
      dispatch(addOneFlagToGroupPost({ groupPostId, userId: user.id }));
    } catch (err) {
      console.log(err);
    }
  },
);

export const deleteGroupPostComment = createAsyncThunk(
  'groups/deltegrouppostcomment',
  async ({ commentId, groupPostId }, { extra, dispatch }) => {
    try {
      const { url } = extra;
      await axios.delete(`${url}/api/post/comment/${commentId}`);
      dispatch(removeCommentFromGroupPost({ commentId, groupPostId }));
    } catch (err) {
      console.log(err);
    }
  },
);

export const requestToJoinGroup = createAsyncThunk(
  'groups/requesttojoingroup',
  async (groupId, { extra }) => {
    try {
      const { url } = extra;
      await axios.post(`${url}/api/request/joingroup/${groupId}`);
    } catch (err) {
      console.log(err);
    }
  },
);

const groupsSlice = createSlice({
  name: 'groups',
  initialState: {
    groups: [],
    group: {},
    isLoading: {
      groups: true,
      group: true,
    },
    isSubmitting: false,
    groupPage: {
      chat: 0,
      post: 0,
    },
    hasMore: {
      messages: true,
      posts: true,
    },
    error: {
      create: false,
      update: false,
    },
    isSending: false,
    isPosting: false,
    searchedMembers: [],
    posts: [],
    messages: [],
    page: {
      messages: 0,
      posts: 0,
    },
    isDeleting: false,
    isCommenting: {},
    recommendedGroups: [],
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = { ...state.isLoading, ...action.payload };
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    setError: (state, action) => {
      state.error = { ...state.error, ...action.payload };
    },
    setIsSending: (state, action) => {
      state.isSending = action.payload;
    },
    setIsPosting: (state, action) => {
      state.isPosting = action.payload;
    },
    addGroup: (state, action) => {
      state.groups.push(action.payload);
    },
    setIsDeleting: (state, action) => {
      state.isDeleting = action.payload;
    },
    setGroup: (state, action) => {
      state.group = action.payload;
    },
    clearSearchedMembers: (state) => {
      state.searchedMembers = [];
    },
    updateGroupInfo: (state, action) => {
      const { payload } = action;
      if (state.group.id === payload.id) {
        state.group.name = payload.name;
        state.group.avatar = payload.avatar;
        state.group.bio = payload.bio;
        state.group.tags = payload.tags;
      }
      const cur = state.groups.find((v) => v.id === payload.id);
      cur.name = payload.name;
      cur.avatar = payload.avatar;
      cur.bio = payload.bio;
      cur.tags = payload.tags;
    },
    setSearchedMembers: (state, action) => ({
      ...state,
      searchedMembers: action.payload,
    }),
    removeGroup: (state, action) => {
      const { payload: id } = action;
      let idx;
      for (let i = 0; i < state.groups.length; i++) {
        if (state.groups[i].id === id) {
          idx = i;
          break;
        }
      }
      if (idx >= 0) {
        state.groups.splice(idx, 1);
      }
    },
    removeMemberFromGroup: (state, action) => {
      const { user, groupId } = action.payload;
      if (state.group.id === groupId) {
        let idx;
        for (let i = 0; i < state.group.members.length; i++) {
          if (state.group.members[i].id === user) {
            idx = i;
            break;
          }
        }
        if (idx >= 0) {
          state.group.members.splice(idx, 1);
        }
      }
      return state;
    },
    addMemberToAdmin: (state, action) => {
      const { target, groupId } = action.payload;
      if (groupId === state.group.id) {
        let idx;
        let user;
        for (let i = 0; i < state.group.members.length; i++) {
          if (state.group.members[i].id === target) {
            idx = i;
            user = state.group.members[i];
            break;
          }
        }
        if (idx >= 0) {
          state.group.members.splice(idx, 1);
        }
        if (user) {
          state.group.administrators.push(user);
        }
      }
    },
    moveAdminToMembers: (state, action) => {
      const { target, groupId } = action.payload;
      if (groupId === state.group.id) {
        let idx;
        let user;
        for (let i = 0; i < state.group.administrators.length; i++) {
          if (state.group.administrators[i].id === target) {
            idx = i;
            user = state.group.administrators[i];
            break;
          }
        }
        if (idx >= 0) {
          state.group.administrators.splice(idx, 1);
        }
        if (user) {
          state.group.members.push(user);
        }
      }
    },
    setHasMore: (state, action) => {
      state.hasMore = { ...state.hasMore, ...action.payload };
    },
    setPage: (state, action) => {
      state.page = { ...state.page, ...action.payload };
    },
    addOneGroupMessage: (state, action) => {
      state.messages.unshift(action.payload);
    },
    addOneGroupPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    loadMoreGroupMessages: (state, action) => {
      if (action.payload && action.payload.length > 0) {
        state.messages = [...state.messages, ...action.payload];
      }
    },
    loadMoreGroupPosts: (state, action) => {
      if (action.payload && action.payload.length > 0) {
        state.posts = [...state.posts, ...action.payload];
      }
    },
    addOneLikeToGroupPost: (state, action) => {
      const { userId, groupPostId } = action.payload;
      const curPost = state.posts.find((v) => v.id === groupPostId);
      curPost.likes.push(userId);
    },
    removeOneLikeFromGroupPost: (state, action) => {
      const { userId, groupPostId } = action.payload;
      const curPost = state.posts.find((v) => v.id === groupPostId);
      const idx = curPost.likes.indexOf(userId);
      curPost.likes.splice(idx, 1);
    },
    setIsCommenting: (state, action) => {
      state.isCommenting = { ...state.isCommenting, ...action.payload };
    },
    addCommentToGroupPost: (state, action) => {
      const { groupPostId, comment } = action.payload;
      const curPost = state.posts.find((v) => v.id === groupPostId);
      curPost.comments.unshift(comment);
    },
    removeOneGroupPost: (state, action) => {
      const groupPostId = action.payload;
      const idx = state.posts.findIndex((v) => v.id === groupPostId);
      if (idx >= 0) {
        state.posts.splice(idx, 1);
      }
    },
    addOneFlagToGroupPost: (state, action) => {
      const { groupPostId, userId } = action.payload;
      const curPost = state.posts.find((v) => v.id === groupPostId);
      if (curPost) {
        curPost.flag.push(userId);
      }
    },
    removeCommentFromGroupPost: (state, action) => {
      const { commentId, groupPostId } = action.payload;
      const curPost = state.posts.find((v) => v.id === groupPostId);
      if (curPost) {
        const commentIdx = curPost.comments.findIndex(
          (v) => v.id === commentId,
        );
        if (commentIdx >= 0) {
          curPost.comments.splice(commentIdx, 1);
        }
      }
    },
    hideGroupPost: (state, action) => {
      const postId = action.payload;
      const postIdx = state.posts.findIndex((v) => v.id === postId);
      state.posts.splice(postIdx, 1);
    },
    setRecommendedGroups: (state, action) => {
      state.recommendedGroups = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGroups.fulfilled, (state, { payload }) => {
      state.groups = payload;
    });
    builder.addCase(fetchCurrentGroup.fulfilled, (state, { payload }) => {
      state.group = payload.group;
      state.posts = payload.posts;
      state.messages = payload.messages;
      state.isLoading.group = false;
      state.hasMore.messages = payload.messages.length >= 10;
      state.hasMore.posts = payload.posts.length >= 5;
      state.page.messages = 0;
      state.page.posts = 0;
    });
  },
});

export const {
  setIsSubmitting,
  setIsLoading,
  setError,
  addGroup,
  setSearchedMembers,
  setGroup,
  updateGroupInfo,
  clearSearchedMembers,
  removeGroup,
  removeMemberFromGroup,
  addMemberToAdmin,
  moveAdminToMembers,
  setHasMore,
  setIsSending,
  setIsPosting,
  addOneGroupMessage,
  addOneGroupPost,
  setPage,
  loadMoreGroupMessages,
  loadMoreGroupPosts,
  addOneLikeToGroupPost,
  removeOneLikeFromGroupPost,
  setIsCommenting,
  addCommentToGroupPost,
  setIsDeleting,
  removeOneGroupPost,
  addOneFlagToGroupPost,
  removeCommentFromGroupPost,
  hideGroupPost,
  setRecommendedGroups,
} = groupsSlice.actions;
export default groupsSlice.reducer;
