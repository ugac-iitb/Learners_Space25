import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import authSlice from '../store/authSlice';
import '../styles/Login.css';

import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';

const baseURL = process.env.REACT_APP_baseURL;

const Login = ({ initialMode = 'signin' }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const redirectTo = location.state?.from || '/Schools';

  const finishAuth = (data, fallbackEmail) => {
    dispatch(authSlice.actions.setAuthTokens({
      token: data.tokens.access,
      refreshToken: data.tokens.refresh,
    }));
    dispatch(authSlice.actions.setAccount(data.user || { email: fallbackEmail }));
    dispatch(authSlice.actions.setCourses(data.user?.courses || []));
    navigate(redirectTo, { replace: true });
  };

  const onSubmit = async (values, actions) => {
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'signup') {
        const res = await axios.post(`${baseURL}user/signup/`, {
          full_name: values.full_name,
          email: values.email,
          password: values.password,
          confirm_password: values.confirm_password,
        });
        setSuccess('Account created. Signing you in...');
        finishAuth(res.data, values.email);
        return;
      }

      const res = await axios.post(`${baseURL}user/login/`, {
        email: values.email,
        password: values.password,
      });

      finishAuth(res.data, values.email);

      try {
        const userCourses = await axios.get(`${baseURL}user/courses/`, {
          headers: {
            Authorization: `Bearer ${res.data.tokens.access}`,
          },
        });
        dispatch(authSlice.actions.setCourses(userCourses.data.courses || []));
      } catch (err) {
        console.error("Error fetching user courses:", err);
      }
    } catch (err) {
      const data = err.response?.data;
      const detail =
        data?.error ||
        data?.email?.[0] ||
        data?.confirm_password?.[0] ||
        data?.password?.[0] ||
        data?.non_field_errors?.[0] ||
        'Unable to authenticate. Please try again.';
      setError(detail);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
    validationSchema: Yup.object(
      mode === 'signup'
        ? {
            full_name: Yup.string().trim().required('Full name is required'),
            email: Yup.string().email('Enter a valid email address').required('Email is required'),
            password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
            confirm_password: Yup.string()
              .oneOf([Yup.ref('password'), null], 'Passwords must match')
              .required('Confirm password is required'),
          }
        : {
            email: Yup.string().email('Enter a valid email address').required('Email is required'),
            password: Yup.string().required('Password is required'),
          }
    ),
    onSubmit,
  });

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError(null);
    setSuccess(null);
    formik.resetForm();
  };

  return (
    <Box className="lg-form-container">
      <form onSubmit={formik.handleSubmit} className="lg-form">
        <Typography variant="h4" className="lg-title">
          {mode === 'signup' ? 'Create Account' : 'Sign In'}
        </Typography>
        <Typography variant="body2" className="lg-subtitle">
          {mode === 'signup' ? 'Create your Learners Space account' : 'Sign in to your account'}
        </Typography>

        <Box className="lg-mode-toggle">
          <Button
            type="button"
            onClick={() => switchMode('signin')}
            className={`lg-mode-btn ${mode === 'signin' ? 'active' : ''}`}
          >
            Sign In
          </Button>
          <Button
            type="button"
            onClick={() => switchMode('signup')}
            className={`lg-mode-btn ${mode === 'signup' ? 'active' : ''}`}
          >
            Create Account
          </Button>
        </Box>

        {mode === 'signup' && (
          <TextField
            fullWidth
            label="Full Name"
            name="full_name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.full_name}
            error={formik.touched.full_name && Boolean(formik.errors.full_name)}
            helperText={formik.touched.full_name && formik.errors.full_name}
            className="lg-textfield"
          />
        )}

        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          className="lg-textfield"
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          className="lg-textfield"
        />

        {mode === 'signup' && (
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            name="confirm_password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirm_password}
            error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
            helperText={formik.touched.confirm_password && formik.errors.confirm_password}
            className="lg-textfield"
          />
        )}

        {error && <Typography className="lg-error">{error}</Typography>}
        {success && <Typography className="lg-success">{success}</Typography>}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          className="lg-login-btn"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting
            ? mode === 'signup' ? 'CREATING ACCOUNT...' : 'SIGNING IN...'
            : mode === 'signup' ? 'CREATE ACCOUNT' : 'SIGN IN'}
        </Button>

        <Typography variant="body2" align="center" className="lg-signup-link">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="lg-inline-action"
            onClick={() => switchMode(mode === 'signup' ? 'signin' : 'signup')}
          >
            {mode === 'signup' ? 'Sign in' : 'Create one'}
          </button>
        </Typography>
      </form>
    </Box>
  );
};

export default Login;
