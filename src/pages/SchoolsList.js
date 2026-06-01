import React from 'react';
import { Box, Typography } from '@mui/material';
import '../styles/SchoolsList.css';
import SchoolCards from '../components/SchoolCards';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';

const SchoolList = () => {
    return ( 
        <div>
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