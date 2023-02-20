import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  setCommentSubmitting,
  setCommonError,
  setPostError,
  setPostSubmitting,
  setDeletePostSubmitting,
} from './ui';

export const fetchMorePosts = createAsyncThunk(
  'posts/fetchMorePosts',
  async (_, { extra, dispatch, getState }) => {
    try {
      const { url } = extra;
      const curPage = getState().post.page;
      const nextPage = curPage + 1;
      await new Promise((res) => {
        setTimeout(res, 1000);
      });
      const response = await axios.get(
        `${url}/api/post/getnetworkposts?page=${nextPage}`,
      );
      const { posts } = response.data;
      const curPosts = getState().post.posts.map((v) => v.id);
      const memo = new Set(curPosts);
      const ans = [];
      posts.forEach((v) => {
        if (!memo.has(v.id)) {
          ans.push(v);
        }
      });
      if (posts.length < 5) {
        dispatch(setHasMore(false));
      }
      dispatch(setPage(nextPage));
      dispatch(concatPost(ans));
    } catch (err) {
      dispatch(setCommonError(true));
    }
  },
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (post, { extra, dispatch }) => {
    try {
      dispatch(setPostSubmitting(true));
      const { url } = extra;
      const response = await axios.post(`${url}/api/post`, post, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const created = response.data;
      dispatch(addPost(created));
      dispatch(setPostError(false));
      dispatch(setPostSubmitting(false));
    } catch (err) {
      dispatch(setPostError(true));
      dispatch(setPostSubmitting(false));
    }
  },
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, { dispatch, extra, getState }) => {
    try {
      const { url } = extra;
      await axios.post(`${url}/api/post/like/${postId}`);
      const userId = getState().user.id;
      dispatch(addLikeToPost({ userId, postId }));
    } catch (err) {
      console.log('error');
    }
  },
);

export const unlikePost = createAsyncThunk(
  'posts/unlikePost',
  async (postId, { dispatch, extra, getState }) => {
    try {
      const { url } = extra;
      await axios.post(`${url}/api/post/unlike/${postId}`);
      const userId = getState().user.id;
      dispatch(removeLikeFromPost({ userId, postId }));
    } catch (err) {
      console.log(err);
    }
  },
);

export const commentPost = createAsyncThunk(
  'posts/commentPost',
  async ({ postId, content }, { dispatch, extra }) => {
    try {
      dispatch(setCommentSubmitting({ [postId]: true }));
      const { url } = extra;
      const res = await axios.post(`${url}/api/post/comment/${postId}`, {
        content,
      });
      await new Promise((res) => setTimeout(res, 1000));
      const { comment } = res.data;
      dispatch(addCommentToPost({ postId, comment }));
      dispatch(setCommentSubmitting({}));
    } catch (err) {
      dispatch(setCommentSubmitting({}));
      console.log('comment error');
    }
  },
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { dispatch, extra }) => {
    try {
      dispatch(setDeletePostSubmitting(true));
      const { url } = extra;
      await axios.delete(`${url}/api/post/${postId}`);
      await new Promise((res) => setTimeout(res, 1500));
      dispatch(removePostFromPosts(postId));
      dispatch(setDeletePostSubmitting(false));
    } catch (err) {
      dispatch(setDeletePostSubmitting(false));
      console.log('deleted failed');
    }
  },
);

export const deletePostComment = createAsyncThunk(
  'posts/deletepostcomment',
  async ({ commentId, postId }, { dispatch, extra }) => {
    try {
      const { url } = extra;
      await axios.delete(`${url}/api/post/comment/${commentId}`);
      dispatch(removePostComment({ commentId, postId }));
    } catch (err) {
      console.log(err);
    }
  },
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    hasMore: true,
    page: 0,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, { payload }) => {
      state.posts.unshift(payload);
    },
    concatPost: (state, action) => {
      state.posts = state.posts.concat(action.payload);
    },
    deleteOne: (state, { payload }) => {
      state.posts.filter((v) => v.id !== payload);
    },
    addLikeToPost: (state, { payload }) => {
      const { postId, userId } = payload;
      const { posts } = state;
      const curPost = posts.find((e) => e.id === postId);
      if (curPost) {
        curPost.likes.unshift(userId);
      }
    },
    removeLikeFromPost: (state, { payload }) => {
      const { postId, userId } = payload;
      const { posts } = state;
      const curPost = posts.find((e) => e.id === postId);
      const likeIdx = curPost.likes.indexOf(userId);
      curPost.likes.splice(likeIdx, 1);
    },
    addCommentToPost: (state, { payload }) => {
      const { postId, comment } = payload;
      const { posts } = state;
      const curPost = posts.find((e) => e.id === postId);
      if (curPost) {
        curPost.comments.push(comment);
      }
    },
    removePostFromPosts: (state, { payload }) => {
      const postId = payload;
      const { posts } = state;
      let postIdx;
      for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === postId) {
          postIdx = i;
          break;
        }
      }
      posts.splice(postIdx, 1);
    },

    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    removePostComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const curPost = state.posts.find((v) => v.id === postId);
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

export default postsSlice.reducer;

export const {
  setError,
  addLikeToPost,
  setPosts,
  addPost,
  setHasMore,
  setPage,
  concatPost,
  removeLikeFromPost,
  addCommentToPost,
  removePostFromPosts,
  removePostComment,
} = postsSlice.actions;
