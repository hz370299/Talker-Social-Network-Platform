import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MoreIcon from '@mui/icons-material/MoreVert';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import { ListSubheader } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { alpha, styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Zoom from '@mui/material/Zoom';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import iconImage from '../assets/icon.png';
import userPropTypes from '../propTypes/user';
import { searchUsersAndGroups } from '../redux/search';
import { setCommonError } from '../redux/ui';
import { getinfo, logout } from '../redux/users';
import './Nav.css';
import ToggleColorModeButton from './ToggleColorModeButton';

function ScrollTop(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    );

    if (anchor) {
      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

ScrollTop.defaultProps = {
  window: () => {},
};

export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));

function Nav({
  user,
  toggleColorMode,
  logout,
  searchUsersAndGroups,
  search,
  isLoading,
}) {
  const unread = user.notifications.reduce((a, c) => a + (c.read ? 0 : 1), 0);
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [query, setQuery] = React.useState('');
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [showPopover, setShowPopover] = React.useState(false);
  const [loadMore, setLoadMore] = React.useState(true);

  useEffect(() => {
    const identifier = setTimeout(() => {
      if (showPopover) {
        searchUsersAndGroups(query);
      }
    }, 300);
    return () => {
      clearTimeout(identifier);
    };
  }, [query]);
  const popOver = (
    <Box
      sx={{
        width: '100%',
        maxWidth: 360,
        position: 'absolute',
        zIndex: 'modal',
        bgcolor: 'background.paper',
      }}
    >
      <List dense subheader={<ListSubheader>Users</ListSubheader>}>
        {(search.users || []).map((value) => {
          const labelId = `checkbox-list-secondary-label-${value}`;
          return (
            <ListItem
              key={value.id}
              sx={{ color: 'inherit' }}
              secondaryAction={(
                <Typography sx={{ color: 'text.secondary' }}>
                  {value.id === user.id ? 'you' : ''}
                </Typography>
              )}
            >
              <ListItemButton
                onMouseDown={(e) => {
                  e.preventDefault();
                  history.push({ pathname: `/user/profile/${value.id}` });
                  setShowPopover(false);
                }}
              >
                <ListItemAvatar>
                  <Avatar alt={`Avatar n°${value + 1}`} src={value.avatar} />
                </ListItemAvatar>
                <ListItemText id={labelId} primary={value.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <List dense subheader={<ListSubheader>Groups</ListSubheader>}>
        {(search.groups || []).map((value) => {
          const labelId = `checkbox-list-secondary-label-${value}`;
          return (
            <ListItem key={value.id}>
              <ListItemButton
                onMouseDown={(e) => {
                  e.preventDefault();
                  history.push(`/search/group/profile/${value.id}`);
                  setShowPopover(false);
                }}
              >
                <ListItemAvatar>
                  <Avatar alt={`Avatar n°${value + 1}`} src={value.avatar} />
                </ListItemAvatar>
                <ListItemText id={labelId} primary={value.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
        <ListItemButton
          sx={{ textAlign: 'center' }}
          onClick={() => {
            setLoadMore((prev) => !prev);
          }}
          onMouseDown={(event) => event.preventDefault()}
        >
          <ListItemText>{loadMore ? 'Load More...' : 'Hide'}</ListItemText>
        </ListItemButton>
      </List>
    </Box>
  );

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleChange = (event) => {
    setQuery(event.currentTarget.value);
  };

  const menuId = 'primary-search-account-menu';
  const menuId2 = 'primary-search-login';

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          history.push('/profile');
          handleMenuClose();
        }}
      >
        Profile
      </MenuItem>
      <MenuItem
        onClick={() => {
          history.push('/setting');
          handleMenuClose();
        }}
      >
        My account
      </MenuItem>
      <MenuItem
        onClick={() => {
          logout();
          handleMenuClose();
        }}
      >
        Log out
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = user.isAuthenticated ? (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => history.push('/notifications')}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={unread} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
          onClick={() => history.push('/profile')}
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  ) : (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      id={menuId2}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Link
          to="/login"
          style={{ color: 'inherit', textDecoration: 'inherit' }}
        >
          <Typography color="inherit">LOG IN</Typography>
        </Link>
      </MenuItem>
      <MenuItem>
        <Link
          to="/singup"
          style={{ color: 'inherit', textDecoration: 'inherit' }}
        >
          <Typography color="inherit">SIGN UP</Typography>
        </Link>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1, minWidth: '400px' }}>
      <AppBar position="static">
        <Toolbar id="back-to-top-anchor">
          <Button sx={{ padding: '0' }}>
            <Link to="/">
              <img src={iconImage} alt="icon" />
            </Link>
          </Button>
          <Typography
            variant="h6"
            component="div"
            sx={{ width: 'auto' }}
            style={{
              transform: 'rotate(7deg)',
              fontFamily: 'Risque',
            }}
          >
            Talker
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleChange}
              onClick={() => setShowPopover(true)}
              onFocus={() => setShowPopover(true)}
              onBlur={() => setShowPopover(false)}
            />
            {showPopover && popOver}
          </Search>

          <Box sx={{ flexGrow: '1' }} />
          {user.isAuthenticated ? (
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                onClick={() => history.push({ pathname: '/home' })}
              >
                <HomeIcon />
              </IconButton>
              {!isLoading && (
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  onClick={() => history.push({ pathname: '/notifications' })}
                >
                  <Badge badgeContent={unread} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              )}
              {!isLoading && (
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar src={user.avatar} sx={{ width: 24, height: 24 }} />
                </IconButton>
              )}
            </Box>
          ) : (
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button color="inherit">
                <Link
                  to="/login"
                  style={{ color: 'inherit', textDecoration: 'inherit' }}
                >
                  <Typography color="inherit">LOG IN</Typography>
                </Link>
              </Button>
              <Button color="inherit">
                <Link
                  to="/signup"
                  style={{ color: 'inherit', textDecoration: 'inherit' }}
                >
                  <Typography color="inherit">SIGN UP</Typography>
                </Link>
              </Button>
            </Box>
          )}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
          <ToggleColorModeButton toggleColorMode={toggleColorMode} />
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <ScrollTop>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </Box>
  );
}

Nav.propTypes = {
  toggleColorMode: PropTypes.func.isRequired,
  user: userPropTypes.isRequired,
  logout: PropTypes.func.isRequired,
  searchUsersAndGroups: PropTypes.func.isRequired,
  search: PropTypes.shape({
    users: PropTypes.arrayOf(PropTypes.object),
    groups: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  search: state.search.results,
  isLoading: state.ui.isLoading,
});

export default connect(mapStateToProps, {
  getinfo,
  setCommonError,
  logout,
  searchUsersAndGroups,
})(Nav);
