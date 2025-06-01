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
  LinkedIn,
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
          This edition of Learners' Space brings to you carefully curated courses and the chance to upskill and learn various topics catering to the taste of students today!
          </Typography>
          <Stack direction="row" spacing={2} mt={2}>
            
            <a href="https://www.instagram.com/careercell_iitb/" target="_blank" rel="noopener noreferrer">
              <IconButton className="footer-icon"><Instagram fontSize='medium' sx={{color:'white'}} /></IconButton>
            </a>

            <a href="https://www.facebook.com/careercell.iitb/" target="_blank" rel="noopener noreferrer">
              <IconButton className="footer-icon"><Facebook fontSize='medium' sx={{color:'white'}} /></IconButton>
            </a>
            <a href="https://www.linkedin.com/company/careercell/" target="_blank" rel="noopener noreferrer">
              <IconButton className="footer-icon"><LinkedIn fontSize='medium' sx={{color:'white'}} /></IconButton>
            </a>
            
            <a href="mailto:careercell@iitb.ac.in" >
              <IconButton className="footer-icon">
                  <Google fontSize='medium' sx={{color:'white'}} />
              </IconButton>
            </a>
          </Stack>
        </Box>

        {/* Contact Section */}
        <Box className="footer-contact-section">
          <Typography variant="h5" className="footer-heading">Contact Us</Typography>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            {/* <Email fontSize="small" /> */}
            <Typography className="footer-contact">Parv Khandelwal</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            {/* <Email fontSize="small" /> */}
            <Typography sx={{fontSize:'15px'}} className="footer-contact">Institute Secretary, Academic Affairs <br />
            Head, Career Cell</Typography>
          </Stack>


          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Email fontSize="small" />
            <Typography className="footer-contact">
              <a href="mailto:careercell@iitb.ac.in" style={{ textDecoration: 'none', color: 'inherit' }}>
                careercell@iitb.ac.in
              </a>
            </Typography>

          </Stack>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Phone fontSize="small" />
            <Typography className="footer-contact">8302649745</Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default FooterComp;
