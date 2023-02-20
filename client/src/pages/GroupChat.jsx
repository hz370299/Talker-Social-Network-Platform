import { Divider, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ButtonList from '../components/ButtonList';
import Groupchatbox from '../components/GroupChatBox';
import GroupItemList from '../components/GroupItemList';
import {
  createPrivateGroup,
  createPublicGroup,
  fetchCurrentGroup,
  getMoreGroupMessages,
  sendGroupMessage,
  addOneGroupMessage,
} from '../redux/groups';
import FriendSkeleton from '../skeletons/FriendSkeleton';
import PostSkeleton from '../skeletons/PostSkeleton';
import { readGroupMessageNotifications } from '../redux/users';
import socket from '../service/socket';

export default function GroupChat() {
  const { id: groupId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const group = useSelector((state) => state.group);
  useEffect(() => {
    window.document.documentElement.scrollTop = 0;
    dispatch(fetchCurrentGroup(groupId));
    const onReceiveGroupMessage = (message) => {
      dispatch(addOneGroupMessage(message));
    };
    socket.on('RECEIVE_GROUP_MESSAGE', onReceiveGroupMessage);
    socket.emit('JOIN_GROUP', groupId);
    return () => {
      socket.off('RECEIVE_GROUP_MESSAGE', onReceiveGroupMessage);
      socket.emit('LEAVE_GROUP', groupId);
    };
  }, [groupId]);

  useEffect(() => {
    dispatch(readGroupMessageNotifications(groupId));
  }, [groupId, group.messages]);

  const onCreatePublicGroup = (formData) => {
    dispatch(createPublicGroup(formData));
  };

  const onCreatePrivateGroup = (formData) => {
    dispatch(createPrivateGroup(formData));
  };

  const onSend = ({ formData, scrollToBottom }) => {
    dispatch(sendGroupMessage({ formData, groupId, scrollToBottom }));
  };

  const onScroll = () => {
    dispatch(getMoreGroupMessages(groupId));
  };

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
              Groups
            </Typography>
            {group.isLoading.groups ? (
              <FriendSkeleton />
            ) : (
              <GroupItemList
                groups={group.groups}
                isSubmitting={group.isSubmitting}
                error={group.error.create}
                onCreatePublicGroup={onCreatePublicGroup}
                onCreatePrivateGroup={onCreatePrivateGroup}
                groupId={groupId}
                notifications={user.notifications}
              />
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: '750px', marginInline: 'auto' }}>
            <Divider sx={{ mt: 6 }} />
            {group.isLoading.group ? (
              <PostSkeleton />
            ) : (
              <Groupchatbox
                name={group.group.name}
                avatar={group.group.avatar}
                id={user.id}
                targetId={groupId}
                isSubmitting={group.isSending}
                hasMore={group.hasMore.messages}
                messages={group.messages}
                onSend={onSend}
                onScroll={onScroll}
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
            <ButtonList current="group" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
