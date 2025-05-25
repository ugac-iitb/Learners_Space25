import React from 'react';
import { Box, Typography } from '@mui/material';
import WebIcon from '@mui/icons-material/Web'; // example icon
import '../styles/SchoolCards.css';
import { Link } from 'react-router-dom';
import ScienceIcon from '@mui/icons-material/Science';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ComputerIcon from '@mui/icons-material/Computer';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';

const SchoolCards = ({title,description, id}) => {

    const colors = {
        "1": '#f2bc28', 
        "2": '#15a280',
        "3": '#4540e1', 
        "4": '#F9406c',
        "5": '#0467fd',  
        "6": '#ff4c27'
    };

    const iconOptions = {
        "1":{ name: 'Science', icon: <ScienceIcon fontSize="large" /> },
        "2":{ name: 'Eng', icon: <EngineeringIcon fontSize="large" /> },
        "3":{ name: 'Web', icon: <ComputerIcon fontSize="large" /> },
        "4":{ name: 'Energy', icon: <EnergySavingsLeafIcon fontSize="large" /> },
        "5":{ name: 'Management', icon: <AccountBalanceIcon fontSize="large" /> },
        "6":{ name: 'Sports', icon: <SportsBasketballIcon fontSize="large" /> },
    };

    const colVal = colors[id];
    const iconVal = iconOptions[id];

    title = title.trim();
    return ( 
        <div>
            <Box className="design-card" style={{ '--hover-color': colVal }}>
                
                {/* Icon section */}
                <Box className="design-icon">
                    {iconVal.icon}
                </Box>
                
                <Box className="card-content">
                    <Typography variant="h6" className="design-title">
                        <Link to={`/Schools/${id}`} className="design-link">
                            {title}
                        </Link>
                    </Typography>
                    <Typography variant="body2" className="design-desc">
                        {description}
                    </Typography>
                </Box>

                
            </Box>
        </div>
    );
}
 
export default SchoolCards;