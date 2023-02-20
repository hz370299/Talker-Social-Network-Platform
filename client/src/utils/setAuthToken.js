import axios from 'axios';

export default function setAuthToken(token) {
  if (token) {
    // apply token to authorization
    axios.defaults.headers.common.Authorization = token;
  } else {
    // delete token
    delete axios.defaults.headers.common.Authorization;
  }
}
