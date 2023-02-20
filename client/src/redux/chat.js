import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import socket from '../service/socket';

// fetch All chats by user Id
export const fetchChats = createAsyncThunk(
  'chats/fetchAll',
  async (_, { extra, dispatch }) => {
    try {
      dispatch(setChatsIsLoading(true));
      const { url } = extra;
      const response = await axios.get(`${url}/api/chat/getmychats`);
      const chats = response.data;
      return chats;
    } catch (err) {
      return err;
    }
  },
);

export const fetchCurrentChat = createAsyncThunk(
  'chats/fetchcurrentchat',
  async (chatId, { extra, dispatch }) => {
    try {
      dispatch(setChatPage(0));
      dispatch(setChatHasMore(true));
      dispatch(setChatIsLoading(true));
      const { url } = extra;
      const response = await axios.get(`${url}/api/chat/${chatId}`);
      const chat = response.data;
      chat.id = chatId;
      return chat;
    } catch (err) {
      return err;
    }
  },
);

export const sendPrivateMessage = createAsyncThunk(
  'chats/sendprivatemessage',
  async ({ formData, id }, { extra, dispatch }) => {
    try {
      dispatch(setSendingMessage(true));
      const { url } = extra;
      const response = await axios.post(
        `${url}/api/chat/message/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      const { message, notification } = response.data;
      socket.emit('SEND_PRIVATE_MESSAGE', message);
      socket.emit('SEND_NOTIFICATION', notification);
      dispatch(addMessage(message));
      dispatch(replaceLastMessage(message));
      dispatch(setSendingMessage(false));
    } catch (err) {
      dispatch(setSendingMessage(false));
    }
  },
);

export const goOrCreateChat = createAsyncThunk(
  'chats/goorcreatechat',
  async ({ targetId, history }, { extra }) => {
    try {
      const { url } = extra;
      const response = await axios.get(
        `${url}/api/chat/getorcreatechat/${targetId}`,
      );
      const chat = response.data;
      history.push({
        pathname: `/chat/${chat.id}`,
      });
    } catch (err) {
      console.log(err);
    }
  },
);

export const fetchMoreChatMessages = createAsyncThunk(
  'chats/fetchmorechatmessages',
  async (chatId, { extra, dispatch, getState }) => {
    try {
      const { url } = extra;
      const { chat } = getState();
      const nextPage = chat.page + 1;
      const response = await axios.get(
        `${url}/api/chat/getmoremessages/${chatId}?page=${nextPage}`,
      );
      const messages = response.data;
      const curMessages = getState().chat.chat.messages.map((v) => v.id);
      const memo = new Set(curMessages);
      const ans = [];
      messages.forEach((v) => {
        if (!memo.has(v.id)) {
          ans.push(v);
        }
      });
      if (messages.length !== 10) {
        dispatch(setChatHasMore(false));
      }
      dispatch(setChatPage(nextPage));
      dispatch(addMessagesToChat({ chatId, messages: ans }));
    } catch (err) {
      console.log(err);
    }
  },
);

const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    isLoading: {
      chats: true,
      chat: true,
    },
    chats: [],
    chat: {},
    error: {
      chats: '',
      chat: '',
    },
    page: 0,
    hasMore: true,
    isSubmitting: false,
  },
  reducers: {
    addChats: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.chats = action.payload;
      } else {
        state.chats.push(action.payload);
      }
    },
    setChatIsLoading: (state, action) => {
      state.isLoading.chat = action.payload;
    },
    setChatsIsLoading: (state, action) => {
      state.isLoading.chats = action.payload;
    },
    addMessage: (state, action) => {
      if (action.payload.chat === state.chat.id) {
        state.chat.messages.unshift(action.payload);
      }
    },
    setSendingMessage: (state, action) => {
      state.isSubmitting = action.payload;
    },
    addChat: (state, action) => {
      state.chats.unshift(action.payload);
    },
    setChatPage: (state, action) => {
      state.page = action.payload;
    },
    setChatHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    addMessagesToChat: (state, action) => {
      if (state.chat.id === action.payload.chatId) {
        state.chat.messages = state.chat.messages.concat(
          action.payload.messages,
        );
      }
    },
    replaceLastMessage: (state, action) => {
      const message = action.payload;
      const curChat = state.chats.find((v) => v.id === message.chat);
      curChat.lastMessage = message;
    },
    readChat: (state, action) => {
      if (state.chat.id === action.payload) {
        state.chat.messages.forEach((v) => {
          v.read = true;
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChats.fulfilled, (state, action) => {
      state.chats = action.payload;
      state.error.chats = '';
      state.isLoading.chats = false;
    });
    builder.addCase(fetchChats.rejected, (state) => {
      state.error.chats = 'fetch Chats failed';
      state.isLoading.chats = false;
    });
    builder.addCase(fetchCurrentChat.fulfilled, (state, action) => {
      state.chat = action.payload;
      state.error.chat = '';
      state.isLoading.chat = false;
    });
    builder.addCase(fetchCurrentChat.rejected, (state) => {
      state.error.chat = 'Fetch current chat failed';
      state.isLoading.chat = false;
    });
  },
});

export const {
  addChats,
  setChatIsLoading,
  addMessage,
  setSendingMessage,
  setChatsIsLoading,
  setChatPage,
  addMessagesToChat,
  setChatHasMore,
  replaceLastMessage,
  readChat,
} = chatsSlice.actions;
export default chatsSlice.reducer;
