import CloseIcon from '@mui/icons-material/Close';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/system';
import Picker from 'emoji-picker-react';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import ButtonList from '../components/ButtonList';
import Contact from '../components/Contact';
import Post from '../components/Post';
import UploadButton from '../components/UploadButton';
import userPropTypes from '../propTypes/user';
import {
  commentPost, createPost, deletePost,
  deletePostComment, fetchMorePosts, likePost, unlikePost,
} from '../redux/posts';
import FriendSkeleton from '../skeletons/FriendSkeleton';
import PostSkeleton from '../skeletons/PostSkeleton';

export const GlassBox = styled('div')({
  backgroundColor: 'rgba(255,255,255,0.2)',
  borderRadius: '2rem',
  padding: '2rem',
});

function Home({
  user,
  isLoading,
  posts,
  createPost,
  error,
  submitting,
  fetchMorePosts,
  hasMore,
  deletePostSubmitting,
  commenting,
  commentPost,
  likePost,
  unlikePost,
  deletePost,
  deletePostComment,
}) {
  const [files, setFiles] = useState({ images: [], audios: [], videos: [] });
  const postRef = useRef();
  const [curFile, setCurFile] = useState('');
  const uploadRef = useRef();
  const [showEmoji, setShowEmoji] = useState(false);
  const [open, setOpen] = React.useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
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

  const onPost = () => {
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
    createPost(formData);
  };

  const onDeletePostComment = ({ commentId, postId }) => {
    deletePostComment({ commentId, postId });
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
              Contact
            </Typography>
            <Box
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '2rem',
                padding: '2rem',
                height: '70vh',
              }}
            >
              {isLoading
                ? [...Array(5)].map((_, i) => <FriendSkeleton key={i} />)
                : user.friends.map((v) => (
                  <Contact
                    name={v.name}
                    id={v.id}
                    avatar={v.avatar}
                    online={v.status === 'online'}
                    key={v.id}
                  >
                    {' '}
                  </Contact>
                ))}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: '750px', marginInline: 'auto' }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', paddingBottom: '0.8rem' }}
            >
              Home
            </Typography>
            {error && (
              <Alert
                severity="error"
                sx={{
                  textAlign: 'center',
                }}
              >
                <strong>Post Failed!</strong>
              </Alert>
            )}
            <GlassBox>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {isLoading ? (
                  <Skeleton
                    sx={{ flexGrow: 1, height: '3rem', borderRadius: 3 }}
                    variant="rectangular"
                  />
                ) : (
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
                    disabled={submitting}
                    multiline
                  />
                )}
                {isLoading ? (
                  <Skeleton
                    variant="circular"
                    sx={{ width: 40, height: 40, ml: 2 }}
                  />
                ) : (
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    sx={{
                      marginLeft: '1rem',
                    }}
                  >
                    <Avatar alt="Travis Howard" src={user.avatar} />
                  </Badge>
                )}
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
                  {isLoading ? (
                    <Skeleton
                      sx={{ width: 32, height: 32, display: 'inline-block' }}
                      variant="circular"
                    />
                  ) : (
                    <UploadButton
                      uploadHandler={uploadHandler}
                      disabled={submitting}
                      ref={uploadRef}
                    />
                  )}
                  {isLoading ? (
                    <Skeleton
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'inline-block',
                        ml: 2,
                      }}
                      variant="circular"
                    />
                  ) : (
                    <IconButton
                      aria-label="emoji selector"
                      color="inherit"
                      onClick={toggleEmojiPicker}
                      disabled={submitting}
                    >
                      <EmojiEmotionsIcon />
                    </IconButton>
                  )}
                  {showEmoji && <Picker onEmojiClick={onEmojiClick} />}
                </Box>
                <Box>
                  {isLoading ? (
                    <Skeleton sx={{ width: 60, height: 50 }} />
                  ) : (
                    <Button
                      variant="whiteButton"
                      startIcon={<SendIcon />}
                      onClick={onPost}
                      disabled={submitting}
                    >
                      Post
                    </Button>
                  )}
                </Box>
              </Box>
              {submitting && (
                <Box sx={{ mt: 2, width: '100%' }}>
                  <LinearProgress />
                </Box>
              )}
            </GlassBox>
            {isLoading ? (
              [...Array(2)].map((_, i) => <PostSkeleton key={i} />)
            ) : (
              <InfiniteScroll
                dataLength={posts.length}
                next={fetchMorePosts}
                hasMore={hasMore}
                loader={<CircularProgress />}
                endMessage={(
                  <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                )}
              >
                {posts.map((v) => (
                  <Post
                    id={v.id}
                    userId={user.id}
                    postUserId={v.user.id}
                    videos={v.videos}
                    audios={v.audios}
                    name={v.user.name}
                    avatar={v.user.avatar}
                    time={v.createdAt}
                    comments={v.comments}
                    imgs={v.imgs}
                    likes={v.likes}
                    content={v.content}
                    key={v.id}
                    showDelete={v.user.id === user.id}
                    onComment={(content) => {
                      commentPost({ postId: v.id, content });
                    }}
                    onDelete={() => {
                      deletePost(v.id);
                    }}
                    commenting={commenting}
                    deletePostSubmitting={deletePostSubmitting}
                    onLike={() => {
                      likePost(v.id);
                    }}
                    onUnlike={() => {
                      unlikePost(v.id);
                    }}
                    onDeleteComment={(commentId) => {
                      onDeletePostComment({ commentId, postId: v.id });
                    }}
                  />
                ))}
              </InfiniteScroll>
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
            <ButtonList current="home" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
  isLoading: state.ui.isLoading,
  posts: state.post.posts,
  hasMore: state.post.hasMore,
  error: state.ui.error.post,
  submitting: state.ui.submitting.post,
  deletePostSubmitting: state.ui.submitting.deletePost,
  commenting: state.ui.submitting.comment,
});
Home.propTypes = {
  user: userPropTypes.isRequired,
  isLoading: PropTypes.bool.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  createPost: PropTypes.func.isRequired,
  fetchMorePosts: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
  deletePostSubmitting: PropTypes.bool.isRequired,
  commenting: PropTypes.shape({}).isRequired,
  commentPost: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  deletePostComment: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  fetchMorePosts,
  createPost,
  commentPost,
  likePost,
  deletePost,
  unlikePost,
  deletePostComment,
})(Home);
