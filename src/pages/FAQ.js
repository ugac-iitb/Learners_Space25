import React, { useEffect, useState } from 'react';
import CustomAccordion from '../components/FAQ_Accordians';
import FAQ_data from '../data/FAQ.json';
import { Box, Typography,Grid } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import GrainIcon from '@mui/icons-material/Grain';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';
import '../styles/FAQ.css';

const FAQ = () => {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const [accordionData,setAccordionData] = useState([]);

    useEffect(()=>{
        if(FAQ_data) 
            setAccordionData(FAQ_data);
    },[]);

    return (
        <div>
            <Box className="banner-root">

                <CircleIcon className="decor-icon circle" />
                <LineAxisIcon className="decor-icon zigzag" />
                <BlurCircularIcon className="decor-icon blur" />
                <ChangeHistoryIcon className="decor-icon triangle" />
                <GrainIcon className="decor-icon dots" />

                <Typography variant="h2" className="banner-title">
                    FAQ
                </Typography>
            </Box>

            <Box className="course-list">
                <Typography variant="h2" className="course-list-title">Frequently Asked Questions</Typography>
{/* 
                <Box className="accordion-container"> */}
                    {accordionData.map((item, idx) => (
                        <CustomAccordion
                            key={idx}
                            index={idx}
                            expandedIndex={expandedIndex}
                            setExpandedIndex={setExpandedIndex}
                            title={item.title}
                            content={item.content}
                        />
                    ))}
                {/* </Box> */}
                
            </Box>
            
        </div>
    );
};

export default FAQ;
