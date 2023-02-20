import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Button, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { GlassBox } from '../pages/Home';

export default function Notification({
  name,
  avatar,
  type,
  status,
  createdAt,
  id,
  userId,
  onAccpetFriendRequest,
  onRejectFriendRequest,
  onAcceptGroupInvite,
  onRejectGroupInvite,
  onAcceptJoinGroupRequest,
  onRejectJoinGroupRequest,
}) {
  return (
    <GlassBox
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        marginBottom: '0.8rem',
        borderRadius: '10px',
        minHeight: '85px',
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <Link to={`/user/profile/${userId}`}>
          <Button>
            <Avatar alt={name} src={avatar} sx={{ width: 56, height: 56 }} />
          </Button>
        </Link>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              paddingLeft: '1rem',
              fontWeight: 'bold',
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              paddingLeft: '0.3rem',
            }}
          >
            {type === 'like' && 'liked your post'}
            {type === 'post' && 'have a new post'}
            {type === 'friendRequest' && 'requested to be your friend'}
            {type === 'comment' && 'commented your post'}
            {type === 'groupInvite' && 'invite you to join his group'}
            {type === 'administratorPromotion'
              && 'promote you to be administrator'}
            {type === 'cancelAdministrator'
              && 'canceled your administrator status'}
            {type === 'groupPost' && 'had a new group post'}
            {type === 'successFriendRequest'
              && 'has accepted your friend request'}
            {type === 'successJoinGroup' && 'accept your group join request'}
            {type === 'failJoinGroup' && 'reject your group join request'}
            {type === 'joinGroup' && 'request to join your group'}
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              ml: 2,
              mr: 3,
            }}
            variant="subtitle2"
          >
            <Moment fromNow>{createdAt}</Moment>
          </Typography>
        </Box>
      </Box>
      {type === 'friendRequest' && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {status === 'pending' && (
            <React.Fragment>
              {' '}
              <Button
                color="inherit"
                sx={{ bgcolor: 'success.main' }}
                onClick={() => {
                  onAccpetFriendRequest(id);
                }}
              >
                Accept
              </Button>
              <Button
                color="inherit"
                sx={{ bgcolor: 'error.main', ml: 1 }}
                onClick={() => {
                  onRejectFriendRequest(id);
                }}
              >
                Reject
              </Button>
            </React.Fragment>
          )}
          {status === 'success' && <Button disabled>Accepeted</Button>}
          {status === 'rejected' && <Button disabled>Rejected</Button>}
        </Box>
      )}
      {type === 'groupInvite' && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {status === 'pending' && (
            <React.Fragment>
              {' '}
              <Button
                color="inherit"
                sx={{ bgcolor: 'success.main' }}
                onClick={() => {
                  onAcceptGroupInvite(id);
                }}
              >
                Accept
              </Button>
              <Button
                color="inherit"
                sx={{ bgcolor: 'error.main', ml: 1 }}
                onClick={() => {
                  onRejectGroupInvite(id);
                }}
              >
                Reject
              </Button>
            </React.Fragment>
          )}
          {status === 'success' && <Button disabled>Accepeted</Button>}
          {status === 'rejected' && <Button disabled>Rejected</Button>}
        </Box>
      )}
      {type === 'joinGroup' && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {status === 'pending' && (
            <React.Fragment>
              {' '}
              <Button
                color="inherit"
                sx={{ bgcolor: 'success.main' }}
                onClick={() => {
                  onAcceptJoinGroupRequest(id);
                }}
              >
                Accept
              </Button>
              <Button
                color="inherit"
                sx={{ bgcolor: 'error.main', ml: 1 }}
                onClick={() => {
                  onRejectJoinGroupRequest(id);
                }}
              >
                Reject
              </Button>
            </React.Fragment>
          )}
          {status === 'success' && <Button disabled>Accepeted</Button>}
          {status === 'rejected' && <Button disabled>Rejected</Button>}
        </Box>
      )}
    </GlassBox>
  );
}

Notification.propTypes = {
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  type: PropTypes.string,
  status: PropTypes.string,
  createdAt: PropTypes.string,
  id: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  onAccpetFriendRequest: PropTypes.func,
  onRejectFriendRequest: PropTypes.func,
  onAcceptGroupInvite: PropTypes.func,
  onRejectGroupInvite: PropTypes.func,
  onAcceptJoinGroupRequest: PropTypes.func,
  onRejectJoinGroupRequest: PropTypes.func,
};

Notification.defaultProps = {
  avatar: '',
  type: 'message',
  status: 'pending',
  createdAt: Date.now().toString,
  onAccpetFriendRequest: () => {},
  onRejectFriendRequest: () => {},
  onAcceptGroupInvite: () => {},
  onRejectGroupInvite: () => {},
  onAcceptJoinGroupRequest: () => {},
  onRejectJoinGroupRequest: () => {},
};
