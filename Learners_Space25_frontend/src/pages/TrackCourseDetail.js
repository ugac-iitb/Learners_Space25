import React, { useMemo } from "react";
import { Box, Chip, Divider, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useSearchParams } from "react-router-dom";
import { getCourseById } from "../data/courseCatalog";
import RegistrationButton from "../components/RegistrationButton";
import "../styles/CourseDetails.css";

const TrackCourseDetail = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const course = useMemo(() => getCourseById(id), [id]);
  const backPath = course?.type === "NTSS" ? "/Schools/NTSS" : "/Schools/TSS";

  return (
    <div className="cd-course-page">
      <Box className="tcd-header-root">
        <Box className="tcd-banner-content">
          <Link to={backPath} className="tcd-back-link">
            <ArrowBackIcon fontSize="small" />
            Back to {course?.type === "NTSS" ? "NTSS" : "TSS"} Courses
          </Link>

          {course ? (
            <>
              <Typography variant="h2" className="tcd-banner-title">
                {course.course}
              </Typography>
              <Typography className="tcd-banner-body">{course.body}</Typography>
              <Box className="tcd-banner-chips">
                <Chip size="small" label={course.type} className="tcd-chip" />
                <Chip size="small" label={course.school} className="tcd-chip" />
              </Box>
            </>
          ) : (
            <Typography variant="h2" className="tcd-banner-title">
              Course Not Found
            </Typography>
          )}
        </Box>
      </Box>

      <div className="cd-course-content">
        <div className="cd-course-left">
          {!course && (
            <Typography className="cd-course-description">
              Course details were not found. Please return to the courses list and try again.
            </Typography>
          )}

          {course && (
            <>
              <Box className="cd-Ov-description">
                <Typography className="cd-Ov-main">Overview</Typography>
                <Typography className="cd-course-description">
                  {course.intro || "Introductory description will be updated soon."}
                </Typography>
              </Box>

              <Box sx={{ marginTop: 4 }}>
                <Typography className="cd-Ov-main">Week-wise Course Content</Typography>
                {course.weeks && course.weeks.length > 0 ? (
                  course.weeks.map((weekItem, index) => (
                    <Box key={`${weekItem.week || index}-${index}`} className="tcd-week-block">
                      <Typography className="tcd-week-title">
                        {weekItem.week || `Week ${index + 1}`}
                      </Typography>
                      <Typography className="cd-course-description">
                        {weekItem.content || "-"}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography className="cd-course-description">
                    Week-wise breakdown will be added from the finalized course sheet.
                  </Typography>
                )}
              </Box>
            </>
          )}
        </div>

        <div className="cd-course-right">
          {course && (
            <div className="cd-price-box">
              <RegistrationButton courseId={course.id} fullWidth className="cd-add-to-cart" />
              <div className="cd-course-details">
                <p className="cd-price-content">
                  <span className="cd-price-head">Organizing Body</span>
                  <span>{course.body}</span>
                </p>
                <Divider className="cd-divider" />
                <p className="cd-price-content">
                  <span className="cd-price-head">School</span>
                  <span>{course.school}</span>
                </p>
                <Divider className="cd-divider" />
                <p className="cd-price-content">
                  <span className="cd-price-head">Type</span>
                  <span>{course.type}</span>
                </p>
                <Divider className="cd-divider" />
                <p className="cd-price-content tcd-meta-row">
                  <span className="cd-price-head">Pre-requisites</span>
                  <span>{course.prerequisites || "To be updated"}</span>
                </p>
                <Divider className="cd-divider" />
                <p className="cd-price-content tcd-meta-row">
                  <span className="cd-price-head">Evaluation & Certification</span>
                  <span>{course.evaluation || "To be updated"}</span>
                </p>
                <Divider className="cd-divider" />
                <p className="cd-price-content">
                  <span className="cd-price-head">Weekly Time</span>
                  <span>{course.weeklyTime || "To be updated"}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackCourseDetail;
