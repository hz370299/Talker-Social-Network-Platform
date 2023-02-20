import { CircularProgress, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import ButtonList from '../components/ButtonList';
import Contact from '../components/Contact';
import Notification from '../components/Notification';
import FriendSkeleton from '../skeletons/FriendSkeleton';
import {
  replyFriendRequest,
  readNonMessageNotifications,
  replyGroupInvite,
  acceptJoinGroupRequest,
  rejectJoinGroupRequest,
} from '../redux/users';

export const GlassBox = styled('div')({
  backgroundColor: 'rgba(255,255,255,0.2)',
  borderRadius: '2rem',
  padding: '2rem',
});

export default function NotificationPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isLoading = useSelector((state) => state.ui.isLoading);
  const onAccpetFriendRequest = (id) => {
    dispatch(replyFriendRequest({ id, message: 'yes' }));
  };

  const onRejectFriendRequest = (id) => {
    dispatch(replyFriendRequest({ id, message: 'no' }));
  };

  const onAcceptGroupInvite = (id) => {
    dispatch(replyGroupInvite({ notificationId: id, message: 'yes' }));
  };

  const onRejectGroupInvite = (id) => {
    dispatch(replyGroupInvite({ notificationId: id, message: 'no' }));
  };

  const onAccepJoinGroupRequest = (id) => {
    console.log(id);
    dispatch(acceptJoinGroupRequest(id));
  };

  const onRejectJoinGroupRequest = (id) => {
    dispatch(rejectJoinGroupRequest(id));
  };

  useEffect(() => {
    window.document.documentElement.scrollTop = 0;
    dispatch(readNonMessageNotifications());
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
              Contact
            </Typography>
            <Box
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '2rem',
                padding: '2rem',
                height: '70vh',
              }}
            >
              {isLoading
                ? [...Array(5)].map((_, i) => <FriendSkeleton key={i} />)
                : user.friends.map((v) => (
                  <Contact
                    name={v.name}
                    id={v.id}
                    avatar={v.avatar}
                    online={v.status === 'online'}
                    key={v.id}
                  >
                    {' '}
                  </Contact>
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
              Notification Center
            </Typography>
            {isLoading ? (
              <CircularProgress />
            ) : (
              user.notifications.map((v) => {
                if (v.type !== 'message' && v.type !== 'groupMessage') {
                  return (
                    <Notification
                      userId={v.from ? v.from.id : ''}
                      id={v.id}
                      name={v.from ? v.from.name : 'undefined'}
                      avatar={v.from ? v.from.avatar : ''}
                      type={v.type}
                      status={v.status}
                      createdAt={v.createdAt}
                      key={v.id}
                      onAccpetFriendRequest={onAccpetFriendRequest}
                      onRejectFriendRequest={onRejectFriendRequest}
                      onAcceptGroupInvite={onAcceptGroupInvite}
                      onRejectGroupInvite={onRejectGroupInvite}
                      onAcceptJoinGroupRequest={onAccepJoinGroupRequest}
                      onRejectJoinGroupRequest={onRejectJoinGroupRequest}
                    />
                  );
                }
                return '';
              })
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
            <ButtonList current="notifications" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
