import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import authSlice from '../store/authSlice';
import '../styles/Login.css';

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Link as MuiLink,
  Divider,
} from '@mui/material';

const baseURL = process.env.REACT_APP_baseURL;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const onSubmit = async (values, actions) => {
    setError(null);

    try {

      const res = await axios.post(baseURL+'user/login/', values);
      dispatch(authSlice.actions.setAuthTokens({ token: res.data.tokens.access }));
      dispatch(authSlice.actions.setAccount({
        username:values.roll_no,
        isAuthenticated: true,
      }))

      try{
        const userCourses = await axios.get(baseURL + 'user/courses/', {
          headers: {
            Authorization: `Bearer ${res.data.tokens.access}`,
          },
        });
        
        dispatch(authSlice.actions.setCourses(userCourses.data.courses));
      } catch (err) {
        console.error("Error fetching user courses:", err);
      }

    navigate('/');

    } catch (err) {
      setError("Invalid Roll No. or Password");
    }
    actions.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      roll_no: '',
      password: '',
    },
    validationSchema: Yup.object({
      roll_no: Yup.string().required("Roll No. is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit,
  });

  return (
    <Box className="lg-form-container">
      <form onSubmit={formik.handleSubmit} className="lg-form">
        <Typography variant="h4" className="lg-title">Sign In</Typography>
        <Typography variant="body2" className="lg-subtitle">Sign in to your account</Typography>

        <TextField
          fullWidth
          label="Roll No"
          name="roll_no"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.roll_no}
          error={formik.touched.roll_no && Boolean(formik.errors.roll_no)}
          helperText={formik.touched.roll_no && formik.errors.roll_no}
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

        {error && <Typography className="lg-error">{error}</Typography>}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          className="lg-login-btn"
          disabled={formik.isSubmitting}
        >
          LOGIN
        </Button>

        <Typography variant="body2" align="center" className="lg-signup-link">
          Don’t have an account? <Link to="/Signup">Create account</Link>
        </Typography>

        <Typography variant="body2" align="center" className="lg-signup-link">
          <a href="https://forms.gle/Cfw46uP8Vj9qjwUG7">Forgot Password</a>
        </Typography>
      </form>
    </Box>
  );
};

export default Login;
