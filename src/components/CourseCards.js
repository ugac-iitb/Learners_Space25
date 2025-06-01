import React, { useState } from 'react';
import '../styles/CourseCards.css';
import { Avatar, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Link } from 'react-router-dom';


const CourseCard = ({ course }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleDescription = () => {
    setExpanded(prev => !prev);
  };

  return (
    <div className="course-card">
      {/* Image */}
      <img loading="lazy" className="course-image" src={`${process.env.PUBLIC_URL}/data/images/card/${course["Course ID"]}.png`} alt="Course" />

      <div className="course-content">
        {/* Author & Rating */}
        <div className="course-header">
        <img loading="lazy" className="author-avatar" src={`${process.env.PUBLIC_URL}/data/images/clubs/${course["Course ID"]}.png`} alt="CLub" />
          <span className="author-name">{course["Club"]}</span>
        </div>

        {/* Title */}
        <h3 className="course-title">
          <Link to={`/Course?id=${course["Course ID"]}`} className="course-link">
            {course["Course Name"]}
          </Link>
        </h3>
        <Divider className="course-divider" />

        {/* Description */}
        <div className={`course-description ${expanded ? 'expanded' : ''}`}>
          {course["Desc_short"]}
        </div>

        <button className="toggle-description-btn" onClick={toggleDescription}>
          {expanded ? (
            <>
              Show Less <ExpandLessIcon fontSize="small" />
            </>
          ) : (
            <>
              Read More <ExpandMoreIcon fontSize="small" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
