import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import CircleIcon from '@mui/icons-material/Circle';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import GrainIcon from '@mui/icons-material/Grain';

import RegisteredCourseCard from '../components/RegisteredCourseCard';
import legacyCourses from '../data/Courses.json';
import schoolData from '../data/SchoolInfo.json';
import { getCanonicalCourses } from '../data/courseCatalog';
import authSlice from '../store/authSlice';

import '../styles/CourseList.css';

const baseURL = process.env.REACT_APP_baseURL;

const MyCourses = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const registeredIds = useSelector((state) => state.auth.courses);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const courseLookup = useMemo(() => {
    const lookup = new Map();
    const schoolsById = new Map(schoolData.map((school) => [String(school["School ID"]), school["School Name"]]));

    legacyCourses.forEach((course) => {
      lookup.set(course["Course ID"], {
        id: course["Course ID"],
        source: "legacy",
        name: course["Course Name"],
        body: course["Club"],
        school: schoolsById.get(String(course["School ID"])) || "School to be updated",
        type: "Learners Space",
      });
    });

    getCanonicalCourses().forEach((course) => {
      lookup.set(course.id, {
        id: course.id,
        source: "track",
        name: course.course,
        body: course.body,
        school: course.school,
        type: course.type,
      });
    });

    return lookup;
  }, []);

  const registeredCourses = useMemo(() => {
    return registeredIds
      .map((courseId) => courseLookup.get(courseId))
      .filter(Boolean);
  }, [courseLookup, registeredIds]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${baseURL}user/courses/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(authSlice.actions.setCourses(response.data.courses || []));
      } catch (err) {
        setError('Unable to load your registered courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [dispatch, token]);

  return (
    <div>
      <Box className="cl-banner-root">
        <CircleIcon className="cl-decor-icon cl-circle" />
        <LineAxisIcon className="cl-decor-icon cl-zigzag" />
        <BlurCircularIcon className="cl-decor-icon cl-blur" />
        <ChangeHistoryIcon className="cl-decor-icon cl-triangle" />
        <GrainIcon className="cl-decor-icon cl-dots" />

        <Typography variant="h2" className="cl-banner-title">
          My Courses
        </Typography>
      </Box>

      <Box className="cl-course-list" sx={{ paddingTop: '40px' }}>
        {loading && <CircularProgress color="warning" />}

        {!loading && error && (
          <Typography variant="h6" sx={{ color: '#b00020', textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        {!loading && !error && registeredCourses.length === 0 && (
          <Box className="my-courses-empty">
            <Typography variant="h5" className="my-courses-empty-title">
              You haven't registered for any courses yet.
            </Typography>
            <Button component={Link} to="/Schools" variant="contained" className="course-register-btn">
              Browse Courses
            </Button>
          </Box>
        )}

        {!loading && !error && registeredCourses.length > 0 && (
          <Box className="cl-course-list-cards" sx={{ marginTop: '0px' }}>
            <div className="course-card-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
              {registeredCourses.map((course) => (
                <div key={course.id} className="course-card-item">
                  <RegisteredCourseCard course={course} />
                </div>
              ))}
            </div>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default MyCourses;
