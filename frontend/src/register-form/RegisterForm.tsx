import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import './RegisterForm.css';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { InputAdornment } from '@mui/material';
import { Formik } from 'formik';
import { useCallback, useMemo } from 'react';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../api/ApiProvider';

type FormValues = {
  username: string;
  email: string | undefined;
  password: string;
  confirmPassword: string;
  role: string;
};

function RegisterForm() {
  const navigate = useNavigate();
  const apiClient = useApi();

  const onSubmit = useCallback(
    (values: FormValues, formik: any) => {
      apiClient.register(values).then((response) => {
        if (response.success) {
          navigate('/home');
        } else {
          formik.setFieldError('username', 'Registration failed');
        }
      });
    },
    [apiClient, navigate]
  );

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        username: yup.string().required('Username cannot be empty'),
        email: yup
          .string()
          .email('Invalid email')
          .required('Email cannot be empty'),
        password: yup.string().required('Password cannot be empty'),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('password')], 'Passwords must match')
          .required('Confirm Password cannot be empty'),
      }),
    []
  );

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        confirmPassword: '',
        role: 'USER',
        email: '',
      }}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnBlur
      validateOnChange
    >
      {(formik: any) => (
        <Card className="register-card">
          <CardContent>
            <form
              id="registerForm"
              className="Register-form"
              onSubmit={formik.handleSubmit}
            >
              <Typography
                component="h1"
                variant="h4"
                align="center"
                color="Black"
                gutterBottom
                className="header"
              >
                {'Register'}
              </Typography>

              <TextField
                name="username"
                label="Username"
                variant="outlined"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.username && !!formik.errors.username}
                helperText={formik.touched.username && formik.errors.username}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      style={{ paddingRight: '8px' }}
                    >
                      <PersonAddIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                name="email"
                label="Email"
                variant="outlined"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.email && !!formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      style={{ paddingRight: '8px' }}
                    >
                      <PersonAddIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.password && !!formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      style={{ paddingRight: '8px' }}
                    >
                      <PersonAddIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                variant="outlined"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={
                  formik.touched.confirmPassword &&
                  !!formik.errors.confirmPassword
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      style={{ paddingRight: '8px' }}
                    >
                      <PersonAddIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Register
              </Button>
              <Typography component="h3" align="center">
                {'Already have an account? '}
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </Typography>
            </form>
          </CardContent>
        </Card>
      )}
    </Formik>
  );
}

export default RegisterForm;
