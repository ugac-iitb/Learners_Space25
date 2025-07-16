import '../styles/CertificatePage.css';
import { Box, Typography,Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import GrainIcon from '@mui/icons-material/Grain';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';
import CertificateComponent from '../components/Certificates';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const CertificatePage = () => {
    const [certificates, setCertificates] = useState([]);
    const [isCertificate, setIsCertificate] = useState(false);
    const [loading, setLoading] = useState(true);

    const baseURL = process.env.REACT_APP_baseURL;

    const token = useSelector((state) => state.auth.token);

    const fetchCertificates = async () => {
        try {
            const response = await axios.get(`${baseURL}user/cert`,{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            }); // Adjust the endpoint as needed
            console.log(response.data);
            setCertificates(response.data);
            setIsCertificate(true);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching certificates:', error);   
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchCertificates();
    },[])

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
                    Certificates
                </Typography>
            </Box>

            {!loading && (<Box className="cert-list">
                {isCertificate && certificates && (<TableContainer component={Paper} className="cd-table-container">
                    <Table className="cd-table" aria-label="course table">
                        <TableHead>
                            <TableRow>
                            <TableCell className="cd-header-cell">Course</TableCell>
                            <TableCell className="cd-header-cell">Certificate</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {certificates.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="cd-week-cell">{item.course}</TableCell>
                                <TableCell className="cd-content-cell">
                                    <CertificateComponent {...item} />
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>)}
                {!isCertificate && (
                    <Typography variant="h5" className="no-cert-text">
                        No certificates available.
                    </Typography>
                )}
            </Box>)}
        </div>
     );
}
 
export default CertificatePage;