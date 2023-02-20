import React from 'react';
import PropTypes from 'prop-types';
import {
  Box, Avatar, Button, IconButton,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import DoneIcon from '@mui/icons-material/Done';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CardMedia from '@mui/material/CardMedia';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import userPropTypes from '../propTypes/user';

export default function Profile({
  user, isFriend, onSendFriendRequest, edible, onEdit, goChat,
}) {
  const capitalizedName = user.name.charAt(0).toUpperCase() + user.name.slice(1);
  const [addFriend, setAddFriend] = React.useState(false);

  const onAddFriend = () => {
    setAddFriend((prev) => !prev);
  };
  return (
    <Card sx={{ backgroundColor: '#000' }}>
      <CardMedia
        component="img"
        height="200"
        image={user.backgroundImg}
        alt="scene"
      />
      <CardContent
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          maxHeight: '90px',
        }}
      >
        <Box
          sx={{ display: 'flex', position: 'relative', paddingLeft: '2rem' }}
        >
          <Avatar
            alt="Remy Sharp"
            src={user.avatar}
            sx={{
              width: 100,
              height: 100,
              position: 'absulute',
              bottom: '3rem',
            }}
          />
          <Box sx={{ paddingLeft: '0.6rem' }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 'bold', fontFamily: 'Righteous' }}
            >
              {user.name}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ color: 'rgba(255,255,255,0.4)' }}
            >
              <span>@</span>
              <span style={{ paddingLeft: '0.3rem' }}>{capitalizedName}</span>
            </Typography>
          </Box>
        </Box>
        {edible ? (
          <Box>
            <Button color="inherit" sx={{ bgcolor: 'info.main' }} onClick={onEdit}>Edit</Button>
            {' '}
          </Box>
        ) : (
          <Box>
            {isFriend && (
            <IconButton color="info" onClick={goChat}>
              {' '}
              <SendIcon />
            </IconButton>
            )}
            {addFriend ? (
              <IconButton color="info">
                <CheckCircleIcon />
              </IconButton>
            ) : isFriend ? (
              <IconButton color="info">
                <CheckCircleIcon />
              </IconButton>
            ) : (
              <IconButton
                color="info"
                onClick={() => {
                  onAddFriend();
                  onSendFriendRequest();
                }}
              >
                <PersonAddIcon />
                {' '}
              </IconButton>
            )}
          </Box>
        )}

      </CardContent>
      <CardContent sx={{ paddingLeft: '3.5rem' }}>
        <Typography
          sx={{ fontSize: '20px', fontWeight: 'bold', alignItems: 'center' }}
        >
          {`About @${capitalizedName}`}
        </Typography>
        <DoneIcon sx={{ bgcolor: 'primary.main', borderRadius: 2 }} />
        <Typography sx={{ color: 'text.secondary' }}>{user.bio}</Typography>
      </CardContent>
    </Card>
  );
}

Profile.propTypes = {
  user: userPropTypes.isRequired,
  isFriend: PropTypes.bool,
  onSendFriendRequest: PropTypes.func,
  edible: PropTypes.bool,
  onEdit: PropTypes.func,
  goChat: PropTypes.func,
};

Profile.defaultProps = {
  isFriend: false,
  onSendFriendRequest: () => {},
  edible: false,
  onEdit: () => {},
  goChat: () => {},
};
