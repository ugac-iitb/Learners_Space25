import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import '../styles/Signup.css';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const baseURL = process.env.REACT_APP_baseURL;


const Signup = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (values, actions) => {
    setError(null);
    try {
      const { confirm_password, ...formData } = values; // Remove confirm_password before sending

      console.log(formData);
      const res = await axios.post(baseURL+'user/signup/', formData);
      console.log(res.data);
      navigate('/SignIn');
      // Redirect or display success message here
    } catch (err) {
      console.error(err);
      if(err.response && err.response.status === 400) {
        setError('User with this Roll No. already exists');
      }

      else{
        setError('An error occurred while signing up. Please try again later.');
      }
      
    }
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: {
      roll_no: '',
      ldap_id: '',
      password: '',
      confirm_password: '',
      year_of_study: '',
      contact_number: '',
      degree_type: '',
    },
    validationSchema: Yup.object({
      roll_no: Yup.string().required('Roll No. is required'),
      ldap_id: Yup.string()
                  .email("Not a valid email")
                  .matches(/^[a-zA-Z0-9._%+-]+@iitb\.ac\.in$/, "Not a valid IITB LDAP ID")
                  .required("LDAP ID is required"),
      password: Yup.string().required('Password is required'),
      confirm_password: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
      year_of_study: Yup.string().required('Year of Study is required'),
      contact_number: Yup.string()
        .matches(/^[0-9]{10}$/, 'Contact Number must be 10 digits')
        .required('Contact Number is required'),
      degree_type: Yup.string().required('Degree Type is required'),
    }),
    onSubmit,
  });

  return (
    <Box className="sg-form-container">
      <form onSubmit={formik.handleSubmit} className="sg-form">
        <Typography variant="h4" className="sg-title">Sign Up</Typography>
        <Typography variant="body2" className="sg-subtitle">Create your account</Typography>

        <TextField
          fullWidth
          label="Roll No"
          name="roll_no"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.roll_no}
          error={formik.touched.roll_no && Boolean(formik.errors.roll_no)}
        //   helperText={formik.touched.roll_no && formik.errors.roll_no}
          className="sg-textfield"
        />

        <TextField
          fullWidth
          label="LDAP ID"
          name="ldap_id"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.ldap_id}
          error={formik.touched.ldap_id && Boolean(formik.errors.ldap_id)}
          helperText={formik.touched.ldap_id && formik.errors.ldap_id}
          className="sg-textfield"
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
        //   helperText={formik.touched.password && formik.errors.password}
          className="sg-textfield"
        />

        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          name="confirm_password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirm_password}
          error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
        //   helperText={formik.touched.confirm_password && formik.errors.confirm_password}
          className="sg-textfield"
        />

        <TextField
          select
          fullWidth
          label="Year of Study (in Autumn 2025)"
          name="year_of_study"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.year_of_study}
          error={formik.touched.year_of_study && Boolean(formik.errors.year_of_study)}
        //   helperText={formik.touched.year_of_study && formik.errors.year_of_study}
          className="sg-textfield"
        >
          {['1st year', '2nd year', '3rd year', '4th year', '5th year'].map((year) => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Contact Number"
          name="contact_number"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.contact_number}
          error={formik.touched.contact_number && Boolean(formik.errors.contact_number)}
        //   helperText={formik.touched.contact_number && formik.errors.contact_number}
          className="sg-textfield"
        />

        <FormControl component="fieldset" className="sg-radio-group" error={formik.touched.degree_type && Boolean(formik.errors.degree_type)}>
          <FormLabel component="legend">Degree Type</FormLabel>
          <RadioGroup
            row
            name="degree_type"
            value={formik.values.degree_type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <FormControlLabel value="UG" control={<Radio />} label="UG" />
            <FormControlLabel value="PG" control={<Radio />} label="PG" />
          </RadioGroup>
          {formik.touched.degree_type && formik.errors.degree_type && (
            <Typography className="sg-error" variant="body2">
              {formik.errors.degree_type}
            </Typography>
          )}
        </FormControl>

        {error && <Typography className="sg-error">{error}</Typography>}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          className="sg-signup-btn"
          disabled={formik.isSubmitting}
        >
          SIGN UP
        </Button>
        
        {/* <a href="https://gymkhana.iitb.ac.in/profiles/oauth/authorize/?client_id=YOUR_CLIENT_ID&response_type=code&scope=basic&redirect_uri=REDIRECT_URI&state=some_state">SSO</a> */}
      </form>
    </Box>
  );
};

export default Signup;