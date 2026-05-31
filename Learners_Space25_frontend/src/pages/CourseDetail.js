import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import '../styles/CourseDetails.css';
import InsCourse from '../components/InsCourse';
import { useSearchParams } from 'react-router-dom';
import CourseData from '../data/Courses.json';
import OvCourse from '../components/OverviewCourse';
import CurCourse from '../components/CurriculumCourse';
import schoolData from '../data/SchoolInfo.json';
import RegistrationButton from '../components/RegistrationButton';

export default function CoursePage() {
    const [Ovclicked, setOvClicked] = useState(true);
    const [Curclicked, setCurClicked] = useState(false);
    const [Insclicked, setInsClicked] = useState(false);
    const colVal = '#f2bc28';

    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const [courseData, setCourseData] = useState({});

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

    return (
        <div className="cd-course-page">
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
                            <RegistrationButton
                                courseId={courseData["Course ID"]}
                                fullWidth
                                className="cd-add-to-cart"
                            />

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
        </div>
    );
}
