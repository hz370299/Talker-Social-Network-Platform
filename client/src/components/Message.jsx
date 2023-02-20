import ErrorIcon from '@mui/icons-material/Error';
import {
  Avatar, Box, IconButton, Typography,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

// helper function
// create image Base 64
// const createImageDiv = (message) => {
//   const base64 = btoa(
//     new Uint8Array(message.content.data).reduce(
//       (data, byte) => data + String.fromCharCode(byte),
//       '',
//     ),
//   );
//   const src = `data:image/jpeg;base64,${message.content.data}`;
//   return <img src={src} alt="imga" />;
// };

// // create audio from buffer
// function createAudioDiv(message) {
//   const base64 = btoa(
//     new Uint8Array(message.content.data).reduce(
//       (data, byte) => data + String.fromCharCode(byte),
//       '',
//     ),
//   );
//   const src = `data:audio/mpeg;base64,${base64}`;
//   return (
//     '<audio controls>'
//     + `<source src=${src} type="audio/mpeg">`
//     + 'Your browser does not support the audio element.'
//     + '</audio>'
//   );
// }

// // create video from buffer
// function createVideoDiv(message) {
//   const base64 = btoa(
//     new Uint8Array(message.content.data).reduce(
//       (data, byte) => data + String.fromCharCode(byte),
//       '',
//     ),
//   );
//   const src = `data:video/mp4;base64,${base64}`;
//   return (
//     '<video width="320" height="240" controls>'
//     + `<source src=${src} type="video/mp4">`
//     + 'Your browser does not support the video tag.'
//     + '</video>'
//   );
// }

export default function Message({
  sender,
  content,
  media,
  type,
  isMe,
  status,
  showName,
}) {
  return (
    <React.Fragment>
      {isMe ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            pb: 4,
          }}
        >
          <Box
            sx={{
              paddingRight: '25px',
              position: 'relative',
              maxWidth: '60%',
              '&:after': {
                opacity: type === 'text' ? 1 : 0,
                position: 'absolute',
                content: "' '",
                width: 0,
                height: 0,
                right: '5px',
                top: '50%',
                border: '10px solid',
                borderColor: 'transparent transparent transparent #4caf50',
                transform: 'translateY(-50%)',
              },
            }}
          >
            {type === 'text' && (
              <Typography
                sx={{
                  padding: 2,
                  bgcolor: '#4caf50',
                  borderRadius: 2,
                  overflowWrap: 'break-word',
                }}
              >
                {content}
              </Typography>
            )}
            {(type === 'audio/mpeg' || type === 'audio/mp3') && (
              <Box>
                <audio controls style={{ width: '250px' }}>
                  <source src={media} />
                  Your browser does not support the audio tag.
                </audio>
              </Box>
            )}
            {type === 'video/mp4' && (
              <Box>
                <video width="240" height="240" controls>
                  <source src={media} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Box>
            )}
            {type === 'image/jpeg' && (
              <Box>
                <img
                  src={media}
                  alt="mediamessage"
                  style={{
                    width: '240px',
                    height: '240px',
                  }}
                />
              </Box>
            )}

            {status === 'sent' && (
              <Typography
                sx={{
                  color: 'text.secondary',
                  position: 'absolute',
                  right: '25px',
                }}
                variant="caption"
              >
                Sent
              </Typography>
            )}
            {status === 'pending' && (
              <CircularProgress
                sx={{
                  position: 'absolute',
                  right: '25px',
                  bottom: -25,
                }}
                size={20}
              />
            )}
            {status === 'error' && (
              <ErrorIcon
                sx={{
                  color: 'error.main',
                  position: 'absolute',
                  right: '25px',
                }}
              />
            )}
            {status === 'read' && (
              <Typography
                sx={{
                  color: 'success.main',
                  position: 'absolute',
                  right: '25px',
                }}
                variant="caption"
              >
                Read
              </Typography>
            )}
          </Box>
          <Box>
            <Link to={`/user/profile/${sender.id}`}>
              <IconButton>
                <Avatar src={(sender && sender.avatar) || ''} />
              </IconButton>
            </Link>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', pb: 4 }}>
          <Box>
            <Link to={`/user/profile/${(sender && sender.id) || ''}`}>
              <IconButton>
                <Avatar src={(sender && sender.avatar) || ''} />
              </IconButton>
            </Link>
          </Box>
          <Box
            sx={{
              paddingLeft: '25px',
              position: 'relative',
              maxWidth: '60%',
              '&:after': {
                opacity: type === 'text' ? 1 : 0,
                position: 'absolute',
                content: "' '",
                width: 0,
                height: 0,
                left: '5px',
                top: '50%',
                border: '10px solid',
                borderColor: 'transparent black transparent transparent',
                transform: 'translateY(-50%)',
              },
            }}
          >
            {showName && (
              <Typography variant="subtitle2">
                {sender && sender.name}
              </Typography>
            )}
            {type === 'text' && (
              <Typography
                sx={{
                  padding: 2,
                  bgcolor: 'black',
                  borderRadius: 2,
                  overflowWrap: 'break-word',
                }}
              >
                {content}
              </Typography>
            )}
            {(type === 'audio/mpeg' || type === 'audio/mp3') && (
              <Box>
                <audio controls>
                  <source src={media} />
                  Your browser does not support the audio tag.
                </audio>
              </Box>
            )}
            {type === 'video/mp4' && (
              <video width="320" height="240" controls>
                <source src={media} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {type === 'image/jpeg' && (
              <img src={media} width="320" height="240" alt="mediamessage" />
            )}
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
}

Message.propTypes = {
  sender: PropTypes.shape({
    id: PropTypes.string,
    avatar: PropTypes.string,
    name: PropTypes.string,
  }),
  type: PropTypes.string,
  content: PropTypes.string,
  media: PropTypes.string,
  isMe: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  showName: PropTypes.bool,
};

Message.defaultProps = {
  sender: {},
  type: 'text',
  content: '',
  media: '',
  showName: false,
};
