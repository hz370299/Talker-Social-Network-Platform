import PropTypes from 'prop-types';
import userPropTypes from './user';

const commentPropTypes = PropTypes.shape({
  id: PropTypes.string,
  commenter: userPropTypes,
  content: PropTypes.string,
  createdAt: PropTypes.string,
});

export default commentPropTypes;
