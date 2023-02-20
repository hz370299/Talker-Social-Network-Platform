import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Typograph from '@mui/material/Typography';
import { styled } from '@mui/system';
import * as React from 'react';
import { Link } from 'react-router-dom';
import happyFaceIamge from '../assets/happyFace.png';
import hiImage from '../assets/hi.png';
import linesImage from '../assets/lines.png';
import personImage from '../assets/person.png';
import './Home.css';

export const BlurBox = styled(Box)(() => ({
  background: 'rgba(255, 255, 255, 0.3)',
  border: 'solid 1.5px rgba(255, 255, 255, 0.6)',
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  padding: '2rem',
  maxWidth: '400px',
  marginInline: 'auto',
}));

export default function Landing() {
  return (
    <Box sx={{ flexGrow: 1 }} style={{ textAlign: 'center' }}>
      <Grid
        container
        spacing={2}
        sx={{ paddingLeft: '2rem', paddingTop: '2rem', minWidth: '400px' }}
      >
        <Fade in>
          <Grid item xs={12} md={4} style={{ margingleft: '1rem' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}
            >
              <Box sx={{ width: '170px', height: '170px' }}>
                <img src={hiImage} alt="h1 with bubble" className="img" />
              </Box>
              <Box sx={{ width: '170px', height: '170px' }}>
                <img src={happyFaceIamge} alt="happy face" className="img" />
              </Box>
            </Box>

            <BlurBox>
              <Box>
                <img src={personImage} alt="person" className="img" />
              </Box>
              <Box>
                <img src={linesImage} alt="lines" className="img" />
              </Box>
            </BlurBox>

            <Typograph
              sx={{
                fontFamily: 'Rochester',
                paddingY: '1rem',
                paddingX: '0.5rem',
                color: 'white',
              }}
              variant="h4"
            >
              Talker, an amazing platform that combined chatting and streaming
              together, in the mean while, provides an unbelievable experience
              for users
            </Typograph>

            <Button variant="whiteButton" sx={{ marginTop: '2rem' }}>
              <Link
                to="login"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Typograph variant="subtitle1">GET STARTED</Typograph>
              </Link>
            </Button>
          </Grid>
        </Fade>
        <Grid item xs={12} md={8}>
          <Box sx={{ width: '100%', maxWidth: '700px', marginInline: 'auto' }}>
            <img
              src="./background.png"
              style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              alt="background"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
