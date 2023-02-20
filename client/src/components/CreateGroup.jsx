import {
  Alert,
  Avatar,
  Button,
  CircularProgress,
  IconButton,
} from '@mui/material';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Tag from './Tag';
import UploadButton from './UploadButton';

export default function CreateGroup({
  onSubmit,
  error,
  isSubmitting,
  open,
  onClose,
  isPublic,
}) {
  const [file, setFile] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [tags, setTags] = React.useState([]);
  const nameRef = React.useRef();
  const bioRef = React.useRef();
  const tagRef = React.useRef();

  const onAddTag = () => {
    setTags((prev) => [...prev, tagRef.current.value]);
    tagRef.current.value = '';
  };

  const onChangeAvatar = (e) => {
    setFile(e.target.files[0]);
  };
  useEffect(() => {
    let fileToUrl = '';
    if (file) {
      fileToUrl = URL.createObjectURL(file);
      setUrl(fileToUrl);
    }
    return () => {
      if (fileToUrl) {
        URL.revokeObjectURL(fileToUrl);
      }
    };
  }, [file]);
  return (
    <React.Fragment>
      <Dialog open={open}>
        <DialogTitle>
          {`Create ${isPublic ? 'Public' : 'Private'} Group`}
        </DialogTitle>
        <DialogContent>
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'end',
              }}
            >
              <Avatar src={url} sx={{ width: 100, height: 100 }} />
              <Box>
                <UploadButton
                  uploadHandler={onChangeAvatar}
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
            inputRef={nameRef}
            fullWidth
            variant="standard"
            autoComplete="off"
          />
          <TextField
            autoFocus
            margin="dense"
            id="bio"
            label="bio"
            type="text"
            inputRef={bioRef}
            fullWidth
            variant="standard"
            autoComplete="off"
          />
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <TextField
              autoFocus
              margin="dense"
              id="tag"
              label="tags"
              type="text"
              fullWidth
              variant="standard"
              inputRef={tagRef}
              autoComplete="off"
            />
            <IconButton color="info" onClick={onAddTag}>
              <AddIcon />
            </IconButton>
          </Box>
          <Box>
            {tags.map((v, i) => (
              <Tag
                key={i}
                name={v}
                isEdit
                onClose={() => {
                  setTags((prev) => {
                    if (prev.length === 1) {
                      setTags([]);
                    } else {
                      const next = prev.slice(0, i).concat(prev.slice(i + 1));
                      setTags(next);
                    }
                  });
                }}
              />
            ))}
          </Box>
        </DialogContent>

        <DialogActions>
          {isSubmitting ? (
            <CircularProgress />
          ) : (
            <React.Fragment>
              {' '}
              <Button onClick={onClose}>Cancel</Button>
              <Button
                onClick={() => {
                  const formData = new FormData();
                  formData.append('avatar', file);
                  formData.append('name', nameRef.current.value);
                  formData.append('bio', bioRef.current.value);
                  formData.append('tags', tags);
                  onSubmit(formData);
                }}
              >
                Create
              </Button>
            </React.Fragment>
          )}
        </DialogActions>
        {error && (
          <DialogActions>
            {' '}
            <Alert
              severity="error"
              sx={{
                textAlign: 'center',
              }}
            >
              <strong>Create Fail!</strong>
            </Alert>
          </DialogActions>
        )}
      </Dialog>
    </React.Fragment>
  );
}

CreateGroup.propTypes = {
  onSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
  error: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  isPublic: PropTypes.bool,
};

CreateGroup.defaultProps = {
  onSubmit: () => {},
  isSubmitting: false,
  error: false,
  open: false,
  onClose: () => {},
  isPublic: true,
};
