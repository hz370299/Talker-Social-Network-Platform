import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import {
  CircularProgress, Divider,
  IconButton,
  TextField,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Picker from 'emoji-picker-react';
import PropTypes from 'prop-types';
import * as React from 'react';
import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { animateScroll } from 'react-scroll';
import Message from './Message';
import UploadButton from './UploadButton';

export default function Chatbox({
  messages,
  avatar,
  id,
  onSend,
  name,
  targetId,
  isSubmitting,
  onScroll,
  hasMore,
}) {
  const [files, setFiles] = useState([]);
  const inputRef = useRef();
  const postRef = useRef();
  const [showEmoji, setShowEmoji] = useState(false);
  const messageEndRef = useRef();

  const scrollToBottom = () => {
    animateScroll.scrollToBottom({
      containerId: 'messageContainer',
      duration: 100,
    });
  };

  const onCloseMedia = () => {
    inputRef.current.value = null;
    setFiles([]);
  };
  const createMedia = useCallback(() => {
    const curFile = files[0];
    const src = URL.createObjectURL(curFile);
    if (curFile.type === 'video/mp4') {
      return (
        <Box sx={{ position: 'relative' }}>
          <video width="320" height="240" controls>
            <source src={src} type="video/mp4" />
            You browser does not support mp4
          </video>
          <IconButton
            onClick={onCloseMedia}
            color="error"
            sx={{ position: 'absolute', transform: 'translateX(-50%)' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      );
    }
    if (curFile.type === 'audio/mpeg') {
      return (
        <Box sx={{ position: 'relative' }}>
          <audio controls>
            <source src={src} type="audio/mpeg" />
            You browser does not support mp4
          </audio>
          <IconButton
            onClick={onCloseMedia}
            color="error"
            sx={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      );
    }
    if (curFile.type === 'image/jpeg') {
      return (
        <Box sx={{ position: 'relative' }}>
          <img src={src} alt="" width="320" height="240" />
          <IconButton
            onClick={onCloseMedia}
            color="error"
            sx={{
              position: 'absolute',
              transform: 'translateX(-100%)',
              top: '0',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      );
    }
    return null;
  }, [files]);
  useEffect(
    () => () => {
      files.forEach((v) => {
        URL.revokeObjectURL(v);
      });
    },
    [files],
  );
  useEffect(() => {
    window.document.documentElement.scrollTop = 0;
  }, []);

  const uploadHandler = (event) => {
    setFiles(Array.from(event.target.files));
  };
  const onEmojiClick = (event, emojiObject) => {
    postRef.current.value += emojiObject.emoji;
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append(
      'content',
      (postRef && postRef.current && postRef.current.value) || '',
    );
    formData.append('media', inputRef.current.files[0]);
    onSend(formData);
    onCloseMedia();
    if (postRef.current) {
      postRef.current.value = '';
    }
    scrollToBottom();
  };

  const toggleEmojiPicker = () => {
    setShowEmoji((prev) => !prev);
  };
  return (
    <Card
      sx={{
        backgroundColor: 'rgba(255,255,255,0.2)',
        pb: 2,
        borderRadius: 2,
      }}
    >
      <CardHeader
        avatar={(
          <Avatar
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
                cursor: 'pointer',
              },
            }}
            src={avatar}
            aria-label="user"
          />
        )}
        action={(
          <Link to={`/user/profile/${targetId}`}>
            <IconButton aria-label="settings">
              <AccountBoxIcon />
            </IconButton>
          </Link>
        )}
        title={name}
      />
      <Divider />
      <CardContent
        sx={{
          height: '720px',
          overflowY: 'scroll',
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
        id="messageContainer"
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={onScroll}
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
          }} // To put endMessage and loader to the top.
          inverse
          hasMore={hasMore}
          loader={<CircularProgress sx={{ mx: 'auto' }} />}
          scrollableTarget="messageContainer"
          endMessage={(
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          )}
        >
          {messages.map((v) => (
            <Message
              sender={v.sender}
              time={v.createdAt}
              isMe={id === v.sender.id}
              key={v.id}
              type={v.type}
              content={v.content}
              media={v.media}
              status={v.read ? 'read' : 'sent'}
            />
          ))}
          <div ref={messageEndRef} />
        </InfiniteScroll>
      </CardContent>
      {files.length > 0 && <Divider />}
      <CardActions disableSpacing>
        {files.length > 0 ? (
          <Box sx={{ flexGrow: 1 }}>{createMedia()}</Box>
        ) : (
          <TextField
            variant="outlined"
            inputRef={postRef}
            placeholder="Share best moment!"
            multiline
            sx={{
              flexGrow: 1,
              '& .css-9425fu-MuiOutlinedInput-notchedOutline': {
                borderRadius: '0.5rem',
              },
            }}
            disabled={isSubmitting}
          />
        )}

        <Box>
          {isSubmitting ? (
            <CircularProgress />
          ) : (
            <React.Fragment>
              {' '}
              <UploadButton uploadHandler={uploadHandler} ref={inputRef} />
              <IconButton
                aria-label="emoji selector"
                color="inherit"
                onClick={toggleEmojiPicker}
              >
                <EmojiEmotionsIcon />
              </IconButton>
              {showEmoji && <Picker onEmojiClick={onEmojiClick} />}
              <IconButton onClick={handleSubmit}>
                <SendIcon />
              </IconButton>
            </React.Fragment>
          )}
        </Box>
      </CardActions>
      {files.length > 0 && <Divider />}
    </Card>
  );
}

Chatbox.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string,
      media: PropTypes.string,
    }),
  ),
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  id: PropTypes.string,
  onSend: PropTypes.func,
  targetId: PropTypes.string,
  isSubmitting: PropTypes.bool,
  onScroll: PropTypes.func,
  hasMore: PropTypes.bool,
};

Chatbox.defaultProps = {
  messages: [],
  id: '',
  onSend: () => {},
  targetId: '',
  isSubmitting: false,
  onScroll: () => {},
  hasMore: false,
};
