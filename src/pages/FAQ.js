import React, { useEffect, useState } from 'react';
import CustomAccordion from '../components/FAQ_Accordians';
import FAQ_data from '../data/FAQ.json';
import { Box, Typography } from '@mui/material';
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
