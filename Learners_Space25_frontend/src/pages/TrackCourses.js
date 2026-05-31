import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import LineAxisIcon from "@mui/icons-material/LineAxis";
import BlurCircularIcon from "@mui/icons-material/BlurCircular";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import GrainIcon from "@mui/icons-material/Grain";

import TrackCourseCard from "../components/TrackCourseCard";
import { getCanonicalCourses } from "../data/courseCatalog";

import "../styles/CourseList.css";

const TrackCourses = ({ type }) => {
  const [selectedSchool, setSelectedSchool] = useState("All");

  const canonicalCourses = useMemo(() => getCanonicalCourses(), []);

  const coursesOfType = useMemo(() => {
    return canonicalCourses.filter((c) => c.type === type);
  }, [canonicalCourses, type]);

  const allSchools = useMemo(() => {
    const set = new Set(coursesOfType.map((c) => c.school));

    // Keep ordering stable + aligned with requirement examples
    const preferred = [
      "Engineering School",
      "Sciences School",
      "CS and DS School",
      "Management School",
      "Sports and Skills School",
      "Sustainability School",
      "Option 1",
      "Unspecified",
    ];

    const presentPreferred = preferred.filter((s) => set.has(s));
    const remaining = Array.from(set).filter((s) => !preferred.includes(s)).sort((a, b) => a.localeCompare(b));
    return [...presentPreferred, ...remaining];
  }, [coursesOfType]);

  const filteredCourses = useMemo(() => {
    if (selectedSchool === "All") return coursesOfType;
    return coursesOfType.filter((c) => c.school === selectedSchool);
  }, [coursesOfType, selectedSchool]);

  useEffect(() => {
    if (selectedSchool !== "All" && !allSchools.includes(selectedSchool)) {
      setSelectedSchool("All");
    }
  }, [allSchools, selectedSchool]);

  const title = type === "TSS" ? "Technical Summer School (TSS)" : "Non Technical Summer School (NTSS)";

  return (
    <div>
      <Box className="cl-banner-root">
        <CircleIcon className="cl-decor-icon cl-circle" />
        <LineAxisIcon className="cl-decor-icon cl-zigzag" />
        <BlurCircularIcon className="cl-decor-icon cl-blur" />
        <ChangeHistoryIcon className="cl-decor-icon cl-triangle" />
        <GrainIcon className="cl-decor-icon cl-dots" />

        <Typography variant="h2" className="cl-banner-title">
          Courses
        </Typography>
      </Box>

      <Box className="cl-course-list">
        <Typography className="cl-course-list-subtitle">Our Courses</Typography>
        <Typography variant="h2" className="cl-course-list-title">
          {title}
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2, justifyContent: "center", marginTop: 4 }}>
          <Chip
            label="All Schools"
            clickable
            onClick={() => setSelectedSchool("All")}
            color={selectedSchool === "All" ? "warning" : "default"}
            variant={selectedSchool === "All" ? "filled" : "outlined"}
          />
          {allSchools.map((school) => (
            <Chip
              key={school}
              label={school}
              clickable
              onClick={() => setSelectedSchool(school)}
              color={selectedSchool === school ? "warning" : "default"}
              variant={selectedSchool === school ? "filled" : "outlined"}
            />
          ))}
        </Box>

        <Box className="cl-course-list-cards">
          <div className="course-card-container" style={{ display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "center" }}>
            {filteredCourses.map((course, index) => (
              <div key={`${course.id}-${index}`} className="course-card-item">
                <TrackCourseCard course={course} />
              </div>
            ))}
          </div>
        </Box>

        {filteredCourses.length === 0 && (
          <Typography variant="h6" sx={{ marginTop: 6, color: "#6b647b", textAlign: "center" }}>
            No courses available for this school right now.
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default TrackCourses;

