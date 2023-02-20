import PropTypes from 'prop-types';

const userPropTypes = PropTypes.shape({
  id: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  email: PropTypes.string,
  name: PropTypes.string,
  status: PropTypes.string,
  friends: PropTypes.arrayOf(PropTypes.object),
  groups: PropTypes.arrayOf(PropTypes.object),
  notifications: PropTypes.arrayOf(PropTypes.object),
  posts: PropTypes.arrayOf(PropTypes.object),
  gender: PropTypes.string,
  bio: PropTypes.string,
  avatar: PropTypes.string,
  backgroundImg: PropTypes.string,
});

export default userPropTypes;
