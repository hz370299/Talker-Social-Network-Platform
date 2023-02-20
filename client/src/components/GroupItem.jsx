import { Box, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import Tag from './Tag';

export default function GroupItem({
  name,
  avatar,
  groupId,
  tags,
  active,
  notifications,
}) {
  return (
    <Box
      sx={{
        marginBottom: '1.5rem',
        display: 'flex',
        bgcolor: active ? 'action.selected' : '',
      }}
    >
      <Box>
        <Button>
          <Link to={`/group/profile/${groupId}`}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={notifications}
              color="primary"
            >
              <Avatar
                alt="Travis Howard"
                src={avatar}
                sx={{ width: 56, height: 56 }}
              />
            </Badge>
          </Link>
        </Button>
      </Box>
      <Box sx={{ marginTop: '0.3rem', flexGrow: 1 }}>
        <Typography
          sx={{
            marginLeft: '1rem',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
          variant="subtitle1"
        >
          {name}
        </Typography>
        <Box sx={{ marginLeft: '1rem', display: 'flex', flexWrap: 'wrap' }}>
          {tags.map((v, i) => (
            <Tag name={v} key={i} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

GroupItem.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
  groupId: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  active: PropTypes.bool,
  notifications: PropTypes.number,
};
GroupItem.defaultProps = {
  tags: [],
  active: false,
  name: '',
  avatar: '',
  groupId: '',
  notifications: 0,
};
