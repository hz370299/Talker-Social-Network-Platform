import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import {
  Button, Divider, IconButton, Typography,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Tag from './Tag';
import EditGroup from './EditGroup';
import { Search, StyledInputBase } from './Nav';
import './Nav.css';
import Prompt from './Prompt';

export function SearchUserBackdrop({
  open,
  onSubmit,
  search,
  onSearch,
  onClose,
}) {
  const [selected, setSelected] = React.useState(new Set());
  const inputRef = React.useRef();
  const onSelect = (id) => {
    setSelected((prev) => {
      prev.add(id);
      return new Set(prev);
    });
  };
  const onCancel = (id) => {
    selected.delete(id);
    setSelected(new Set(selected));
  };
  useEffect(() => {
    setSelected(new Set());
  }, [search]);
  return (
    <React.Fragment>
      <Dialog open={open}>
        <DialogTitle>Search User</DialogTitle>
        <DialogContent>
          <Search sx={{ mr: 0, ml: '0px !important' }}>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              inputRef={inputRef}
            />
            <IconButton
              onClick={() => {
                onSearch(inputRef.current.value);
              }}
            >
              <SearchIcon />
            </IconButton>
          </Search>
          {search.map((v, i) => (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 1,
                mb: 1,
                '&:hover': {
                  bgcolor: 'action.selected',
                  cursor: 'pointer',
                },
              }}
              key={`${v.id}-${i}`}
              onClick={() => {
                if (selected.has(v.id)) {
                  onCancel(v.id);
                } else {
                  onSelect(v.id);
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Avatar src={v.avatar} />
                <Typography variant="subtitle1" sx={{ ml: 1 }}>
                  {v.name}
                </Typography>
              </Box>
              {selected.has(v.id) && <CheckBoxIcon color="info" />}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <React.Fragment>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={() => {
                const users = [...selected];
                onSubmit({ users, onClose });
              }}
            >
              Invite
            </Button>
          </React.Fragment>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

SearchUserBackdrop.propTypes = {
  search: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string,
      id: PropTypes.string,
    }),
  ),
  open: PropTypes.bool,
  onSubmit: PropTypes.func,
  onSearch: PropTypes.func,
  onClose: PropTypes.func,
};

SearchUserBackdrop.defaultProps = {
  search: [],
  open: false,
  onSubmit: () => {},
  onSearch: () => {},
  onClose: () => {},
};

export default function GroupProfile({
  groupId,
  avatar,
  name,
  creator,
  administrators,
  updateError,
  members,
  bio,
  userId,
  search,
  onSearch,
  tags,
  isSubmitting,
  onAddMember,
  onPromoteMember,
  onLeaveGroup,
  onDemoteAdmin,
  onUpdateGroup,
  onClearSearch,
  onRemoveMember,
  onSendMessage,
}) {
  const isAdmin = !!(
    creator.id === userId
    || administrators.findIndex((v) => v.id === userId) >= 0
  );
  const isCreator = creator.id === userId;
  const [showSearchUsers, setShowSearchUser] = React.useState(false);
  const [leave, setLeave] = React.useState(false);
  const [remove, setRemove] = React.useState(false);
  const [promote, setPromote] = React.useState(false);
  const [demote, setDemote] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const onLeave = () => {
    setLeave(true);
  };
  const onCloseLeave = () => {
    setLeave(false);
  };

  const onEdit = () => {
    setEdit(true);
  };
  const onCloseEdit = () => {
    setEdit(false);
  };
  const onOpenSearchUser = () => {
    setShowSearchUser(true);
  };
  const onCloseSearchUser = () => {
    onClearSearch();
    setShowSearchUser(false);
  };

  const onRemove = () => {
    setRemove(true);
  };
  const onCloseRemove = () => {
    setRemove(false);
  };

  const onPromote = () => {
    setPromote(true);
  };
  const onClosePromote = () => {
    setPromote(false);
  };

  const onDemote = () => {
    setDemote(true);
  };

  const onCloseDemote = () => {
    setDemote(false);
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
        avatar={<Avatar src={avatar} aria-label="Group Avatar" />}
        action={(
          <Box>
            <Link to={`/group/profile/${groupId}`}>
              <IconButton
                aria-label="settings"
                sx={{
                  bgcolor: 'action.selected',
                }}
              >
                <AccountBoxIcon />
              </IconButton>
            </Link>
            <Link to={`/group/chat/${groupId}`}>
              <IconButton aria-label="settings">
                <ChatIcon />
              </IconButton>
            </Link>
            <Link to={`/group/post/${groupId}`}>
              <IconButton aria-label="settings">
                <DashboardIcon />
              </IconButton>
            </Link>
            {isAdmin && (
              <IconButton onClick={onEdit}>
                <EditIcon />
              </IconButton>
            )}
          </Box>
        )}
        title={name}
        subheader={`${members.length + administrators.length + 1} members`}
      />
      <Divider />
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
            Creator
          </Typography>
          <Box
            sx={{
              display: 'flex',
              bgcolor: 'action.selected',
              borderRadius: 2,
              pb: 3,
              pl: 2,
              pt: 2,
              pr: 2,
            }}
          >
            <Box
              sx={{
                mr: 1,
                textAlign: 'center',
              }}
            >
              <Button id={creator.id} onClick={handleClick}>
                <Avatar
                  src={creator.avatar}
                  sx={{
                    width: '48px',
                    height: '48px',
                  }}
                />
              </Button>
              <Typography
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: 'text.secondary',
                }}
                variant="subtitle2"
              >
                {creator.name}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
            Admins
          </Typography>
          <Box
            sx={{
              display: 'flex',
              bgcolor: 'action.selected',
              borderRadius: 2,
              pb: 3,
              pl: 2,
              pt: 2,
              pr: 2,
            }}
          >
            {administrators.map((v) => (
              <Box
                sx={{
                  mr: 1,
                  textAlign: 'center',
                }}
                key={v.id}
              >
                <Button id={v.id} onClick={handleClick}>
                  <Avatar
                    src={v.avatar}
                    sx={{
                      width: '48px',
                      height: '48px',
                    }}
                  />
                </Button>
                <Typography
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: 'text.secondary',
                  }}
                  variant="subtitle2"
                >
                  {v.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
            Members
          </Typography>
          <Box
            sx={{
              display: 'flex',
              bgcolor: 'action.selected',
              borderRadius: 2,
              pb: 3,
              pl: 2,
              pt: 2,
              pr: 2,
            }}
          >
            {members.map((v) => (
              <Box
                sx={{
                  mr: 1,
                  textAlign: 'center',
                }}
                key={v.id}
              >
                <Button id={v.id} onClick={handleClick}>
                  <Avatar
                    src={v.avatar}
                    sx={{
                      width: '48px',
                      height: '48px',
                    }}
                  />
                </Button>
                <Typography
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: 'text.secondary',
                  }}
                  variant="subtitle2"
                >
                  {v.name}
                </Typography>
              </Box>
            ))}
            {isAdmin && (
              <IconButton
                sx={{
                  mt: 1.5,
                  color: 'info.main',
                }}
                onClick={onOpenSearchUser}
              >
                <AddIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
            Tags
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {tags.map((v, i) => (
              <Tag name={v} key={i} />
            ))}
          </Box>
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
            Group Info
          </Typography>
          <Box
            sx={{
              display: 'flex',
              bgcolor: 'action.selected',
              borderRadius: 2,
              pb: 3,
              pl: 2,
              pt: 2,
              pr: 2,
            }}
          >
            <Typography>{bio}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            sx={{
              float: 'right',
              mt: 5,
              color: 'inherit',
              bgcolor: 'error.main',
              width: '60%',
            }}
            onClick={onLeave}
          >
            Leave
          </Button>
        </Box>
      </CardContent>
      {showSearchUsers && (
        <SearchUserBackdrop
          open={showSearchUsers}
          onSubmit={onAddMember}
          search={search}
          onSearch={onSearch}
          onClose={onCloseSearchUser}
        />
      )}
      {leave && (
        <Prompt
          open={leave}
          text="Are you sure to leave?"
          onClose={onCloseLeave}
          onSubmit={() => {
            onLeaveGroup();
            onCloseLeave();
          }}
        />
      )}
      {remove && (
        <Prompt
          open={remove}
          text="Are you sure to remove this member?"
          onClose={onCloseRemove}
          onSubmit={() => {
            onRemoveMember(anchorEl.id);
            onCloseRemove();
            handleClose();
          }}
        />
      )}
      {promote && (
        <Prompt
          open={promote}
          text="Are you sure to demote this member?"
          onClose={onClosePromote}
          onSubmit={() => {
            onPromoteMember(anchorEl.id);
            onClosePromote();
            handleClose();
          }}
        />
      )}
      {demote && (
        <Prompt
          open={demote}
          text="Are you sure to preomote this member?"
          onClose={onCloseDemote}
          onSubmit={() => {
            onDemoteAdmin(anchorEl.id);
            onCloseDemote();
            handleClose();
          }}
        />
      )}
      {edit && (
        <EditGroup
          name={name}
          avatar={avatar}
          bio={bio}
          tags={tags}
          open={edit}
          onClose={onCloseEdit}
          onSubmit={onUpdateGroup}
          isSubmitting={isSubmitting}
          error={updateError}
        />
      )}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleClose();
                history.push({ pathname: `/user/profile/${anchorEl.id}` });
              }}
            >
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleClose();
                onSendMessage({ targetId: anchorEl.id, history });
              }}
            >
              <ListItemText primary="Send Message" />
            </ListItemButton>
          </ListItem>
          {isCreator
            && anchorEl
            && administrators.find((v) => v.id === anchorEl.id) && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={onDemote}
                  sx={{
                    bgcolor: 'error.dark',
                    '&:hover': {
                      bgcolor: 'error.light',
                    },
                  }}
                >
                  <ListItemText primary="Demote" />
                </ListItemButton>
              </ListItem>
          )}
          {isCreator && anchorEl && members.find((v) => v.id === anchorEl.id) && (
            <ListItem disablePadding>
              <ListItemButton onClick={onPromote}>
                <ListItemText primary="Promote To Admin" />
              </ListItemButton>
            </ListItem>
          )}
          {isAdmin && anchorEl && members.find((v) => v.id === anchorEl.id) && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={onRemove}
                sx={{
                  bgcolor: 'error.dark',
                  '&:hover': {
                    bgcolor: 'error.light',
                  },
                }}
              >
                <ListItemText primary="Remove" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Popover>
    </Card>
  );
}

GroupProfile.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  groupId: PropTypes.string,
  bio: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  userId: PropTypes.string,
  isSubmitting: PropTypes.bool,
  updateError: PropTypes.bool,
  creator: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.string,
  }),
  members: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
  ),
  administrators: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
  ),
  search: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
  ),
  onAddMember: PropTypes.func,
  onPromoteMember: PropTypes.func,
  onLeaveGroup: PropTypes.func,
  onDemoteAdmin: PropTypes.func,
  onUpdateGroup: PropTypes.func,
  onRemoveMember: PropTypes.func,
  onSearch: PropTypes.func,
  onSendMessage: PropTypes.func,
  onClearSearch: PropTypes.func,
};

GroupProfile.defaultProps = {
  members: [],
  avatar: '',
  creator: {},
  name: '',
  tags: [],
  isSubmitting: false,
  updateError: false,
  administrators: [],
  search: [],
  bio: '',
  userId: '',
  onAddMember: () => {},
  onPromoteMember: () => {},
  onLeaveGroup: () => {},
  onDemoteAdmin: () => {},
  onUpdateGroup: () => {},
  onRemoveMember: () => {},
  onSearch: () => {},
  onSendMessage: () => {},
  onClearSearch: () => {},
  groupId: '',
};
