import React from "react";
import { Button, Chip, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import "../styles/CourseCards.css";

const RegisteredCourseCard = ({ course, onDeregister, locked = false, isUpdating = false }) => {
  const detailPath = course.source === "track" ? `/TrackCourse?id=${course.id}` : `/Course?id=${course.id}`;

  return (
    <div className="course-card registered-course-card">
      <div className="course-content">
        <div className="course-header">
          <span className="author-name">{course.body}</span>
        </div>

        <h3 className="course-title">
          <Link to={detailPath} className="course-link">
            {course.name}
          </Link>
        </h3>
        <Divider className="course-divider" />

        <div className="track-course-chip-row registered-course-meta">
          <Chip size="small" label={course.school || "School to be updated"} />
          <Chip size="small" label={course.type || "Course"} />
        </div>

        <Button
          type="button"
          variant="outlined"
          color="error"
          className="course-deregister-btn"
          disabled={locked || isUpdating}
          onClick={() => onDeregister?.(course.id)}
        >
          {isUpdating ? "Deregistering..." : locked ? "Locked" : "Deregister"}
        </Button>
      </div>
    </div>
  );
};

export default RegisteredCourseCard;
