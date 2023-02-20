import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isLoading: true,
    error: {
      registration: false,
      login: false,
      common: false,
      post: false,
      comment: false,
      update: false,
    },
    submitting: {
      registration: false,
      login: false,
      post: false,
      comment: {},
      deletePost: false,
      update: false,
    },
    success: {
      registration: false,
      login: false,
    },
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setLoginSubmitting: (state, action) => {
      state.submitting.login = action.payload;
    },
    setRegistrationSubmitting: (state, action) => {
      state.submitting.registration = action.payload;
    },
    setPostSubmitting: (state, action) => {
      state.submitting.post = action.payload;
    },
    setDeletePostSubmitting: (state, action) => {
      state.submitting.deletePost = action.payload;
    },
    setCommentSubmitting: (state, action) => {
      state.submitting.comment = action.payload;
    },
    setLoginError: (state, action) => {
      state.error.login = action.payload;
    },
    setCommentError: (state, action) => {
      state.error.comment = action.payload;
    },
    setLoginSuccess: (state, action) => {
      state.success.login = action.payload;
    },
    setRegistrationSuccess: (state, action) => {
      state.success.registration = action.payload;
    },
    setRegistrationError: (state, action) => {
      state.error.registration = action.payload;
    },
    setCommonError: (state, action) => {
      state.error.common = action.payload;
    },
    setPostError: (state, action) => {
      state.error.post = action.payload;
    },
    setUpdateError: (state, action) => {
      state.error.update = action.payload;
    },
    setUpdateSubmitting: (state, action) => {
      state.submitting.update = action.payload;
    },
  },
});

export default uiSlice.reducer;
export const {
  setIsLoading,
  setLoginError,
  setRegistrationError,
  setLoginSubmitting,
  setRegistrationSubmitting,
  setLoginSuccess,
  setRegistrationSuccess,
  setCommonError,
  setPostError,
  setPostSubmitting,
  setCommentSubmitting,
  setDeletePostSubmitting,
  setUpdateError,
  setUpdateSubmitting,
} = uiSlice.actions;
