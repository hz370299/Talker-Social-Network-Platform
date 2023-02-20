import { Divider, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import ButtonList from '../components/ButtonList';
import GroupItemList from '../components/GroupItemList';
import GroupProfile from '../components/GroupProfile';
import {
  createPrivateGroup,
  createPublicGroup,
  fetchCurrentGroup,
  searchUsers,
  updateGroup,
  clearSearchedMembers,
  addMembers,
  leaveGroup,
  removeMember,
  promoteMember,
  demoteAdmin,
} from '../redux/groups';
import FriendSkeleton from '../skeletons/FriendSkeleton';
import PostSkeleton from '../skeletons/PostSkeleton';
import { goOrCreateChat } from '../redux/chat';

export default function CurrentGroup() {
  const { id: groupId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const group = useSelector((state) => state.group);
  const history = useHistory();
  useEffect(() => {
    window.document.documentElement.scrollTop = 0;
    dispatch(fetchCurrentGroup(groupId));
  }, [groupId]);

  const onCreatePublicGroup = (formData) => {
    dispatch(createPublicGroup(formData));
  };

  const onCreatePrivateGroup = (formData) => {
    dispatch(createPrivateGroup(formData));
  };

  const onSearch = (name) => {
    dispatch(searchUsers(name));
  };

  const onSendMessage = (payload) => {
    dispatch(goOrCreateChat(payload));
  };
  const onUpdateGroup = (payload) => {
    dispatch(updateGroup({ ...payload, groupId }));
  };
  const onClearSearch = () => {
    dispatch(clearSearchedMembers());
  };

  const onAddMember = (payload) => {
    dispatch(addMembers({ ...payload, groupId }));
  };

  const onLeaveGroup = () => {
    dispatch(leaveGroup(groupId));
    history.push('/group');
  };

  const onRemoveMember = (user) => {
    dispatch(removeMember({ user, groupId }));
  };

  const onPromoteMember = (target) => {
    dispatch(promoteMember({ target, groupId }));
  };

  const onDemoteAdmin = (target) => {
    dispatch(demoteAdmin({ target, groupId }));
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
              <GroupProfile
                name={group.group.name}
                avatar={group.group.avatar}
                groupId={group.group.id}
                bio={group.group.bio}
                tags={group.group.tags}
                creator={group.group.creator}
                members={group.group.members}
                administrators={group.group.administrators}
                userId={user.id}
                search={group.searchedMembers}
                onSearch={onSearch}
                onSendMessage={onSendMessage}
                onUpdateGroup={onUpdateGroup}
                isSubmitting={group.isSubmitting}
                onClearSearch={onClearSearch}
                onAddMember={onAddMember}
                onLeaveGroup={onLeaveGroup}
                onRemoveMember={onRemoveMember}
                onPromoteMember={onPromoteMember}
                onDemoteAdmin={onDemoteAdmin}
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
