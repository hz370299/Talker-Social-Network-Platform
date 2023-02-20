import React from 'react';
import { Skeleton, Box } from '@mui/material';

export default function FriendSkeleton() {
  return (
    <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
      <Skeleton sx={{ width: 40, height: 40, mr: 2 }} variant="circular" />
      <Box sx={{ flexGrow: 1 }}>
        <Skeleton sx={{ width: '60%' }} />
        <Skeleton />
      </Box>
    </Box>
  );
}
