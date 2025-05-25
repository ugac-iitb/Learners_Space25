import React, { use, useEffect, useState } from 'react';
import { Box, Typography,Grid } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import GrainIcon from '@mui/icons-material/Grain';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';
import '../styles/SchoolsList.css';
import schoolData from '../data/SchoolInfo.json' 
import SchoolCards from '../components/SchoolCards';

const SchoolList = () => {
    const [schoolDetails,setSchoolDetails] = useState([]);

    useEffect(() => {
        setSchoolDetails(schoolData);

        console.log(schoolData)
    }
    , []);

    return ( 
        <div>
            <Box className="banner-root">
            {/* Decorative icons */}
                <CircleIcon className="decor-icon circle" />
                <LineAxisIcon className="decor-icon zigzag" />
                <BlurCircularIcon className="decor-icon blur" />
                <ChangeHistoryIcon className="decor-icon triangle" />
                <GrainIcon className="decor-icon dots" />

                {/* Title and breadcrumb */}
                <Typography variant="h2" className="banner-title">
                    Course
                </Typography>
            </Box>
            <Box className="course-list">
                <Typography variant="div" className='course-list-subtitle'> Our Courses</Typography>
                <Typography variant="h2" className="course-list-title">Explore Courses in Various Schools</Typography>

                <Box className="course-list-cards">
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px' }}>
                        {schoolDetails && schoolDetails.map((school, index) => (
                            <div 
                                key={index} 
                                style={{
                                    flex: '1 1 calc(33.333% - 24px)', // 3 columns with gap consideration
                                    maxWidth: 'calc(33.333% - 24px)',
                                    boxSizing: 'border-box',
                                    minWidth: '280px', // fallback for small screens
                                }}
                            >
                            <SchoolCards 
                                title={school["School Name"]}
                                description={school["Description"]}
                                id = {school["School ID"]}
                            />
                            </div>
                        ))}
                    </div>
                </Box>
            </Box>
        </div>
    );
}
 
export default SchoolList;