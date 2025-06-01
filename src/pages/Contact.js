import React from "react";
import "../styles/ContactPage.css";
import {
  Box,
  Typography,
  IconButton
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

import CircleIcon from '@mui/icons-material/Circle';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import GrainIcon from '@mui/icons-material/Grain';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';

import contactInfo from "../data/ContactData.json";

const Contact = () => {
  const decodeUnicode = (str) => {
    try {
      return JSON.parse(`"${str}"`);
    } catch (e) {
      return str;
    }
  };

  const renderParagraphs = (raw) => {
    const decoded = decodeUnicode(raw || "");
    return decoded.split("\n").map((line, i) => (
      <p key={i} className="co-role-desc">{line}</p>
    ));
  };
  return (
    
    <div>
      <Box className="banner-root">

        <CircleIcon className="decor-icon circle" />
        <LineAxisIcon className="decor-icon zigzag" />
        <BlurCircularIcon className="decor-icon blur" />
        <ChangeHistoryIcon className="decor-icon triangle" />
        <GrainIcon className="decor-icon dots" />

        <Typography variant="h2" className="banner-title">
            Contact Us
        </Typography>
      </Box>

      <div className="co-root">
        <Typography variant="h3" className="co-heading">
          Our Team
        </Typography>
        <Typography variant="subtitle1" className="co-subheading">
        Made with love by the UGAC Web Team in collaboration with the Career Cell

        </Typography>

        <Box className="co-cards-wrapper">
          {contactInfo.map((person, index) => (
            <Box className="co-profile" key={index}>
              <img
                className="co-avatar"
                src={`${process.env.PUBLIC_URL}${person.img}`}
                alt={person.name}
              />
              <Box className="co-profile-info">
                <Typography variant="h5" className="co-name">
                  {person.name}
                </Typography>
                <Typography className="co-role">{renderParagraphs(person.position)}</Typography>
                <Typography variant="body2" className="co-description">
                  <span className="co-contact">Contact Number: </span> <span>{person.contact}</span>   
                </Typography>
                
              </Box>
            </Box>
          ))}
        </Box>
      </div>
    </div>
    
  );
};

export default Contact;
