import React from 'react';
import { Skeleton } from '@mui/material';

export default function NavSkeleton() {
  return [...Array(6)].map(() => (
    <Skeleton
      sx={{
        width: '80%', borderRadius: 4, height: '3rem', mb: 1, mt: '3rem', ml: 1,
      }}
      variant="rectangular"
    />
  ));
}
