import { Alert } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { object, string } from 'yup';
import linesImage from '../assets/lines.png';
import personImage from '../assets/person.png';
import {
  setLoginError,
  setLoginSubmitting, setLoginSuccess,
} from '../redux/ui';
import { login } from '../redux/users';
import { BlurBox } from './Landing';

function Login({
  error,
  login,
  setLoginError,
  setLoginSubmitting,
  setLoginSuccess,
}) {
  useEffect(() => {
    setLoginError(false);
    setLoginSubmitting(false);
    setLoginSuccess(false);
  }, []);
  return (
    <Box sx={{ flexGrow: 1 }} style={{ textAlign: 'center' }}>
      <Grid
        container
        spacing={2}
        sx={{ paddingLeft: '2rem', paddingTop: '2rem', minWidth: '400px' }}
      >
        <Grid item xs={12} md={4} style={{ margingleft: '1rem' }}>
          <BlurBox>
            <Box>
              <img src={personImage} alt="person" className="img" />
            </Box>
            <Box>
              <img src={linesImage} alt="lines" className="img" />
            </Box>
          </BlurBox>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={object({
              email: string()
                .required('Must not be empty')
                .email('Invalid Email address, Please check'),
              password: string()
                .required('Must not be empty')
                .min(6, 'at least 6 characters')
                .max(16, 'no more than 16 characters'),
            })}
            onSubmit={(values, { setSubmitting }) => {
              login(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form
                className="box"
                style={{
                  border: 'solid 1px rgba(255,255,255,0.7)',
                  maxWidth: '400px',
                  borderRadius: '1rem',
                  marginInline: 'auto',
                  marginTop: '2rem',
                }}
              >
                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      textAlign: 'center',
                    }}
                  >
                    <strong>Email or Password incorrect</strong>
                  </Alert>
                )}
                <Box className="box">
                  <Field
                    component={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                  />
                </Box>
                <div className="box">
                  <Field
                    component={TextField}
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                  />
                </div>
                <div className="box">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    color="primary"
                    variant="whiteButton"
                    fullWidth
                  >
                    Login
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Grid>
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

const mapStatesToProps = (state) => ({
  error: state.ui.error.login,
  success: state.ui.success.login,
  submitting: state.ui.submitting.login,
  user: state.user,
});

export default connect(mapStatesToProps, {
  setLoginError,
  setLoginSubmitting,
  setLoginSuccess,
  login,
})(Login);

Login.propTypes = {
  error: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  setLoginError: PropTypes.func.isRequired,
  setLoginSubmitting: PropTypes.func.isRequired,
  setLoginSuccess: PropTypes.func.isRequired,
};
