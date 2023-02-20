import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import {
  Box,
  Button,
  CardContent, Divider,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useState } from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import commentPropTypes from '../propTypes/comment';
import InputField from './InputField';
import { SimpleDialog } from './Post';

export default function UserProfileComponent({
  name,
  avatar,
  time,
  comments,
  content,
  imgs,
  likes,
  id,
  videos,
  audios,
  userId,
  postUserId,
}) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const [viewComments, setViewComments] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card
      sx={{
        maxWidth: '100%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginTop: '1.5rem',
        overflow: 'visible',
      }}
    >
      <CardHeader
        avatar={(
          <Link to="/profile">
            <Button>
              <Avatar
                sx={{ width: 56, height: 56 }}
                src={avatar}
                aria-label="user"
              />
            </Button>
          </Link>
        )}
        title={name}
        subheader={<Moment fromNow>{time}</Moment>}
      />
      <SimpleDialog
        open={open}
        onClose={handleClose}
        showDelete={false}
        submitting={false}
        postId={id}
      />
      <Box
        sx={{ paddingLeft: '2rem', paddingRight: '2rem', maxHeigth: '720px' }}
      >
        <Slider {...settings}>
          {imgs.map((v, i) => (
            <Box
              sx={{
                maxHeight: '720px',
              }}
              key={i}
            >
              <img
                src={v}
                alt=""
                style={{ width: '100%', height: '613px', objectFit: 'cover' }}
              />
            </Box>
          ))}
          {videos.map((v, i) => (
            <Box
              sx={{
                maxHeight: '720px',
              }}
              key={i}
            >
              <video
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                controls
              >
                <source src={v} type="video/mp4" />
              </video>
            </Box>
          ))}
        </Slider>
      </Box>
      <CardActions
        sx={{ paddingLeft: '1.5rem', paddingRight: '2rem', paddingBottom: 0 }}
      >
        <IconButton
          aria-label="add to favorites"
          onClick={() => {}}
        >
          <FavoriteIcon
            color={likes.indexOf(userId) !== -1 ? 'error' : 'action'}
          />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
      <CardActions
        sx={{ paddingLeft: '2rem', paddingRight: '2rem', paddingBottom: '0' }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {likes.length}
          {' '}
          likes
        </Typography>
      </CardActions>
      {audios.map((v, i) => (
        <CardActions sx={{ paddingLeft: '2rem', paddingRight: '2rem' }} key={i}>
          <Typography variant="subtitle1">
            <span style={{ fontWeight: 'bold' }}>{name}</span>
            <span>{':  '}</span>
          </Typography>
          <audio
            alt="dsa"
            controls
            style={{ height: '2rem', marginLeft: '0.5rem' }}
          >
            <source src={v} />
          </audio>
        </CardActions>
      ))}
      {content && (
        <CardActions sx={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
          <Typography variant="subtitle1">
            <span style={{ fontWeight: 'bold' }}>{name}</span>
            <span>{':  '}</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{content}</span>
          </Typography>
        </CardActions>
      )}
      <Divider />
      (
      <CardActions
        sx={{
          paddingLeft: '1.5rem',
          paddingBottom: '0.2rem',
          paddingTop: '0.2rem',
        }}
      >
        <InputField postId={id} />
      </CardActions>
      )
      <Divider />
      <Button
        sx={{
          color: 'rgba(255,255,255,0.4)',
          marginLeft: '1.5rem',
        }}
        onClick={() => setViewComments((prev) => !prev)}
      >
        View Comments ...
      </Button>
      <Divider />
      {viewComments && (
        <CardContent sx={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
          {comments.map((v) => (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              key={v.id}
            >
              <Box>
                <Typography variant="subtitle1">
                  <span style={{ fontWeight: 'bold' }}>{v.commenter.name}</span>
                  <span>{':  '}</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {v.content}
                  </span>
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  <Moment fromNow>{v.createdAt}</Moment>
                </Typography>
              </Box>
            </Box>
          ))}
        </CardContent>
      )}
    </Card>
  );
}

UserProfileComponent.propTypes = {
  id: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  postUserId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  comments: PropTypes.arrayOf(commentPropTypes).isRequired,
  imgs: PropTypes.arrayOf(PropTypes.string).isRequired,
  content: PropTypes.string.isRequired,
  likes: PropTypes.arrayOf(PropTypes.string).isRequired,
  videos: PropTypes.arrayOf(PropTypes.string).isRequired,
  audios: PropTypes.arrayOf(PropTypes.string).isRequired,
};
