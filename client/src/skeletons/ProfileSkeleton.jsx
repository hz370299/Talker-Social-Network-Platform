import Skeleton from '@mui/material/Skeleton';
import * as React from 'react';

export default function ProfileSkeleton() {
  return (
    <>
      <Skeleton variant="text" />
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rectangular" width={210} height={118} />
    </>
  );
}
