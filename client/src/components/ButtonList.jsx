import ChatIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import { Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';

// const streamButton = (
//   <Button
//     color="inherit"
//     startIcon={<StreamIcon />}
//     sx={{
//       backgroundColor:
//     current.trim().toLowerCase() !== 'streaming'
//       ? 'rgba(255,255,255,0.05)'
//       : 'rgba(255,255,255,0.3)',
//       marginBottom: '1.5rem',
//       minWidth: '80%',
//       justifyContent: 'start',
//       paddingLeft: '1.5rem',
//       borderRadius: '1.5rem',
//       '&:hover': {
//         backgroundColor: 'rgba(255,255,255,0.3)',
//       },
//     }}
//     onClick={() => history.push('/stream')}
//   >
//     <Typography color="inherit" variant="h6" sx={{ fontWeight: 'bold' }}>
//       Streaming
//     </Typography>
//   </Button>
// );

export default function ButtonList({ current }) {
  const history = useHistory();
  return (
    <Stack
      space={2}
      justifyContent="center"
      alignItems="center"
      sx={{ marginTop: '3rem' }}
    >
      <Button
        color="inherit"
        sx={{
          backgroundColor:
            current.trim().toLowerCase() !== 'home'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(255,255,255,0.3)',
          marginBottom: '1.5rem',
          minWidth: '80%',
          justifyContent: 'start',
          paddingLeft: '1.5rem',
          borderRadius: '1.5rem',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.3)',
          },
        }}
        startIcon={<HomeIcon />}
        onClick={() => history.push('/home')}
      >
        <Typography
          color="inherit"
          variant="h6"
          sx={{
            fontWeight: 'bold',
          }}
        >
          <span>Home</span>
        </Typography>
      </Button>
      <Button
        color="inherit"
        sx={{
          backgroundColor:
            current.trim().toLowerCase() !== 'notifications'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(255,255,255,0.3)',
          marginBottom: '1.5rem',
          minWidth: '80%',
          justifyContent: 'start',
          paddingLeft: '1.5rem',
          borderRadius: '1.5rem',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.3)',
          },
        }}
        startIcon={<NotificationsIcon />}
        onClick={() => history.push('/notifications')}
      >
        <Typography color="inherit" variant="h6" sx={{ fontWeight: 'bold' }}>
          Notification
        </Typography>
      </Button>
      <Button
        color="inherit"
        startIcon={<PersonOutlineIcon />}
        sx={{
          backgroundColor:
            current.trim().toLowerCase() !== 'profile'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(255,255,255,0.3)',
          marginBottom: '1.5rem',
          minWidth: '80%',
          justifyContent: 'start',
          paddingLeft: '1.5rem',
          borderRadius: '1.5rem',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.3)',
          },
        }}
        onClick={() => history.push('/profile')}
      >
        <Typography color="inherit" variant="h6" sx={{ fontWeight: 'bold' }}>
          Profile
        </Typography>
      </Button>

      <Button
        color="inherit"
        startIcon={<ChatIcon />}
        sx={{
          backgroundColor:
            current.trim().toLowerCase() !== 'chat'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(255,255,255,0.3)',
          marginBottom: '1.5rem',
          minWidth: '80%',
          justifyContent: 'start',
          paddingLeft: '1.5rem',
          borderRadius: '1.5rem',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.3)',
          },
        }}
        onClick={() => history.push('/chat')}
      >
        <Typography color="inherit" variant="h6" sx={{ fontWeight: 'bold' }}>
          Chat
        </Typography>
      </Button>
      <Button
        color="inherit"
        startIcon={<PeopleOutlineIcon />}
        sx={{
          backgroundColor:
            current.trim().toLowerCase() !== 'group'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(255,255,255,0.3)',
          marginBottom: '1.5rem',
          minWidth: '80%',
          justifyContent: 'start',
          paddingLeft: '1.5rem',
          borderRadius: '1.5rem',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.3)',
          },
        }}
        onClick={() => history.push('/group')}
      >
        <Typography color="inherit" variant="h6" sx={{ fontWeight: 'bold' }}>
          Group
        </Typography>
      </Button>
      <Button
        color="inherit"
        startIcon={<SettingsIcon />}
        sx={{
          backgroundColor:
            current.trim().toLowerCase() !== 'setting'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(255,255,255,0.3)',
          marginBottom: '1.5rem',
          minWidth: '80%',
          justifyContent: 'start',
          paddingLeft: '1.5rem',
          borderRadius: '1.5rem',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.3)',
          },
        }}
        onClick={() => history.push('/setting')}
      >
        <Typography color="inherit" variant="h6" sx={{ fontWeight: 'bold' }}>
          Setting
        </Typography>
      </Button>
    </Stack>
  );
}

ButtonList.propTypes = {
  current: PropTypes.string,
};

ButtonList.defaultProps = {
  current: '',
};
