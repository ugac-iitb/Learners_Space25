import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Chip, Divider, Avatar, Snackbar, Alert } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import GrainIcon from '@mui/icons-material/Grain';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';
import '../styles/CourseDetails.css';
import InsCourse from '../components/InsCourse';
import testImg from '../data/images/courseTest.webp';
import { useSearchParams } from 'react-router-dom';
import CourseData from '../data/Courses.json';
import OvCourse from '../components/OverviewCourse';
import CurCourse from '../components/CurriculumCourse';
import schoolData from '../data/SchoolInfo.json';
import authSlice from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Add, Padding } from '@mui/icons-material';

export default function CoursePage() {
    const baseURL = "http://127.0.0.1:8000/user/";

    const dispatch = useDispatch();

    const selector = useSelector((state) => state.auth);
    const AddedCourses = useSelector((state) => state.auth.courses);

    const [Ovclicked, setOvClicked] = useState(true);
    const [Curclicked, setCurClicked] = useState(false);
    const [Insclicked, setInsClicked] = useState(false);
    const colVal = '#f2bc28';

    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const [courseData, setCourseData] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [isAdded,setIsAdded] = useState(AddedCourses.includes(id));

    const [school, setSchool] = useState(null);

    useEffect(() => {
        const val = CourseData.find(course => course["Course ID"] === id);
        setCourseData(val);
    }, [id]);

    useEffect(() => {
        if(courseData){
            const schoolVal = schoolData.find(school => school["School ID"] == courseData["School ID"]);

            if(schoolVal)
                setSchool(schoolVal["School Name"]);

            console.log(schoolVal);
        }
            
       
    }, [courseData]);

    const handleCardClick = (id) => {
        if (id === 'Overview') {
            setOvClicked(true);
            setCurClicked(false);
            setInsClicked(false);
        } else if (id === 'Curriculum') {
            setCurClicked(true);
            setOvClicked(false);
            setInsClicked(false);
        } else if (id === 'Instructor') {
            setInsClicked(true);
            setOvClicked(false);
            setCurClicked(false);
        }
    };

    const  handleRegisterClick = async () => {
        if (courseData && courseData["Course ID"]) {
            const courseId = courseData["Course ID"];
            const token = selector.token;

            const data = {
                courses: [courseId],
            }

            try {
                const res = await axios.post(baseURL+'courses/',data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                dispatch(authSlice.actions.setCourses(courseId));
                setSnackbarMessage("Course Registered Successfully!");
                setSnackbarSeverity("success");

                setIsAdded(true);

            } catch (error) {
                console.error("Error adding course:", error);
                
                if(error.response && error.response.status == 401){
                    console.log(error.response.status)
                    setSnackbarMessage("Unauthorized. Please log in again.");
                    setSnackbarSeverity("error");
                    dispatch(authSlice.actions.logout());
                    
                }
                else{
                    setSnackbarMessage("Failed to add course. Please try again.");
                    setSnackbarSeverity("error");
                }
                
            }
            setOpenSnackbar(true);
        }
        else{
            setSnackbarMessage("No course data available to register.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    }

    const handleRemoveClick = async () => {
        if (courseData && courseData["Course ID"]) {
        const courseId = courseData["Course ID"];
        const token = selector.token;

        console.log(token)

        const data = {
            courses: [courseId],
        }

        try {
            const res = await axios.delete(baseURL+'courses/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data
            });

            setSnackbarMessage("Course De Registered Successfully!");
            setSnackbarSeverity("success");

            setIsAdded(false);

        } catch (error) {
            console.error("Error adding course:", error);
            
            if(error.response && error.response.status == 401){
                console.log(error.response.status)
                setSnackbarMessage("Unauthorized. Please log in again.");
                setSnackbarSeverity("error");
                dispatch(authSlice.actions.logout());
                
            }
            else{
                setSnackbarMessage("Failed to remove course. Please try again.");
                setSnackbarSeverity("error");
            }
            
        }
        setOpenSnackbar(true);
    }
    else{
        setSnackbarMessage("No course data available to register.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
    }}
    return (
        <div className="cd-course-page">
            <Box className="cd-banner-root">
                <CircleIcon className="cd-decor-icon cd-circle" />
                <LineAxisIcon className="cd-decor-icon cd-zigzag" />
                <BlurCircularIcon className="cd-decor-icon cd-blur" />
                <ChangeHistoryIcon className="cd-decor-icon cd-triangle" />
                <GrainIcon className="cd-decor-icon cd-dots" />

                <Typography variant="h2" className="cd-banner-title">
                    Course
                </Typography>
            </Box>

            {courseData && (
                <div className="cd-course-content">
                    <div className="cd-course-left">
                        <img
                            src={`${process.env.PUBLIC_URL}/data/images/card_desc/${courseData["Course ID"]}.png`}
                            alt="Course"
                            className="cd-course-image"
                        />

                        <div className="cd-tab-buttons">
                            <Box
                                className={`cd-design-card ${Ovclicked ? 'fade-out' : ''}`}
                                style={{ '--hover-color': colVal }}
                                onClick={() => handleCardClick("Overview")}
                                id="Overview"
                            >
                                <Box className="cd-card-content">
                                    <Typography variant="h6" className="cd-design-title cd-design-link">
                                        Overview
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                className={`cd-design-card ${Curclicked ? 'fade-out' : ''}`}
                                style={{ '--hover-color': colVal }}
                                onClick={() => handleCardClick("Curriculum")}
                                id="Curriculum"
                            >
                                <Box className="cd-card-content">
                                    <Typography variant="h6" className="cd-design-title cd-design-link">
                                        Curriculum
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                className={`cd-design-card ${Insclicked ? 'fade-out' : ''}`}
                                style={{ '--hover-color': colVal }}
                                onClick={() => handleCardClick("Instructor")}
                                id="Instructor"
                            >
                                <Box className="cd-card-content">
                                    <Typography variant="h6" className="cd-design-title cd-design-link">
                                        Instructor
                                    </Typography>
                                </Box>
                            </Box>
                        </div>

                        {Ovclicked && (
                            <OvCourse courseData={courseData} />
                        )}

                        {Curclicked && (
                            <CurCourse courseData={courseData} />
                        )}

                        {Insclicked && (
                            <InsCourse courseData={courseData} />
                        )}
                    </div>

                    <div className="cd-course-right">
                        <div className="cd-price-box">
                            {!isAdded && (<Button disabled={isAdded} onClick={handleRegisterClick} variant="contained" className="cd-add-to-cart">
                                Register
                            </Button>)}

                            {isAdded && (<Button disabled={!isAdded} onClick={handleRemoveClick} variant="contained" className="cd-add-to-cart" sx={{backgroundColor:'red'}}>
                                De Register
                            </Button>)}

                            <div className="cd-course-details">
                                
                                <p className='cd-price-content'><span className='cd-price-head'>School:</span> {school}</p>
                                
                                <Divider className='cd-divider' />
                                <p className='cd-price-content'><span className='cd-price-head'>Student Body:</span> <span style={{paddingLeft:"20%"}}>{courseData["Club"]} </span> </p>
                                <Divider className='cd-divider' />
                                <p className='cd-price-content'><span className='cd-price-head'>Time:</span> {courseData["Week_time"]} per week</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Snackbar Notification */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}
