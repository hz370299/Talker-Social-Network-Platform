import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Typography, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';

import React from 'react';

export default function Tag({ name, isEdit, onClose }) {
  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '0.5rem',
        paddingRight: '0.5rem',
        color: 'rgba(255,255,255,0.7)',
        marginRight: '0.5rem',
        marginBottom: '0.3rem',
      }}
    >
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <ControlPointIcon sx={{ marginRight: '0.3rem' }} />
        <Typography sx={{ fontSize: '12px' }}>{name}</Typography>
      </Box>
      {isEdit && (
        <IconButton onClick={onClose}>
          <CancelPresentationIcon />
        </IconButton>
      )}
    </Box>
  );
}

Tag.propTypes = {
  name: PropTypes.string.isRequired,
  isEdit: PropTypes.bool,
  onClose: PropTypes.func,
};

Tag.defaultProps = {
  isEdit: false,
  onClose: () => {},
};
