import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import ButtonList from '../components/ButtonList';
import Chatbox from '../components/Chatbox';
import Friend from '../components/Friend';
import {
  fetchMoreChatMessages,
  fetchChats,
  fetchCurrentChat,
  sendPrivateMessage,
  addMessage,
  replaceLastMessage,
  readChat,
} from '../redux/chat';
import FriendSkeleton from '../skeletons/FriendSkeleton';
import PostSkeleton from '../skeletons/PostSkeleton';
import { readMessageNotification } from '../redux/users';
import socket from '../service/socket';

export default function PrivateChat() {
  const chat = useSelector((state) => state.chat);
  const { id: chatId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isLoading = chat.isLoading.chat;
  const chats = chat.chats.map((v) => {
    let target = v.users[0];
    for (const e of v.users) {
      if (e.id !== user.id) {
        target = e;
        break;
      }
    }
    return {
      ...v,
      target,
    };
  });

  const onSend = (formData) => {
    dispatch(sendPrivateMessage({ formData, id: chatId }));
  };

  const onGetMoreMessages = () => {
    dispatch(fetchMoreChatMessages(chatId));
  };

  useEffect(() => {
    window.document.documentElement.scrollTop = 0;
  }, []);
  useEffect(() => {
    if (chat.chats.length <= 0) {
      dispatch(fetchChats());
    }
    dispatch(fetchCurrentChat(chatId));
    const onReceiveNewMessage = (message) => {
      dispatch(addMessage(message));
      dispatch(replaceLastMessage(message));
    };
    const onReadChat = (chatId) => {
      dispatch(readChat(chatId));
    };
    socket.on('NEW_PRIVATE_MESSAGE', onReceiveNewMessage);
    socket.on('READ_CHAT', onReadChat);

    return () => {
      socket.off('NEW_PRIVATE_MESSAGE', onReceiveNewMessage);
      socket.off('READ_CHAT', onReadChat);
    };
  }, [chatId]);
  useEffect(() => {
    dispatch(readMessageNotification(chatId));
    socket.emit('READ_PRIVATE_MESSAGE', chatId, user.id);
  }, [chat.chat.messages]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={2}
        sx={{
          paddingLeft: '2rem',
          paddingTop: '2rem',
          minWidth: '400px',
          paddingBottom: '6rem',
        }}
      >
        <Grid item xs={12} md={3} style={{ margingleft: '1.5rem' }}>
          <Box
            sx={{
              position: 'sticky',
              top: '50px',
              maxWidth: '350px',
              marginInline: 'auto',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', paddingBottom: '0.8rem' }}
            >
              Chats
            </Typography>
            <Box
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '2rem',
                padding: '2rem',
                height: '70vh',
              }}
            >
              {chat.isLoading.chats
                ? [...Array(5)].map((v, i) => <FriendSkeleton key={i} />)
                : chats.map((v) => (
                  <Friend
                    key={v.id}
                    id={v.id}
                    name={v.target.name}
                    avatar={v.target.avatar}
                    lastMessage={v.lastMessage}
                    notifications={user.notifications}
                    active={chatId === v.id}
                    userId={user.id}
                  />
                ))}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: '750px', marginInline: 'auto' }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', paddingBottom: '0.8rem' }}
            >
              Chat
            </Typography>
            {isLoading ? (
              <PostSkeleton />
            ) : (
              <Chatbox
                messages={chat.chat.messages}
                avatar={chat.chat.target.avatar}
                id={user.id}
                targetId={chat.chat.target.id}
                name={chat.chat.target.name}
                chatId={chatId}
                isSubmitting={chat.isSubmitting}
                onSend={onSend}
                onScroll={onGetMoreMessages}
                hasMore={chat.hasMore}
              />
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              position: 'sticky',
              top: '50px',
              maxWidth: '350px',
              marginInline: 'auto',
            }}
          >
            <ButtonList current="chat" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
