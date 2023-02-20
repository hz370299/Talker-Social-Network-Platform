import React from 'react';
import PropTypes from 'prop-types';
import Friend from './Friend';

export default function FriendList({ friends }) {
  return friends.map((v) => (
    <Friend
      online={v.online}
      name={v.name}
      avatar={v.avatar}
      live={v.live}
      key={v.id}
    />
  ));
}

FriendList.propTypes = {
  friends: PropTypes.arrayOf(PropTypes.object).isRequired,
};
