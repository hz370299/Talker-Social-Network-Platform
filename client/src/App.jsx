import { Box, CssBaseline } from '@mui/material';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import jwtDecode from 'jwt-decode';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import Footer from './components/Footer';
import Nav from './components/Nav';
import ChatPage from './pages/Chat';
import CurrentGroup from './pages/CurrentGroup';
import GroupChat from './pages/GroupChat';
import GroupPage from './pages/GroupPage';
import Grouppost from './pages/Grouppost';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import NotificationPage from './pages/NotificationPage';
import PrivateChat from './pages/PrivateChat';
import ProfilePage from './pages/ProfilePage';
import SearchGroup from './pages/SearchGroup';
import SettingPage from './pages/Setting';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';
import { setCommonError } from './redux/ui';
import {
  addOneNotification, friendOffline,
  friendOnline,
  getinfo,
  setIsAuthenticated,
  setUser,
} from './redux/users';
import socket from './service/socket';
import setAuthToken from './utils/setAuthToken';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function MyApp() {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.ui.error.common);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  useEffect(() => {
    if (localStorage.jwtToken) {
      // Set auth token header auth
      setAuthToken(localStorage.jwtToken);
      // Decode token and get user info
      const decoded = jwtDecode(localStorage.jwtToken);
      // Set user and isAuthenticated
      dispatch(setUser(decoded));
      dispatch(setIsAuthenticated(true));
      // check if token expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        // logout user
        // dispatch(logout());
        // clear local storage token
        localStorage.removeItem('jwtToken');
        // Redirect to login page
        window.location.href = '/login';
      }
    }
  }, []);

  useEffect(() => {
    const onFriendOnline = (userId) => {
      dispatch(friendOnline(userId));
    };
    const onFriendOffline = (userId) => {
      dispatch(friendOffline(userId));
    };
    const onAddNotification = (notification) => {
      dispatch(addOneNotification(notification));
    };
    if (isAuthenticated) {
      dispatch(setCommonError(false));
      dispatch(getinfo());
      socket.on('FRIEND_ONLINE', onFriendOnline);
      socket.on('FRIEND_OFFLINE', onFriendOffline);
      socket.on('NEW_NOTIFICATION', onAddNotification);
    }
    return () => {
      if (isAuthenticated) {
        socket.off('FRIEND_ONLINE', onFriendOnline);
        socket.off('FRIEND_OFFLINE', onFriendOffline);
        socket.off('NEW_NOTIFICATION', onAddNotification);
      }
    };
  }, [isAuthenticated]);
  return (
    <Router>
      <Box sx={{ position: 'relative', minHeight: '120vh' }}>
        <Nav theme={theme} toggleColorMode={colorMode.toggleColorMode} />
        {error && (
          <Alert
            severity="error"
            sx={{
              textAlign: 'center',
            }}
          >
            <strong>Fetching Error!</strong>
          </Alert>
        )}
        <Switch>
          <Route exact path="/home">
            {isAuthenticated ? <Home /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/notifications">
            {isAuthenticated ? <NotificationPage /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/profile">
            {isAuthenticated ? <ProfilePage /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/user/profile/:id">
            {isAuthenticated ? <UserProfile /> : <Redirect to="/login" />}
          </Route>

          <Route exact path="/login">
            {isAuthenticated ? <Redirect to="/home" /> : <Login />}
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/chat/:id">
            {isAuthenticated ? <PrivateChat /> : <Redirect to="/" />}
          </Route>
          <Route path="/chat">
            {isAuthenticated ? <ChatPage /> : <Redirect to="/" />}
          </Route>
          <Route path="/search/group/profile/:id">
            {isAuthenticated ? <SearchGroup /> : <Redirect to="/" />}
          </Route>
          <Route path="/group/profile/:id">
            {isAuthenticated ? <CurrentGroup /> : <Redirect to="/" />}
          </Route>
          <Route path="/group/chat/:id">
            {isAuthenticated ? <GroupChat /> : <Redirect to="/" />}
          </Route>
          <Route path="/group/post/:id">
            {isAuthenticated ? <Grouppost /> : <Redirect to="/" />}
          </Route>
          <Route path="/group">
            {isAuthenticated ? <GroupPage /> : <Redirect to="/" />}
          </Route>
          <Route path="/setting">
            {isAuthenticated ? <SettingPage /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/">
            {isAuthenticated ? <Redirect to="/home" /> : <Landing />}
          </Route>
        </Switch>
        <Footer />
      </Box>
    </Router>
  );
}

export default function ToggleColorMode() {
  const [mode, setMode] = React.useState('dark');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () => createTheme({
      palette: {
        mode: 'dark',
        background: {
          default: '#000',
        },
        // text: {
        //   primary: '#fff',
        //   secondary: 'rgba(255,255,255,0.7)',
        //   disabled: 'rgba(255,255,255,0.5)',
        //   icon: 'rgba(255,255,255,0.12)',
        // },
        // divider: 'rgba(255,255,255,0.12)',
      },
      components: {
        MuiButton: {
          variants: [
            {
              props: {
                variant: 'whiteButton',
              },
              style: {
                color: 'white',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': {
                  borderColor: 'white',
                },
                '&:focus': {
                  borderColor: '#fff',
                },
              },
            },
          ],
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: `${mode === 'light' ? '#1e81b0' : ''}`,
            },
          },
        },
      },
    }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MyApp />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
