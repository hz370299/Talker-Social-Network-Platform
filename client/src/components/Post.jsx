import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import {
  Box,
  Button,
  CardContent,
  CircularProgress,
  Divider,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import ReportIcon from '@mui/icons-material/Report';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Badge from '@mui/material/Badge';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import commentPropTypes from '../propTypes/comment';
import InputField from './InputField';
import Prompt from './Prompt';

export function SimpleDialog(props) {
  const {
    onClose,
    open,
    showDelete,
    submitting,
    onDelete,
    onReport,
    showHide,
    onHide,
  } = props;
  useEffect(() => {
    if (!submitting) {
      onClose();
    }
  }, [submitting]);
  return (
    <React.Fragment>
      <Dialog open={open}>
        <List sx={{ width: '400px', position: 'relative' }}>
          <IconButton
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              zIndex: 1000,
            }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
          {!submitting && showHide && (
            <ListItem button onClick={onHide}>
              <ListItemText
                primary="Hide"
                sx={{ textAlign: 'center', color: 'info.main' }}
              />
            </ListItem>
          )}
          {!submitting && showDelete && (
            <ListItem button onClick={onDelete}>
              <ListItemText
                primary="DELETE"
                sx={{ color: 'error.main', textAlign: 'center' }}
              />
            </ListItem>
          )}
          {!submitting && (
            <ListItem
              button
              onClick={() => {
                onReport();
                onClose();
              }}
            >
              <ListItemText
                primary="REPORT"
                sx={{ color: 'info.main', textAlign: 'center' }}
              />
            </ListItem>
          )}
          {submitting && (
            <ListItem>
              <ListItemText
                primary={<CircularProgress />}
                sx={{ color: 'info.main', textAlign: 'center' }}
              />
            </ListItem>
          )}
        </List>
      </Dialog>
    </React.Fragment>
  );
}
SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  showDelete: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  onDelete: PropTypes.func,
  onReport: PropTypes.func,
  showHide: PropTypes.bool,
  onHide: PropTypes.func,
};

SimpleDialog.defaultProps = {
  onDelete: () => {},
  onReport: () => {},
  showHide: false,
  onHide: () => {},
};

export default function Post({
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
  onComment,
  onDelete,
  commenting,
  deletePostSubmitting,
  onLike,
  onUnlike,
  showDelete,
  flag,
  onReport,
  isAdmin,
  onDeleteComment,
  showHide,
  onHide,
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
  const [deleteComment, setDeleteComment] = React.useState(false);
  const [commentId, setCommentId] = React.useState('');
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const showDeleteComment = () => {
    setDeleteComment(true);
  };

  const closeDeleteComment = () => {
    setDeleteComment(false);
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
          <Link to={`/user/profile/${postUserId}`}>
            <Button>
              <Avatar
                sx={{ width: 56, height: 56 }}
                src={avatar}
                aria-label="user"
              />
            </Button>
          </Link>
        )}
        action={(
          <React.Fragment>
            {flag > 0 && isAdmin && (
              <Badge badgeContent={flag} color="primary">
                <ReportIcon color="error" />
              </Badge>
            )}
            <IconButton aria-label="settings" onClick={handleClickOpen}>
              <MoreVertIcon />
            </IconButton>
          </React.Fragment>
        )}
        title={name}
        subheader={<Moment fromNow>{time}</Moment>}
      />
      <SimpleDialog
        open={open}
        onClose={handleClose}
        showDelete={showDelete}
        submitting={deletePostSubmitting}
        onDelete={onDelete}
        onReport={onReport}
        postId={id}
        showHide={showHide}
        onHide={onHide}
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
          onClick={() => {
            if (likes.indexOf(userId) === -1) {
              onLike();
            } else {
              onUnlike();
            }
          }}
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
        <CardActions
          sx={{
            paddingLeft: '2rem',
            paddingRight: '2rem',
            overflowWrap: 'break-word',
          }}
        >
          <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
            <span style={{ fontWeight: 'bold' }}>{name}</span>
            <span>{':  '}</span>
            <span
              style={{
                color: 'rgba(255,255,255,0.8)',
                overflowWrap: 'break-word',
              }}
            >
              {content}
            </span>
          </Typography>
        </CardActions>
      )}
      <Divider />
      <CardActions
        sx={{
          paddingLeft: '1.5rem',
          paddingBottom: '0.2rem',
          paddingTop: '0.2rem',
        }}
      >
        <InputField commenting={!!commenting[id]} onComment={onComment} />
      </CardActions>

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
                <Link
                  to={`/user/profile/${v.commenter.id}`}
                  style={{ color: 'inherit', textDecoration: 'inherit' }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ wordBreak: 'break-all' }}
                  >
                    <span style={{ fontWeight: 'bold' }}>
                      {v.commenter.name}
                    </span>
                    <span>{':  '}</span>
                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {v.content}
                    </span>
                  </Typography>
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  <Moment fromNow>{v.createdAt}</Moment>
                </Typography>
                {userId === v.commenter.id && (
                  <IconButton
                    onClick={() => {
                      setCommentId(v.id);
                      showDeleteComment();
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          ))}
          {showDeleteComment && (
            <Prompt
              open={deleteComment}
              text="Are you sure to delete the comment?"
              onClose={closeDeleteComment}
              onSubmit={() => {
                onDeleteComment(commentId);
                closeDeleteComment();
              }}
            />
          )}
        </CardContent>
      )}
    </Card>
  );
}

Post.propTypes = {
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
  onComment: PropTypes.func,
  onDelete: PropTypes.func,
  commenting: PropTypes.shape({}),
  deletePostSubmitting: PropTypes.bool,
  onLike: PropTypes.func,
  onUnlike: PropTypes.func,
  showDelete: PropTypes.bool,
  flag: PropTypes.number,
  isAdmin: PropTypes.bool,
  onReport: PropTypes.func,
  onDeleteComment: PropTypes.func,
  showHide: PropTypes.bool,
  onHide: PropTypes.func,
};

Post.defaultProps = {
  onComment: () => {},
  onDelete: () => {},
  commenting: {},
  deletePostSubmitting: false,
  onLike: () => {},
  onUnlike: () => {},
  showDelete: false,
  flag: 0,
  onReport: () => {},
  isAdmin: false,
  onDeleteComment: () => {},
  showHide: false,
  onHide: () => {},
};
