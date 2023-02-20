import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import React from 'react';

export default function Prompt({
  open, text, onClose, onSubmit,
}) {
  return (
    <React.Fragment>
      <Dialog open={open}>
        <DialogTitle>{text}</DialogTitle>
        <DialogActions>
          <React.Fragment>
            <Button
              onClick={onClose}
              color="inherit"
              sx={{ bgcolor: 'info.dark' }}
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              color="inherit"
              sx={{ bgcolor: 'error.dark' }}
            >
              Confirm
            </Button>
          </React.Fragment>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

Prompt.propTypes = {
  open: PropTypes.bool,
  text: PropTypes.string,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

Prompt.defaultProps = {
  open: false,
  text: '',
  onClose: () => {},
  onSubmit: () => {},
};
