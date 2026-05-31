import React from 'react';
import { Box, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import GrainIcon from '@mui/icons-material/Grain';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';
import '../styles/SchoolsList.css';
import SchoolCards from '../components/SchoolCards';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';

const SchoolList = () => {
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
                    Courses
                </Typography>
            </Box>
            <Box className="course-list">
                <Typography variant="div" className='course-list-subtitle'> Our Courses</Typography>
                <Typography variant="h2" className="course-list-title">Choose Your Summer School</Typography>

                <Box className="course-list-cards">
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px' }}>
                        <div
                            style={{
                                flex: '1 1 calc(33.333% - 24px)',
                                maxWidth: 'calc(33.333% - 24px)',
                                boxSizing: 'border-box',
                                minWidth: '280px',
                            }}
                        >
                            <SchoolCards
                                title="Technical Summer School (TSS)"
                                description="Explore technical courses across engineering, sciences, CS/DS and more."
                                id="3"
                                navigateTo="/Schools/TSS"
                                icon={<EngineeringIcon fontSize="large" />}
                            />
                        </div>

                        <div
                            style={{
                                flex: '1 1 calc(33.333% - 24px)',
                                maxWidth: 'calc(33.333% - 24px)',
                                boxSizing: 'border-box',
                                minWidth: '280px',
                            }}
                        >
                            <SchoolCards
                                title="Non Technical Summer School (NTSS)"
                                description="Explore non-technical courses across management, communication, sustainability and more."
                                id="2"
                                navigateTo="/Schools/NTSS"
                                icon={<PsychologyAltIcon fontSize="large" />}
                            />
                        </div>
                    </div>
                </Box>
            </Box>
        </div>
    );
}
 
export default SchoolList;