import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import {
  Box, Button, CircularProgress, IconButton,
} from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Picker from 'emoji-picker-react';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const InputField = ({ commenting, onComment }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const textRef = React.useRef();
  const toggleEmojiPicker = () => {
    setShowEmoji((prev) => !prev);
  };
  const onEmojiClick = (event, emojiObject) => {
    textRef.current.value += emojiObject.emoji;
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%',
          position: 'relative',
        }}
      >
        <IconButton
          aria-label="emoji selector"
          color="inherit"
          onClick={toggleEmojiPicker}
        >
          <EmojiEmotionsIcon />
        </IconButton>

        <TextareaAutosize
          aria-label="height"
          ref={textRef}
          minRows={1}
          placeholder="Add a comment..."
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            backgroundColor: 'inherit',
            color: 'inherit',
            fontFamily: 'inherit',
          }}
        />
        {commenting ? (
          <CircularProgress color="info" />
        ) : (
          <Button
            variant="whiteButton"
            startIcon={<SendIcon />}
            onClick={() => {
              onComment(textRef.current.value);
              textRef.current.value = '';
            }}
          >
            Post
          </Button>
        )}

        <Box
          sx={{
            left: 0,
            position: 'absolute',
            top: '3rem',
          }}
        >
          {showEmoji && <Picker onEmojiClick={onEmojiClick} />}
        </Box>
      </Box>
    </>
  );
};

export default InputField;

InputField.propTypes = {
  commenting: PropTypes.bool,
  onComment: PropTypes.func,
};
InputField.defaultProps = {
  commenting: false,
  onComment: () => {},
};
