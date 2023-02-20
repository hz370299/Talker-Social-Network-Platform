import React from 'react';
import {
  Box,
  AppBar, IconButton, Toolbar, Typography,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

export default function Footer() {
  return (
    <Box
      sx={{ flexGrowth: 1, minWidth: '400px' }}
      style={{
        width: '100%',
        position: 'absolute',
        bottom: '0',
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="subtitle2" component="div" sx={{ flexGrow: 1 }}>
            COPYRIGHT@Talker
          </Typography>
          <Typography color="inherit" variant="subtitle1">
            Subscribe:
          </Typography>
          <IconButton>
            <FacebookIcon />
          </IconButton>
          <IconButton>
            <InstagramIcon />
          </IconButton>
          <IconButton>
            <TwitterIcon />
          </IconButton>
        </Toolbar>

      </AppBar>
    </Box>
  );
}
