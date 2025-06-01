import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Pagination } from '@mui/material';
import { data, useParams } from 'react-router-dom';

import CircleIcon from '@mui/icons-material/Circle';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import GrainIcon from '@mui/icons-material/Grain';

import CourseCards from '../components/CourseCards';
import schoolData from '../data/SchoolInfo.json';

import courses from '../data/Courses.json';

import '../styles/CourseList.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

const MyCourses = () => {

    const baseURL = process.env.REACT_APP_baseURL;

    const token = useSelector((state) => state.auth.token);

    const dataURL = `${baseURL}/user/courses/`;

    console.log(dataURL);
    const [school, setSchool] = useState({});
    const [courseData,setCourseData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(dataURL, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    const cours_keys = response.data['courses'];
                    const filteredCourses = courses.filter(course => cours_keys.includes(course["Course ID"]));
                    console.log(filteredCourses);
                    setCourseData(filteredCourses);

                }
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        };
        fetchData();
    }, [dataURL, token]);
               
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

      {courseData && (
        <Box className="cl-course-list" sx={{paddingTop:'0px'}}>
            <Box className="cl-course-list-cards" sx={{marginTop:'0px'}}>
            <Box className="cl-course-list-cards">
                <div  className="course-card-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px',justifyContent:'center' }}>
                    {courseData.map((course, index) => (
                        <div 
                            key={index} 
                            className='course-card-item'
                        >
                        <CourseCards
                            course={course}
                        />
                        </div>
                    ))}
                </div>
            </Box>
            </Box>
        </Box>
      )}
    </div>
  );
};

export default MyCourses;
