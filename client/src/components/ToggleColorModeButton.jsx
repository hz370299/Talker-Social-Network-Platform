import React from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

export default function ToggleColorModeButton({ toggleColorMode }) {
  const theme = useTheme();
  return (
    <IconButton
      sx={{ ml: 1 }}
      onClick={toggleColorMode}
      color="inherit"
    >
      {theme.palette.mode === 'dark' ? (
        <Brightness7Icon />
      ) : (
        <Brightness4Icon />
      )}
    </IconButton>
  );
}

ToggleColorModeButton.propTypes = {
  toggleColorMode: PropTypes.func.isRequired,
};
