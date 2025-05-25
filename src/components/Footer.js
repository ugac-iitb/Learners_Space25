import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  Google,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

import '../styles/Footer.css';

const FooterComp = () => {
  return (
    <Box className="footer-root">
      <Box className="footer-container">
        {/* About Section */}
        <Box className="footer-about">
          <Typography variant="h5" className="footer-title">Learners Space</Typography>
          <Typography className="footer-text">
            Mattis inelit neque quis donec eleifend amet. Amet sed et cursus eu euismod. Egestas in morbi tristique ornare vulputate vitae enim.
          </Typography>
          <Stack direction="row" spacing={2} mt={2}>
            <IconButton className="footer-icon"><Facebook sx={{color:'white'}} /></IconButton>
            <IconButton className="footer-icon"><Twitter sx={{color:'white'}} /></IconButton>
            <IconButton className="footer-icon"><Instagram sx={{color:'white'}} /></IconButton>
            <IconButton className="footer-icon"><Google sx={{color:'white'}} /></IconButton>
          </Stack>
        </Box>

        {/* Contact Section */}
        <Box className="footer-contact-section">
          <Typography variant="h5" className="footer-heading">Contact Us</Typography>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Email fontSize="small" />
            <Typography className="footer-contact">Eduko@Gmail.Com</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Phone fontSize="small" />
            <Typography className="footer-contact">(208) 555-0112</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Phone fontSize="small" />
            <Typography className="footer-contact">(704) 555-0127</Typography>
          </Stack>
          <Stack direction="row" alignItems="flex-start" spacing={1}>
            <LocationOn fontSize="small" />
            <Typography className="footer-contact">
              4517 Washington Ave.<br />
              Manchter, Kentucky 495
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default FooterComp;
