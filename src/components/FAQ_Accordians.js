import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import '../styles/FAQ_Accordion.css';

const CustomAccordion = ({ index, expandedIndex, setExpandedIndex, title, content }) => {
  const isExpanded = expandedIndex === index;

  const handleChange = () => {
    setExpandedIndex(isExpanded ? null : index);
  };

  return (
    <Accordion expanded={isExpanded} onChange={handleChange} className='custom-accordion'>
      <AccordionSummary
        expandIcon={
          <IconButton className="accordion-icon">
            {isExpanded ? <RemoveIcon sx={{color:'white'}} /> : <AddIcon sx={{color:'inherit'}}/>}
          </IconButton>
        }
        className={`accordion-summary ${isExpanded ? 'expanded' : ''}`}
      >
        <Typography className="accordion-title">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails className="accordion-details">
        <Typography>{content}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default CustomAccordion;
