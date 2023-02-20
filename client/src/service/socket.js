import { io } from 'socket.io-client';

const socket = io('', {
  reconnectionDelayMax: 10000,
  extraHeaders: {
    Authorization: localStorage.getItem('jwtToken'),
  },
  reconnection: false
});

export default socket;
