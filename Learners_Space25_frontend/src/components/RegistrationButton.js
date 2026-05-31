import React, { useState } from "react";
import axios from "axios";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import authSlice from "../store/authSlice";

const RegistrationButton = ({ courseId, fullWidth = false, className = "" }) => {
  const baseURL = process.env.REACT_APP_baseURL;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, isAuthenticated, courses } = useSelector((state) => state.auth);
  const isRegistered = courses.includes(courseId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated || !token) {
      showMessage("Please sign in to register for this course.", "error");
      navigate("/SignIn", { state: { from: `${location.pathname}${location.search}` } });
      return;
    }

    if (!isRegistered) {
      setDialogOpen(true);
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${baseURL}user/courses/`,
        { courses: [courseId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(authSlice.actions.setCourses(response.data.courses || [...courses, courseId]));
      showMessage("Course registered successfully.");
      setDialogOpen(false);
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(authSlice.actions.logout());
        showMessage("Your session has expired. Please sign in again.", "error");
        navigate("/SignIn", { state: { from: `${location.pathname}${location.search}` } });
      } else if (error.response?.status === 409) {
        dispatch(authSlice.actions.addCourse(courseId));
        showMessage("You are already registered for this course.", "info");
        setDialogOpen(false);
      } else {
        showMessage(error.response?.data?.error || "Registration failed. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        className={className}
        fullWidth={fullWidth}
        disabled={!courseId || isRegistered || isSubmitting}
        onClick={handleOpen}
      >
        {isSubmitting ? "Registering..." : isRegistered ? "Registered" : "Register"}
      </Button>

      <Dialog open={dialogOpen} onClose={() => !isSubmitting && setDialogOpen(false)}>
        <DialogTitle>Register for Course</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to register for this course?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Confirming..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RegistrationButton;
