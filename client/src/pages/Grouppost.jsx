import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ButtonList from '../components/ButtonList';
import GroupItemList from '../components/GroupItemList';
import Grouppostbox from '../components/Grouppostbox';
import {
  commentGroupPost,
  createGroupPost,
  createPrivateGroup,
  createPublicGroup,
  deleteGroupPost,
  deleteGroupPostComment,
  fetchCurrentGroup,
  getMoreGroupPosts,
  likeGroupPost,
  reportGroupPost,
  unlikeGroupPost,
  hideGroupPost,
  addOneGroupPost,
} from '../redux/groups';
import FriendSkeleton from '../skeletons/FriendSkeleton';
import PostSkeleton from '../skeletons/PostSkeleton';
import socket from '../service/socket';

export default function Grouppost() {
  const { id: groupId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const group = useSelector((state) => state.group);
  useEffect(() => {
    window.document.documentElement.scrollTop = 0;
    dispatch(fetchCurrentGroup(groupId));
    const onReceiveGroupPost = (groupPost) => {
      dispatch(addOneGroupPost(groupPost));
    };
    socket.on('RECEIVE_GROUP_POST', onReceiveGroupPost);
    socket.emit('JOIN_GROUP', groupId);
    return () => {
      socket.off('RECEIVE_GROUP_POST', onReceiveGroupPost);
      socket.emit('LEAVE_GROUP', groupId);
    };
  }, [groupId]);

  const onCreatePublicGroup = (formData) => {
    dispatch(createPublicGroup(formData));
  };

  const onCreatePrivateGroup = (formData) => {
    dispatch(createPrivateGroup(formData));
  };

  const onScroll = () => {
    dispatch(getMoreGroupPosts(groupId));
  };

  const onPost = ({ formData, clearup }) => {
    dispatch(createGroupPost({ groupId, formData, clearup }));
  };

  const onLike = (groupPostId) => {
    dispatch(likeGroupPost(groupPostId));
  };

  const onUnlike = (groupPostId) => {
    dispatch(unlikeGroupPost(groupPostId));
  };

  const onComment = ({ content, groupPostId }) => {
    dispatch(commentGroupPost({ content, groupPostId }));
  };

  const onDelete = (groupPostId) => {
    dispatch(deleteGroupPost(groupPostId));
  };

  const onReport = (groupPostId) => {
    dispatch(reportGroupPost(groupPostId));
  };

  const onDeleteComment = ({ groupPostId, commentId }) => {
    dispatch(deleteGroupPostComment({ groupPostId, commentId }));
  };

  const onHide = (groupPostId) => {
    dispatch(hideGroupPost(groupPostId));
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
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', paddingBottom: '0.8rem' }}
            >
              My Group
            </Typography>
            {group.isLoading.group ? (
              <PostSkeleton />
            ) : (
              <Grouppostbox
                name={group.group.name}
                avatar={group.group.avatar}
                id={user.id}
                targetId={groupId}
                isSubmitting={group.isPosting}
                hasMore={group.hasMore.posts}
                posts={group.posts}
                onPost={onPost}
                members={
                  group.group.members.length
                  + group.group.administrators.length
                  + 1
                }
                onScroll={onScroll}
                userAvatar={user.avatar}
                isCommenting={group.isCommenting}
                isDeleting={group.isDeleting}
                isAdmin={
                  group.group.creator.id === user.id
                  || group.group.administrators.findIndex(
                    (v) => v.id === user.id,
                  ) >= 0
                }
                onLike={onLike}
                onUnlike={onUnlike}
                onComment={onComment}
                onDelete={onDelete}
                onReport={onReport}
                onDeleteComment={onDeleteComment}
                onHide={onHide}
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
