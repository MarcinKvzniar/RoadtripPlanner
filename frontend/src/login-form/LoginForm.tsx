import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import './LoginForm.css';
import LoginIcon from '@mui/icons-material/Login';
import { InputAdornment } from '@mui/material';
import { Formik } from 'formik';
import { useCallback, useMemo } from 'react';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../api/ApiProvider';

type FormValues = {
  username: string;
  password: string;
};

function LoginForm() {
  const navigate = useNavigate();
  const apiClient = useApi();

  const onSubmit = useCallback(
    (values: FormValues, formik: any) => {
      apiClient.login(values).then((response) => {
        if (response.success) {
          navigate('/home');
        } else {
          formik.setFieldError('username', 'Invalid username or password');
        }
      });
    },
    [apiClient, navigate]
  );

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        username: yup.string().required('Username cannot be empty'),
        password: yup.string().required('Password cannot be empty'),
      }),
    []
  );

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnBlur
      validateOnChange
    >
      {(formik: any) => (
        <Card className="login-card">
          <CardContent>
            <form
              id="loginForm"
              className="Login-form"
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
                {'Welcome back!'}
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
                      <LoginIcon />
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
                      <LoginIcon />
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
                Login
              </Button>
              <Typography component="h3" align="center">
                {"Don't have an account? "}
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </Typography>
            </form>
          </CardContent>
        </Card>
      )}
    </Formik>
  );
}

export default LoginForm;
