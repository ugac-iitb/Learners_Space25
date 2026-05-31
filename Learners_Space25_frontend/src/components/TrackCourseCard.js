import React, { useMemo } from "react";
import "../styles/CourseCards.css";
import { Chip, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import RegistrationButton from "./RegistrationButton";

const TrackCourseCard = ({ course }) => {
  const school = useMemo(() => course.school || "Unspecified", [course.school]);

  const preview =
    course.intro && course.intro.length > 140
      ? `${course.intro.slice(0, 140).trim()}…`
      : course.intro;

  return (
    <div className="course-card track-course-card">
      <div className="course-content">
        <div className="course-header">
          <span className="author-name">{course.body}</span>
        </div>

        <h3 className="course-title">
          <Link
            to={`/TrackCourse?id=${course.id}`}
            className="course-link"
            aria-label={`View details for ${course.course}`}
          >
            {course.course}
          </Link>
        </h3>
        <Divider className="course-divider" />

        {preview && <p className="course-description track-course-preview">{preview}</p>}

        <div className="track-course-chip-row">
          <Chip size="small" label={course.type} />
          <Chip size="small" label={school} />
        </div>
        <RegistrationButton courseId={course.id} fullWidth className="course-register-btn" />
      </div>
    </div>
  );
};

export default TrackCourseCard;
