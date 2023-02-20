import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  addCommentToPost, addLikeToPost, removeLikeFromPost,
} from './posts';

export const fetchProfile = createAsyncThunk(
  'userProfile/fetchProfile',
  async (userId, { dispatch, extra }) => {
    try {
      dispatch(setCanLoadMore(true));
      dispatch(setPage(0));
      dispatch(setProfileLoading(true));
      const { url } = extra;
      const response = await axios.get(`${url}/api/user/${userId}`);
      const { user, posts } = response.data;
      user.posts = posts;
      dispatch(setProfile(user));
      dispatch(setProfileLoading(false));
      if (posts.length < 5) {
        dispatch(setCanLoadMore(false));
      }
    } catch (err) {
      dispatch(setProfileLoading(false));
      console.log('user profile fetch error');
    }
  },
);

export const fetchMoreProfilePosts = createAsyncThunk(
  'userProfile/fetchMoreProfilePosts',
  async (userId, { dispatch, extra, getState }) => {
    try {
      const { url } = extra;
      const nextPage = getState().userProfile.page + 1;
      const response = await axios.get(
        `${url}/api/post/user/${userId}?page=${nextPage}`,
      );
      const { posts } = response.data;
      if (posts.length !== 5) {
        dispatch(setCanLoadMore(false));
      }
      dispatch(setProfilePostPage(nextPage));
      dispatch(addPostsToProfile(posts));
    } catch (err) {
      console.log('Fetch error');
    }
  },
);
export const commentProfilePost = createAsyncThunk(
  'posts/commentPost',
  async ({ postId, content }, { dispatch, extra }) => {
    try {
      dispatch(setCommenting({ [postId]: true }));
      const { url } = extra;
      const res = await axios.post(`${url}/api/post/comment/${postId}`, {
        content,
      });
      await new Promise((res) => setTimeout(res, 1000));
      const { comment } = res.data;
      dispatch(addCommentToProfilePost({ postId, comment }));
      dispatch(addCommentToPost({ postId, comment }));
      dispatch(setCommenting({}));
    } catch (err) {
      dispatch(setCommenting({}));
      console.log('comment error');
    }
  },
);

export const likeProfilePost = createAsyncThunk(
  'posts/likeprofilepost',
  async (postId, { dispatch, extra, getState }) => {
    try {
      const { url } = extra;
      await axios.post(`${url}/api/post/like/${postId}`);
      const userId = getState().user.id;
      dispatch(addLikeToProfilePost({ postId, userId }));
      dispatch(addLikeToPost({ postId, userId }));
    } catch (err) {
      console.log('error');
    }
  },
);

export const unlikeProfilePost = createAsyncThunk(
  'posts/unlikeprofilepost',
  async (postId, { dispatch, extra, getState }) => {
    try {
      const { url } = extra;
      await axios.post(`${url}/api/post/unlike/${postId}`);
      const userId = getState().user.id;
      dispatch(removeLikeFromProfilePost({ userId, postId }));
      dispatch(removeLikeFromPost({ userId, postId }));
    } catch (err) {
      console.log(err);
    }
  },
);

export const deleteProfilePostComment = createAsyncThunk(
  'posts/deleteprofilepostcomment',
  async ({ commentId, postId }, { extra, dispatch }) => {
    try {
      const { url } = extra;
      await axios.delete(`${url}/api/post/comment/${commentId}`);
      dispatch(removeProfileComment({ commentId, postId }));
    } catch (err) {
      console.log(err);
    }
  },
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    profile: {},
    isLoading: true,
    commenting: {},
    page: 0,
    canLoadMore: true,
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setProfileLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    addPostsToProfile: (state, action) => {
      state.profile.posts = state.profile.posts.concat(action.payload);
    },
    setProfilePostPage: (state, action) => {
      state.page = action.payload;
    },
    setCanLoadMore: (state, action) => {
      state.canLoadMore = action.payload;
    },
    setCommenting: (state, action) => {
      state.commenting = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    addCommentToProfilePost: (state, action) => {
      const post = state.profile.posts.find(
        (e) => e.id === action.payload.postId,
      );
      if (post) {
        post.comments.push(action.payload.comment);
      }
    },
    addLikeToProfilePost: (state, { payload }) => {
      const { postId, userId } = payload;
      const { posts } = state.profile;
      const curPost = posts.find((e) => e.id === postId);
      if (curPost) {
        curPost.likes.unshift(userId);
      }
    },
    removeLikeFromProfilePost: (state, { payload }) => {
      const { postId, userId } = payload;
      const { posts } = state.profile;
      const curPost = posts.find((e) => e.id === postId);
      const likeIdx = curPost.likes.indexOf(userId);
      curPost.likes.splice(likeIdx, 1);
    },
    removeProfileComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const curPost = state.profile.posts.find((v) => v.id === postId);
      if (curPost) {
        const commentIdx = curPost.comments.findIndex(
          (v) => v.id === commentId,
        );
        if (commentIdx >= 0) {
          curPost.comments.splice(commentIdx, 1);
        }
      }
    },
  },
});

export default userProfileSlice.reducer;
export const {
  setProfile,
  setProfileLoading,
  addPostsToProfile,
  setCanLoadMore,
  setProfilePostPage,
  setCommenting,
  addCommentToProfilePost,
  addLikeToProfilePost,
  removeLikeFromProfilePost,
  setPage,
  removeProfileComment,
} = userProfileSlice.actions;
