import SendIcon from '@mui/icons-material/Send';
import { Divider, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import ButtonList from '../components/ButtonList';
import Friend from '../components/Friend';
import { fetchChats, replaceLastMessage } from '../redux/chat';
import FriendSkeleton from '../skeletons/FriendSkeleton';
import socket from '../service/socket';

export const GlassBox = styled('div')({
  backgroundColor: 'rgba(255,255,255,0.2)',
  borderRadius: '2rem',
  padding: '2rem',
});

export default function ChatPage() {
  const chat = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
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
  useEffect(() => {
    window.document.documentElement.scrollTop = 0;
  }, []);
  useEffect(() => {
    dispatch(fetchChats());
    const onReceiveNewMessage = (message) => {
      dispatch(replaceLastMessage(message));
    };
    socket.on('NEW_PRIVATE_MESSAGE', onReceiveNewMessage);
    return () => {
      socket.off('NEW_PRIVATE_MESSAGE', onReceiveNewMessage);
    };
  }, []);
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
                    userId={user.id}
                  />
                ))}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: '750px', marginInline: 'auto' }}>
            <Divider sx={{ mt: 6 }} />
            <Box sx={{ textAlign: 'center', pt: 10 }}>
              <SendIcon
                sx={{
                  width: '80px',
                  height: '80px',
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
                color="info"
              />
              <Typography variant="h5">Your Messages</Typography>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Send private photos and messages to a friend or group.
              </Typography>
            </Box>
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
