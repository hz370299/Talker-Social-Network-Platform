import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './ui';
import userReducer from './users';
import postReducer from './posts';
import searchReducer from './search';
import chatReducer from './chat';
import userProfileReducer from './userProfile';
import groupReducer from './groups';


export default configureStore({
  reducer: {
    user: userReducer,
    ui: uiReducer,
    post: postReducer,
    chat: chatReducer,
    group: groupReducer,
    search: searchReducer,
    userProfile: userProfileReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {
      extraArgument: {
        url: '',
      },
    },
  }),
});
