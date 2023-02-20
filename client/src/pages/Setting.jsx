import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import * as React from 'react';
import { useEffect } from 'react';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch } from 'react-redux';
import ButtonList from '../components/ButtonList';
import { changePassword, deactivateAccount } from '../redux/users';
import Prompt from '../components/Prompt';

export const GlassBox = styled('div')({
  backgroundColor: 'rgba(255,255,255,0.2)',
  borderRadius: '2rem',
  padding: '2rem',
});

export default function SettingPage() {
  const [open, setOpen] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const prevPasswordRef = React.useRef();
  const newPasswordRef = React.useRef();
  const dispatch = useDispatch();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    window.document.documentElement.scrollTop = 0;
  }, []);

  const onChangePassword = ({ prevPassword, newPassword }) => {
    dispatch(changePassword({ prevPassword, newPassword }));
    handleClose();
  };

  const onOpenDeactivate = () => {
    setShowDelete(true);
  };
  const onCloseDeactivate = () => {
    setShowDelete(false);
  };

  const onDeactivate = () => {
    dispatch(deactivateAccount());
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={2}
        sx={{
          paddingLeft: '2rem',
          paddingTop: '2rem',
          minWidth: '400px',
          paddingBottom: '6rem',
        }}
      >
        <Grid item xs={12} md={3} style={{ margingleft: '1.5rem' }}>
          <Box
            sx={{
              position: 'sticky',
              top: '50px',
              maxWidth: '350px',
              marginInline: 'auto',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', paddingBottom: '0.8rem' }}
            >
              Setting
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {['Security', 'Deactivate'].map((v, i) => (
                <Button
                  sx={{
                    mb: 2,
                    color: 'inherit',
                    backgroundColor:
                      v === 'Deactivate'
                        ? (theme) => theme.palette.error.main
                        : 'rgba(255,255,255,0.2)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.5)',
                    },
                    borderRadius: 3,
                    p: 1.5,
                    pl: 4,
                    justifyContent: 'space-between',
                    fontWeight: 'bold',
                    fontSize: 17,
                  }}
                  key={i}
                  onClick={v === 'Deactivate' ? onOpenDeactivate : () => {}}
                >
                  {v}
                  <ArrowForwardIosIcon />
                </Button>
              ))}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: '750px', marginInline: 'auto' }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', paddingBottom: '0.8rem' }}
            >
              Security
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <TextField
                id="filled-basic"
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                defaultValue="***********"
                disabled
              />
              <Button
                color="inherit"
                sx={{ bgcolor: 'info.dark', width: '20%' }}
                onClick={handleClickOpen}
              >
                Change
                {' '}
              </Button>
            </Box>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Change Password</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To Change the password, you must provide original password
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="password1"
                  label="Current Password"
                  type="password"
                  fullWidth
                  variant="standard"
                  inputRef={prevPasswordRef}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="password2"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="standard"
                  inputRef={newPasswordRef}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                  onClick={() => {
                    onChangePassword({
                      prevPassword: prevPasswordRef.current.value,
                      newPassword: newPasswordRef.current.value,
                    });
                  }}
                >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
            <Prompt
              open={showDelete}
              onClose={onCloseDeactivate}
              onSubmit={onDeactivate}
              text="Are you sure to deactivate your account? It can not be withdrawn"
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              position: 'sticky',
              top: '50px',
              maxWidth: '350px',
              marginInline: 'auto',
            }}
          >
            <ButtonList current="Setting" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
