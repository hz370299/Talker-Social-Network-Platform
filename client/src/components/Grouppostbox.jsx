import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import {
  Button,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';
import Picker from 'emoji-picker-react';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import UploadButton from './UploadButton';
import Post from './Post';
import { GlassBox } from '../pages/Home';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};
export default function Grouppostbox({
  posts,
  avatar,
  id,
  onPost,
  name,
  targetId,
  isSubmitting,
  onScroll,
  hasMore,
  userAvatar,
  onComment,
  onDelete,
  isCommenting,
  isDeleting,
  onLike,
  onUnlike,
  isAdmin,
  members,
  onReport,
  onDeleteComment,
  onHide,
}) {
  const [files, setFiles] = useState({ images: [], audios: [], videos: [] });
  const postRef = useRef();
  const [curFile, setCurFile] = useState('');
  const uploadRef = useRef();
  const [showEmoji, setShowEmoji] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    document.body.style.overflow = 'unset';
    setOpen(false);
  };

  useEffect(
    () => () => {
      files.images.forEach((v) => {
        URL.revokeObjectURL(v);
      });
      files.videos.forEach((v) => {
        URL.revokeObjectURL(v);
      });
      files.audios.forEach((v) => {
        URL.revokeObjectURL(v);
      });
    },
    [files],
  );
  useEffect(() => {
    window.document.documentElement.scrollTop = 0;
  }, []);

  const uploadHandler = (event) => {
    const cur = { images: [], videos: [], audios: [] };
    for (const e of event.target.files) {
      if (e.type.includes('image')) {
        cur.images.push(URL.createObjectURL(e));
      }
      if (e.type.includes('video')) {
        cur.videos.push(URL.createObjectURL(e));
      }
      if (e.type.includes('audio')) {
        cur.audios.push(URL.createObjectURL(e));
      }
    }
    setFiles(cur);
  };
  const onEmojiClick = (event, emojiObject) => {
    postRef.current.value += emojiObject.emoji;
  };

  const toggleEmojiPicker = () => {
    setShowEmoji((prev) => !prev);
  };
  const [filter, setFilter] = React.useState('all');

  const handleChange = (event) => {
    setFilter(event.target.value);
  };

  const filterdPosts = React.useMemo(() => {
    let cpPosts = posts.slice();
    if (filter === 'flag') {
      cpPosts = cpPosts.filter((v) => v.flag.length > 0);
      cpPosts.sort((a, b) => b.flag.length - a.flag.length);
    }
    return cpPosts;
  }, [posts, filter]);
  return (
    <React.Fragment>
      <Card
        sx={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          pb: 2,
          borderRadius: 2,
        }}
      >
        <CardHeader
          avatar={(
            <Link to={`/group/profile/${targetId}`}>
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
            </Link>
          )}
          action={(
            <Box>
              <Link to={`/group/profile/${targetId}`}>
                <IconButton aria-label="settings">
                  <AccountBoxIcon />
                </IconButton>
              </Link>
              <Link to={`/group/chat/${targetId}`}>
                <IconButton aria-label="settings">
                  <ChatIcon />
                </IconButton>
              </Link>
              <Link to={`/group/post/${targetId}`}>
                <IconButton
                  aria-label="settings"
                  sx={{
                    bgcolor: 'action.selected',
                  }}
                >
                  <DashboardIcon />
                </IconButton>
              </Link>
            </Box>
          )}
          title={name}
          subheader={`${members} members`}
        />
      </Card>
      <GlassBox sx={{ mt: 0.5, borderRadius: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Share best moment!"
            sx={{
              flexGrow: 1,
              '& .css-9425fu-MuiOutlinedInput-notchedOutline': {
                borderRadius: '0.5rem',
              },
            }}
            inputRef={postRef}
            disabled={isSubmitting}
            multiline
          />

          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{
              marginLeft: '1rem',
            }}
          >
            <Avatar alt="Travis Howard" src={userAvatar} />
          </Badge>
        </Box>
        <Box>
          <Slider {...settings}>
            {files.videos.map((item) => (
              <Box
                key={item}
                sx={{
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                  },
                  width: '200px',
                  height: '200px',
                  justifyContent: 'flex-start !important',
                }}
              >
                <video
                  alt={item}
                  loading="lazy"
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                  }}
                  controls
                >
                  <source src={item} />
                </video>
              </Box>
            ))}
            {files.images.map((item) => (
              <Box
                key={item}
                sx={{
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                  },
                  width: '200px',
                  height: '200px',
                  justifyContent: 'flex-start !important',
                }}
                onClick={() => {
                  document.body.style.overflow = 'hidden';
                  setCurFile(item);
                  setOpen(true);
                }}
              >
                <img
                  src={item}
                  alt={item}
                  loading="lazy"
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </Box>
            ))}
          </Slider>
          <Backdrop
            sx={{
              color: '#fff',
              zIndex: (theme) => theme.zIndex.drawer + 10,
            }}
            open={open}
            onClick={handleClose}
          >
            <Box sx={{ width: '500px', height: '500px' }}>
              <IconButton onClick={handleClose} sx={{ float: 'right' }}>
                <CloseIcon />
              </IconButton>
              <img
                src={curFile}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Backdrop>
        </Box>
        <Box>
          {files.audios.map((item) => (
            <Box
              key={item}
              sx={{
                backgroundColor: 'transparent',
                justifyContent: 'flex-start !important',
                mt: 1,
              }}
            >
              <audio alt={item} loading="lazy" controls>
                <source src={item} />
              </audio>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1rem',
          }}
        >
          <Box
            sx={{
              position: 'relative',
            }}
          >
            <UploadButton
              uploadHandler={uploadHandler}
              disabled={isSubmitting}
              ref={uploadRef}
            />

            <IconButton
              aria-label="emoji selector"
              color="inherit"
              onClick={toggleEmojiPicker}
              disabled={isSubmitting}
            >
              <EmojiEmotionsIcon />
            </IconButton>
            {showEmoji && <Picker onEmojiClick={onEmojiClick} />}
          </Box>
          <Box>
            <Button
              variant="whiteButton"
              startIcon={<SendIcon />}
              onClick={() => {
                const clearup = () => {
                  postRef.current.value = '';
                  setFiles({ images: [], audios: [], videos: [] });
                };
                const formData = new FormData();
                formData.append('content', postRef.current.value);
                const curFiles = uploadRef.current.files;

                Array.from(curFiles).forEach((file) => {
                  if (file.type.includes('image')) {
                    formData.append('imgs', file);
                  } else if (file.type.includes('video')) {
                    formData.append('videos', file);
                  } else if (file.type.includes('audio')) {
                    formData.append('audios', file);
                  }
                });
                onPost({ formData, clearup });
              }}
              disabled={isSubmitting}
            >
              Post
            </Button>
          </Box>
        </Box>
      </GlassBox>
      {isSubmitting && (
        <Box sx={{ mt: 2, width: '100%' }}>
          <LinearProgress />
        </Box>
      )}
      <Divider />
      {isAdmin && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <FormControl sx={{ minWidth: '150px' }}>
            <InputLabel id="demo-simple-select-label">Filter</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filter}
              label="filter"
              onChange={handleChange}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="flag">Flag</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
      <Divider />
      <InfiniteScroll
        dataLength={posts.length}
        next={onScroll}
        hasMore={hasMore}
        loader={<CircularProgress />}
        endMessage={(
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        )}
      >
        {filterdPosts.map((v) => (
          <Post
            id={v.id}
            userId={id}
            postUserId={(v.user && v.user.id) || ''}
            videos={v.videos}
            audios={v.audios}
            name={(v.user && v.user.name) || ''}
            avatar={(v.user && v.user.avatar) || ''}
            time={v.createdAt}
            comments={v.comments}
            imgs={v.imgs}
            likes={v.likes}
            content={v.content}
            key={v.id}
            showDelete={(v.user && v.user.id === id) || isAdmin}
            onComment={(content) => {
              onComment({ content, groupPostId: v.id });
            }}
            onDelete={() => {
              onDelete(v.id);
            }}
            commenting={isCommenting}
            deletePostSubmitting={isDeleting}
            onLike={() => {
              onLike(v.id);
            }}
            onUnlike={() => {
              onUnlike(v.id);
            }}
            flag={v.flag.length}
            isAdmin={isAdmin}
            onReport={() => {
              onReport(v.id);
            }}
            onDeleteComment={(commentId) => {
              onDeleteComment({ commentId, groupPostId: v.id });
            }}
            onHide={() => {
              onHide(v.id);
            }}
            showHide
          />
        ))}
      </InfiniteScroll>
    </React.Fragment>
  );
}

Grouppostbox.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string,
      media: PropTypes.string,
    }),
  ),
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  id: PropTypes.string,
  onPost: PropTypes.func,
  targetId: PropTypes.string,
  isSubmitting: PropTypes.bool,
  onScroll: PropTypes.func,
  hasMore: PropTypes.bool,
  userAvatar: PropTypes.string,
  onComment: PropTypes.func,
  onDelete: PropTypes.func,
  isCommenting: PropTypes.shape({}),
  isDeleting: PropTypes.bool,
  onLike: PropTypes.func,
  onUnlike: PropTypes.func,
  isAdmin: PropTypes.bool,
  members: PropTypes.number,
  onReport: PropTypes.func,
  onDeleteComment: PropTypes.func,
  onHide: PropTypes.func,
};

Grouppostbox.defaultProps = {
  posts: [],
  id: '',
  onPost: () => {},
  targetId: '',
  isSubmitting: false,
  onScroll: () => {},
  hasMore: false,
  userAvatar: '',
  onComment: () => {},
  onDelete: () => {},
  isCommenting: {},
  isDeleting: false,
  onLike: () => {},
  onUnlike: () => {},
  isAdmin: false,
  members: 1,
  onReport: () => {},
  onDeleteComment: () => {},
  onHide: () => {},
};
