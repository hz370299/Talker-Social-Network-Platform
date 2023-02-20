import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';

export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

// const LiveBadge = styled(Badge)(({ theme }) => ({
//   '& .MuiBadge-badge': {
//     backgroundColor: theme.palette.error.main,
//     boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
//     '&::after': {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       width: '100%',
//       height: '100%',
//       borderRadius: '50%',
//       animation: 'ripple 1.2s infinite ease-in-out',
//       border: '1px solid currentColor',
//       content: '""',
//     },
//   },
//   '@keyframes ripple': {
//     '0%': {
//       transform: 'scale(1)',
//       opacity: 1,
//     },
//     '100%': {
//       transform: 'scale(1.4)',
//       opacity: 0,
//     },
//   },
// }));

export default function Friend({
  name,
  avatar,
  lastMessage,
  notifications,
  active,
  id,
  userId,
}) {
  const unread = notifications.reduce((a, c) => {
    if (c.chat === id && c.to === userId && c.read === false) {
      a += 1;
    }
    return a;
  }, 0);
  return (
    <Link
      to={`/chat/${id}`}
      style={{ textDecoration: 'inherit', color: 'inherit' }}
    >
      <Box
        sx={{
          marginBottom: '1.5rem',
          alignItems: 'center',
          display: 'flex',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
            cursor: 'pointer',
          },
          bgcolor: active && 'action.hover',
        }}
      >
        <Box>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={unread}
            color="error"
          >
            <Avatar alt="Travis Howard" src={avatar} />
          </Badge>
        </Box>
        <Box
          sx={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography sx={{ color: 'inherit', marginLeft: '1rem' }}>
            {name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              marginLeft: '1.1rem',
              fontSize: 10,
            }}
          >
            {lastMessage ? (lastMessage.content || (lastMessage.media && '[Media]') || '') : ''}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
}

Friend.propTypes = {
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  lastMessage: PropTypes.shape({
    content: PropTypes.string,
    media: PropTypes.string,
  }),
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      read: PropTypes.bool,
    }),
  ),
  active: PropTypes.bool,
  id: PropTypes.string,
  userId: PropTypes.string,
};

Friend.defaultProps = {
  lastMessage: '',
  notifications: [],
  active: false,
  id: '',
  userId: '',
};
