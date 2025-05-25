import React from 'react';
import '../styles/CourseCards.css';
import { Avatar } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import cardImage from '../data/images/img1.png';

const CourseCard = () => {
  return (
    <div className="course-card">
      {/* Image */}
      <img
        className="course-image"
        src={cardImage}
        alt="Course"
      />

      <div className="course-content">
        {/* Author & Rating */}
        <div className="course-header">
          <Avatar
            
            className="author-avatar"
          />
          <span className="author-name">Robert Henry</span>
          <StarIcon className="star-icon" />
          <span className="rating">(4.5)</span>
        </div>

        {/* Title */}
        <h3 className="course-title">
          Learn WordPress & Elementor for Beginners
        </h3>

        {/* Students & Lessons */}
        <div className="course-footer">
          <div className="footer-item">
            <PeopleIcon fontSize="small" />
            <span>200 Students</span>
          </div>
          <div className="footer-item">
            <MenuBookIcon fontSize="small" />
            <span>20 Lessons</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
