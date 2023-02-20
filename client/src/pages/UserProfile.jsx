import { CircularProgress, Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import * as React from 'react';
import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Post from '../components/Post';
import Profile from '../components/Profile';
import { goOrCreateChat } from '../redux/chat';
import {
  commentProfilePost, deleteProfilePostComment, fetchMoreProfilePosts,
  fetchProfile, likeProfilePost,
  unlikeProfilePost,
} from '../redux/userProfile';
import { sendFriendRequest } from '../redux/users';

export default function UserProfile() {
  const { id: userId } = useParams();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.userProfile.profile);
  const isLoading = useSelector((state) => state.userProfile.isLoading);
  const hasMore = useSelector((state) => state.userProfile.canLoadMore);
  const history = useHistory();
  const curUser = useSelector((state) => state.user);
  const friends = curUser.friends.map((v) => v.id) || [];
  const commenting = useSelector((state) => state.userProfile.commenting);
  const getMore = () => {
    dispatch(fetchMoreProfilePosts(userId));
  };
  const onSendFriendRequest = () => {
    dispatch(sendFriendRequest(userId));
  };
  useEffect(() => {
    window.document.documentElement.scrollTop = 0;
  }, []);
  useEffect(() => {
    dispatch(fetchProfile(userId));
  }, [userId]);
  const onDeletePostComment = ({ commentId, postId }) => {
    dispatch(deleteProfilePostComment({ commentId, postId }));
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        sx={{
          paddingTop: '2rem',
          minWidth: '400px',
          justifyContent: 'center',
        }}
      >
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              marginInline: 'auto',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            {' '}
            {isLoading && (
              <CircularProgress sx={{ marginInline: 'auto' }} />
            )}
            {' '}
          </Box>

          {!isLoading && (
            <Box sx={{ maxWidth: '750px', marginInline: 'auto' }}>
              <Profile
                user={profile}
                isFriend={
                  friends.indexOf(userId) !== -1 || curUser.id === userId
                }
                onSendFriendRequest={onSendFriendRequest}
                goChat={() => {
                  dispatch(goOrCreateChat({ targetId: profile.id, history }));
                }}
              />
            </Box>
          )}
          {!isLoading && (
            <Box sx={{ maxWidth: '750px', marginInline: 'auto', pb: 12 }}>
              <InfiniteScroll
                dataLength={profile.posts.length}
                next={getMore}
                hasMore={hasMore}
                loader={<CircularProgress />}
                endMessage={(
                  <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                )}
              >
                {profile.posts.map((v) => (
                  <Post
                    key={v.id}
                    id={v.id}
                    userId={curUser.id}
                    postUserId={v.user.id}
                    name={v.user.name}
                    avatar={v.user.avatar}
                    time={v.createdAt}
                    comments={v.comments}
                    likes={v.likes}
                    content={v.content}
                    imgs={v.imgs}
                    videos={v.videos}
                    audios={v.audios}
                    inNetwork={false}
                    onComment={(content) => {
                      dispatch(commentProfilePost({ postId: v.id, content }));
                    }}
                    commenting={commenting}
                    onLike={() => {
                      dispatch(likeProfilePost(v.id));
                    }}
                    onUnlike={() => {
                      dispatch(unlikeProfilePost(v.id));
                    }}
                    onDeleteComment={(commentId) => {
                      onDeletePostComment({ commentId, postId: v.id });
                    }}
                  />
                ))}
              </InfiniteScroll>
            </Box>
          )}
          <Divider sx={{ mt: 1 }} />
        </Grid>
      </Grid>
    </Box>
  );
}
