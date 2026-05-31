import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import CourseCards from '../components/CourseCards';
import courseData from '../data/Courses.json';
import schoolData from '../data/SchoolInfo.json';

import '../styles/CourseList.css';

const COURSES_PER_PAGE = 6;

const CourseList = () => {
  const [school, setSchool] = useState({});
  const [page, setPage] = useState(1);
  const { id } = useParams();

  const filteredCourses = courseData.filter(course => course["School ID"] == id);
  console.log(filteredCourses)
  const pageCount = Math.ceil(filteredCourses.length / COURSES_PER_PAGE);

  const handleChangePage = (_, value) => {
    setPage(value);
  };

//   const paginatedCourses = filteredCourses.slice(
//     (page - 1) * COURSES_PER_PAGE,
//     page * COURSES_PER_PAGE
//   );

  useEffect(() => {
    const val = schoolData.find(school => school["School ID"] == id);
    setSchool(val);
  }, [id]);

  return (
    <div>
      {school && (
        <Box className="cl-course-list">
            <Typography className="cl-course-list-subtitle">Our Courses</Typography>
            <Typography variant="h2" className="cl-course-list-title">
                Explore Courses in {school["School Name"]} School
            </Typography>

            <Box className="cl-course-list-cards">
                <div  className="course-card-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px',justifyContent:'center' }}>
                    {filteredCourses.map((course, index) => (
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

          {/* <Box className="cl-course-list-cards">
            <Grid container spacing={1}>
              {paginatedCourses.map((course, index) => (
                <Grid item xs={12} sm={6} md={3}  key={index}>
                  <CourseCards course={course} />
                </Grid>
              ))}
            </Grid>
          </Box> */}

            
        
        </Box>
      )}
    </div>
  );
};

export default CourseList;
