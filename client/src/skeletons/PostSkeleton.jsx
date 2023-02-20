import {
  Box, Skeleton,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import * as React from 'react';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

export default function PostSkeleton() {
  return (
    <Card
      sx={{
        maxWidth: '100%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginTop: '1.5rem',
      }}
    >
      <CardHeader
        avatar={<Skeleton sx={{ width: 56, height: 56 }} variant="circular" />}
        action={<Skeleton />}
        title={<Skeleton sx={{ width: '50%' }} />}
        subheader={<Skeleton sx={{ width: '30%' }} />}
      />
      <Box sx={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
        <Skeleton
          sx={{ width: '100%', height: '500px' }}
          variant="rectangular"
        />
      </Box>
      <CardActions
        disableSpacing
        sx={{ paddingLeft: '1.5rem', paddingRight: '2rem', paddingBottom: 0 }}
      >
        <Skeleton variant="circular" sx={{ height: 32, width: 32 }} />
        <Skeleton variant="circular" sx={{ height: 32, width: 32, ml: 2 }} />
      </CardActions>
      <CardActions
        disableSpacing
        sx={{ paddingLeft: '2rem', paddingRight: '2rem', paddingBottom: '0' }}
      >
        <Skeleton sx={{ width: '30%' }} />
      </CardActions>
    </Card>
  );
}
