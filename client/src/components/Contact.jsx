import { Box, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { StyledBadge } from './Friend';

export default function Contact({
  online, name, avatar, id,
}) {
  return (
    <Link
      to={`/user/profile/${id}`}
      style={{ color: 'inherit', textDecoration: 'inherit' }}
    >
      <Box
        sx={{
          marginBottom: '1.5rem',
          alignItems: 'center',
          display: 'flex',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
            cursor: 'pointer',
          },
        }}
      >
        <Box>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar alt="Remy Sharp" src={avatar} />
            </StyledBadge>
          ) : (
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar alt="Travis Howard" src={avatar} />
            </Badge>
          )}
        </Box>
        <Box
          sx={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography sx={{ color: 'inherit', marginLeft: '1rem' }}>
            {name}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
}

Contact.propTypes = {
  online: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
