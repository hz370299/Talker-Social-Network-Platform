import {
  Alert, Avatar, Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import ButtonList from '../components/ButtonList';
import Contact from '../components/Contact';
import Profile from '../components/Profile';
import UploadButton from '../components/UploadButton';
import { updateProfile } from '../redux/users';
import FriendSkeleton from '../skeletons/FriendSkeleton';
import './Home.css';

export const groups = [
  {
    name: 'Game Group',
    avatar: `./${5}.jpg`,
    message: 'Nothing to say about',
    groupId: '21312dasd2212222',
    category: ['Sport', 'Adventure'],
  },
  {
    name: 'Game Group',
    avatar: `./${6}.jpg`,
    message: 'Nothing to say about itdsadasd dsadsadasdasdasddsadsda',
    groupId: '21312dasd2212222',
    category: ['Game', 'Valorant'],
  },
  {
    name: 'Nerd Group',
    avatar: `./${7}.jpg`,
    message: 'Nothing to say about',
    groupId: '21312dasd2212222',
    category: ['Study'],
  },
];

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isLoading = useSelector((state) => state.ui.isLoading);
  const isSubmitting = useSelector((state) => state.ui.submitting.update);
  const updateError = useSelector((state) => state.ui.error.update);
  const [open, setOpen] = React.useState(false);
  const nameRef = React.useRef();
  const bioRef = React.useRef();
  const [gender, setGender] = React.useState(user.gender.toLowerCase() || '');
  const ageRef = React.useRef();
  const phoneRef = React.useRef();
  const [avatar, setAvatar] = React.useState('');
  const avatarRef = React.useRef();
  const backgroundImgRef = React.useRef();
  const [backgroundImg, setBackgroundImg] = React.useState('');
  const handleClickOpen = () => {
    setOpen(true);
  };
  const onGenderChange = (e) => {
    setGender(e.target.value);
  };
  const handleClose = () => {
    setAvatar(user.avatar);
    setBackgroundImg(user.backgroundImg);
    setOpen(false);
  };
  const onChangeAvatar = (e) => {
    setAvatar(URL.createObjectURL(e.target.files[0] || user.avatar));
  };
  const onChangeBackgroundImg = (e) => {
    setBackgroundImg(URL.createObjectURL(e.target.files[0] || user.backgroundImg));
  };

  const onSave = async () => {
    const formData = new FormData();
    formData.append('name', nameRef.current.value);
    formData.append('bio', bioRef.current.value);
    formData.append('gender', gender);
    formData.append('age', ageRef.current.value);
    formData.append('phone', phoneRef.current.value);
    formData.append('avatar', avatarRef.current.files[0] || user.avatar);
    formData.append('backgroundImg', backgroundImgRef.current.files[0] || user.backgroundImg);
    dispatch(updateProfile(formData));
  };

  useEffect(() => () => {
    URL.revokeObjectURL(avatar);
    URL.revokeObjectURL(backgroundImg);
  });
  useEffect(() => {
    window.document.documentElement.scrollTop = 0;
    setAvatar(user.avatar);
    setBackgroundImg(user.backgroundImg);
    setGender(user.gender.toLowerCase());
  }, [user]);
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
              Contact
            </Typography>
            <Box
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '2rem',
                padding: '2rem',
                height: '70vh',
              }}
            >
              {isLoading
                ? [...Array(5)].map((_, i) => <FriendSkeleton key={i} />)
                : user.friends.map((v) => (
                  <Contact
                    name={v.name}
                    id={v.id}
                    avatar={v.avatar}
                    online={v.status === 'online'}
                    key={v.id}
                  >
                    {' '}
                  </Contact>
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
              My Profile
            </Typography>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Profile user={user} isFriend edible onEdit={handleClickOpen} />
            )}
          </Box>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent sx={{ position: 'relative' }}>
              <img
                src={backgroundImg || user.backgroundImg}
                alt="background"
                style={{ height: '200px', width: '100%', marginBottom: '50px' }}
              />
              <Box sx={{ position: 'absolute', right: 20, top: '100px' }}>
                <UploadButton
                  ref={backgroundImgRef}
                  uploadHandler={onChangeBackgroundImg}
                  single
                  id="backimg"
                />
              </Box>
              <Box sx={{ position: 'absolute', top: '150px', left: '50px' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'end',
                  }}
                >
                  <Avatar
                    src={avatar || user.avatar}
                    sx={{ width: 100, height: 100 }}
                  />
                  <Box sx={{}}>
                    <UploadButton
                      uploadHandler={onChangeAvatar}
                      ref={avatarRef}
                      single
                      id="avatarimg"
                    />
                  </Box>
                </Box>
              </Box>

              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                defaultValue={user.name}
                inputRef={nameRef}
                fullWidth
                variant="standard"
              />
              <FormControl fullWidth sx={{ mt: 1, mb: 1 }}>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={gender}
                  label="Gender"
                  autoFocus
                  defaultValue={gender || user.gender.toLowerCase()}
                  onChange={onGenderChange}
                >
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="neutral">Neutral</MenuItem>
                </Select>
              </FormControl>
              <TextField
                autoFocus
                margin="dense"
                id="bio"
                label="bio"
                type="text"
                inputRef={bioRef}
                defaultValue={user.bio}
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="age"
                label="age"
                inputRef={ageRef}
                type="number"
                defaultValue={user.age}
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="phone"
                label="phone"
                inputRef={phoneRef}
                type="text"
                defaultValue={user.phone}
                fullWidth
                variant="standard"
              />
            </DialogContent>

            <DialogActions>
              {isSubmitting ? (
                <CircularProgress />
              ) : (
                <React.Fragment>
                  {' '}
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={onSave}>Save</Button>
                </React.Fragment>
              )}
            </DialogActions>
            {updateError && (
              <DialogActions>
                {' '}
                <Alert
                  severity="error"
                  sx={{
                    textAlign: 'center',
                  }}
                >
                  <strong>Update Fail!</strong>
                </Alert>
              </DialogActions>
            )}
          </Dialog>
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
            <ButtonList current="profile" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
