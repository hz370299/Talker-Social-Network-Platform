import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { number, object, string } from 'yup';
import {
  setRegistrationError,
  setRegistrationSubmitting,
  setRegistrationSuccess,
} from '../redux/ui';
import { register } from '../redux/users';
import './Home.css';

const steps = ['Create Acount', 'Set up Profile'];

function Signup({
  success,
  error,
  submitting,
  register,
  setRegistrationError,
  setRegistrationSubmitting,
  setRegistrationSuccess,
}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  useEffect(() => {
    setRegistrationError(false);
    setRegistrationSubmitting(false);
    setRegistrationSuccess(false);
  }, []);
  return (
    <Box sx={{ flexGrow: 1 }} style={{ textAlign: 'center' }}>
      <Grid
        container
        spacing={2}
        sx={{ paddingLeft: '2rem', paddingTop: '2rem', minWidth: '400px' }}
      >
        <Grid item xs={12} md={4} style={{ margingleft: '1rem' }}>
          {success && (
            <Alert severity="success">
              <strong>Register Successfully, Go Login</strong>
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ textAlign: 'center' }}>
              <strong>Register Failed</strong>
            </Alert>
          )}
          <Formik
            initialValues={{
              email: '',
              password: '',
              password2: '',
              age: '',
              firstName: '',
              lastName: '',
              phone: '',
              gender: '',
            }}
            validationSchema={object({
              email: string()
                .required('Must not be empty')
                .email('Invalid Email address, Please check'),
              password: string()
                .required('Must not be empty')
                .min(6, 'at least 6 characters')
                .max(16, 'no more than 16 characters'),
              password2: string()
                .required('Must not be empty')
                .min(6, 'at least 6 characters')
                .max(16, 'no more than 16 characters'),
              age: number().required('Must not be empty').min(0).max(150),
              firstName: string().required(),
              lastName: string().required(),
              phone: string()
                .required()
                .matches(
                  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
                  'Phone number is not valid',
                ),
              gender: string().required(),
            })}
            onSubmit={(values, { setFieldError, setSubmitting }) => {
              if (values.password !== values.password2) {
                setFieldError('password2', 'Password must be the same');
                setSubmitting(false);
              } else {
                let cleanedFirstName = '';
                let cleanedLastName = '';
                values.firstName.split('').forEach((v, i) => {
                  if (i === 0) {
                    cleanedFirstName += v.toUpperCase();
                  } else {
                    cleanedFirstName += v.toLowerCase();
                  }
                });
                values.lastName.split('').forEach((v, i) => {
                  if (i === 0) {
                    cleanedLastName += v.toUpperCase();
                  } else {
                    cleanedLastName += v.toLowerCase();
                  }
                });
                const name = `${cleanedFirstName} ${cleanedLastName}`;
                const payload = {
                  name,
                  email: values.email,
                  password: values.password,
                  gender: values.gender,
                  age: values.age,
                  phone: values.phone,
                };
                register(payload);
                setSubmitting(false);
              }
            }}
          >
            {({ errors }) => (
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
                <Box sx={{ width: '100%' }}>
                  <Stepper activeStep={activeStep}>
                    {steps.map((label, i) => {
                      let valid = false;
                      if (i === 0) {
                        valid = !errors.email
                          && !errors.password
                          && !errors.password2
                          && true;
                      } else {
                        valid = !errors.firstName
                          && !errors.lastName
                          && !errors.phone
                          && !errors.gender
                          && !errors.age
                          && true;
                      }
                      return (
                        <Step key={label}>
                          <StepLabel error={!valid}>{label}</StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    Step
                    {activeStep + 1}
                  </Typography>
                </Box>
                {activeStep === 1 ? (
                  <Box>
                    <Box className="box">
                      <Field
                        component={TextField}
                        label="Firstname"
                        name="firstName"
                        fullWidth
                      />
                    </Box>
                    <Box className="box">
                      <Field
                        component={TextField}
                        label="Lastname"
                        name="lastName"
                        fullWidth
                      />
                    </Box>
                    <Box className="box">
                      <Field
                        component={TextField}
                        label="Phone"
                        name="phone"
                        fullWidth
                      />
                    </Box>
                    <Box className="box">
                      <FormControl fullWidth>
                        <Field
                          component={Select}
                          name="gender"
                          id="sex"
                          labelId="sex-simple"
                          label="Gender"
                        >
                          <MenuItem value="">/</MenuItem>
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                        </Field>
                      </FormControl>
                    </Box>
                    <Box className="box">
                      <Field
                        component={TextField}
                        label="Age"
                        name="age"
                        fullWidth
                      />
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Box className="box">
                      <Field
                        component={TextField}
                        name="email"
                        label="Email"
                        fullWidth
                      />
                    </Box>
                    <Box className="box">
                      <Field
                        component={TextField}
                        label="Password"
                        name="password"
                        type="password"
                        fullWidth
                      />
                    </Box>
                    <Box className="box">
                      <Field
                        component={TextField}
                        label="Confirm Password"
                        name="password2"
                        type="password"
                        fullWidth
                      />
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    variant="whiteButton"
                    startIcon={<ArrowBackIcon />}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  {activeStep < steps.length - 1 && (
                    <Button
                      onClick={handleNext}
                      variant="whiteButton"
                      endIcon={<ArrowForwardIcon />}
                    >
                      Next
                    </Button>
                  )}
                  {activeStep === steps.length - 1 && (
                    <LoadingButton
                      endIcon={<SendIcon />}
                      loading={submitting}
                      loadingPosition="end"
                      variant="whiteButton"
                      type="submit"
                    >
                      Register
                    </LoadingButton>
                  )}
                </Box>
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

const mapStateToProps = (state) => ({
  error: state.ui.error.registration,
  success: state.ui.success.registration,
  submitting: state.ui.submitting.registration,
});

export default connect(mapStateToProps, {
  setRegistrationError,
  setRegistrationSubmitting,
  setRegistrationSuccess,
  register,
})(Signup);

Signup.propTypes = {
  error: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  register: PropTypes.func.isRequired,
  setRegistrationError: PropTypes.func.isRequired,
  setRegistrationSubmitting: PropTypes.func.isRequired,
  setRegistrationSuccess: PropTypes.func.isRequired,
};
