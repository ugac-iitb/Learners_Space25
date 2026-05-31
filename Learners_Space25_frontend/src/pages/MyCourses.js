import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import RegisteredCourseCard from '../components/RegisteredCourseCard';
import legacyCourses from '../data/Courses.json';
import schoolData from '../data/SchoolInfo.json';
import { getCanonicalCourses } from '../data/courseCatalog';
import authSlice from '../store/authSlice';
import baseURL from '../config/api';

import '../styles/CourseList.css';

const MyCourses = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const registeredIds = useSelector((state) => state.auth.courses);
  const coursesLocked = useSelector((state) => state.auth.coursesLocked);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingCourseId, setUpdatingCourseId] = useState(null);
  const [locking, setLocking] = useState(false);
  const [lockDialogOpen, setLockDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
        dispatch(authSlice.actions.setCourses(response.data));
      } catch (err) {
        setError('Unable to load your registered courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [dispatch, token]);

  const showMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDeregister = async (courseId) => {
    if (coursesLocked) {
      showMessage('Your course selection is locked and cannot be changed.', 'info');
      return;
    }

    setUpdatingCourseId(courseId);
    try {
      const response = await axios.delete(`${baseURL}user/courses/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          courses: [courseId],
        },
      });
      dispatch(authSlice.actions.setCourses(response.data));
      showMessage('Course deregistered successfully.');
    } catch (err) {
      showMessage(err.response?.data?.error || 'Unable to deregister from this course.', 'error');
    } finally {
      setUpdatingCourseId(null);
    }
  };

  const handleLockCourses = async () => {
    setLocking(true);
    try {
      const response = await axios.post(
        `${baseURL}user/courses/lock/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(authSlice.actions.setCourses(response.data));
      dispatch(authSlice.actions.setCoursesLocked(true));
      showMessage('Your course selection has been locked.');
      setLockDialogOpen(false);
    } catch (err) {
      showMessage(err.response?.data?.error || 'Unable to lock your course selection.', 'error');
    } finally {
      setLocking(false);
    }
  };

  return (
    <div>
      <Box className="cl-course-list" sx={{ paddingTop: '40px' }}>
        <Typography variant="h2" className="cl-course-list-title" sx={{ marginBottom: '30px' }}>
          My Courses
        </Typography>
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
                  <RegisteredCourseCard
                    course={course}
                    locked={coursesLocked}
                    isUpdating={updatingCourseId === course.id}
                    onDeregister={handleDeregister}
                  />
                </div>
              ))}
            </div>

            <Box className="my-courses-lock-panel">
              <Typography variant="h6" className="my-courses-lock-title">
                {coursesLocked ? 'Your course selection is locked.' : 'Ready to finalize your course selection?'}
              </Typography>
              <Typography variant="body2" className="my-courses-lock-copy">
                {coursesLocked
                  ? 'You can no longer register for or deregister from courses.'
                  : 'Lock in only when you are sure. You will not be able to register or deregister after this.'}
              </Typography>
              <Button
                type="button"
                variant="contained"
                className="course-register-btn"
                disabled={coursesLocked || locking}
                onClick={() => setLockDialogOpen(true)}
              >
                {locking ? 'Locking...' : coursesLocked ? 'Locked In' : 'Lock In'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      <Dialog open={lockDialogOpen} onClose={() => !locking && setLockDialogOpen(false)}>
        <DialogTitle>Lock In Course Selection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will finalize your selected courses. After locking in, you cannot register for or deregister from any course.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLockDialogOpen(false)} disabled={locking}>
            Cancel
          </Button>
          <Button onClick={handleLockCourses} variant="contained" disabled={locking}>
            {locking ? 'Locking...' : 'Lock In'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MyCourses;
