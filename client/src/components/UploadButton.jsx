import PhotoCamera from '@mui/icons-material/PhotoCamera';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React from 'react';

const Input = styled('input')({
  display: 'none',
});

const UploadButton = React.forwardRef(({
  uploadHandler, disabled, single, id,
}, ref) => (
  <label htmlFor={id}>
    <Input
      accept="image/*,video/*,audio/*"
      ref={ref}
      id={id}
      type="file"
      onChange={uploadHandler}
      multiple={!single}
    />
    <IconButton color="inherit" aria-label="upload picture" component="span" disabled={disabled}>
      <PhotoCamera />
    </IconButton>
  </label>
));

export default UploadButton;

UploadButton.propTypes = {
  uploadHandler: PropTypes.func,
  disabled: PropTypes.bool,
  single: PropTypes.bool,
  id: PropTypes.string,
};

UploadButton.defaultProps = {
  uploadHandler: () => {},
  disabled: false,
  single: false,
  id: 'icon-button-file',
};
