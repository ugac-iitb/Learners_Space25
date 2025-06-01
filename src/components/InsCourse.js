import { Avatar, Box, Typography } from "@mui/material";
import '../styles/InsCourse.css'
import testImg from '../data/images/img.png'

const InsCourse = ({courseData}) => {
    const ContactInfo = courseData["Contact info"];

    console.log(ContactInfo)

    const contacts = Array.from(ContactInfo.matchAll(/([^,]+?)\s*\(([^)]+)\)/g)).map(match => ({
        name: match[1].trim(),
        phone: match[2].trim(),
    }));
      
    console.log(contacts);
    return ( 
        <Box className="cd-profile-container">
            <img
                src={`${process.env.PUBLIC_URL}/data/images/clubs/${courseData["Course ID"]}.png`} 
                alt="Profile"
                className="cd-profile-avatar"
            />

            <Box className="cd-profile-info">
                <Typography variant="h4" className="cd-name">
                    {courseData["Club"]}
                </Typography>

                {contacts.map((contact, index) => (
                    <Typography key={index} className="cd-label">
                        <span className="cd-profile-subhead">{contact.name}:</span> <span>{contact.phone}</span>
                    </Typography>
                ))}


            </Box>
        </Box>
    );
}
 
export default InsCourse;