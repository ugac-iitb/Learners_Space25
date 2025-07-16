import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import certImage from '../data/images/certifcate.png';
import UGACLogo from '../data/images/ugac.png'
import CareerCellLogo from '../data/images/Career_Cell_logo.png';
import Sign from '../data/images/sign.png';
import '../styles/Certificates.css';

const CertificateComponent = ({ student_name:name, course,club }) => {
  const pdfRef = useRef();

  console.log(club)

  const downloadPDF = async () => {
  const canvas = await html2canvas(pdfRef.current, {
    scale: 3,
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('landscape', 'pt', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

  const finalWidth = imgWidth * ratio;
  const finalHeight = imgHeight * ratio;

  // ✅ Center the image
  const x = (pdfWidth - finalWidth) / 2;
  const y = (pdfHeight - finalHeight) / 2;

  pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
  pdf.save(`${name}_certificate.pdf`);
};


  const CertificateContent = ({ className }) => (
    <div className={className} style={{ backgroundImage: `url(${certImage})` }}>
      <div className="cert-wrapper">
        <div className="cert-logo-row">
          <img src={CareerCellLogo} alt="Career Cell" className="cert-logo-cc" />
          
          <img 
            src={`${process.env.PUBLIC_URL}/data/images/club_logos/${club}.png` || UGACLogo}
            alt="UGAC"
            className="cert-logo" 
          />
        </div>

        <h1 className="cert-title">CERTIFICATE</h1>
        <h2 className="cert-subtitle">OF MERIT</h2>

        <p className="cert-text">This certificate is proudly awarded to</p>
        <h2 className="cert-name">{name}</h2>
        <p className="cert-text">for participating in and completing the course</p>
        <h3 className="cert-course">{course}</h3>
        <p className="cert-footer-text">in <strong>Learners’ Space 2025</strong></p>

        <div className="cert-emblem">
          <img src={Sign} alt="Signature" style={{ height: '80px', maxWidth: '200px', objectFit: 'contain' }} />
        </div>

        <div className="cert-signatures">
          <div>
            <div className="cert-signature-line"></div>
            <p>
              <strong>Parv Khandelwal</strong><br />
              Institute Secretary Academic Affairs<br />
              Head, Career Cell
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const CertificateContentPdf = ({ className }) => (
    <div className={className} style={{ backgroundImage: `url(${certImage})` }}>
      <div className="cert-wrapper-pdf">
        <div className="cert-logo-row-pdf">
          <img src={CareerCellLogo} alt="Career Cell" className="cert-logo-cc-pdf" />
          <img src={`${process.env.PUBLIC_URL}/data/images/club_logos/${club}.png`|| UGACLogo} alt="UGAC" className="cert-logo-pdf" />
        </div>

        <h1 className="cert-title-pdf">CERTIFICATE</h1>
        <h2 className="cert-subtitle-pdf">OF MERIT</h2>

        <p className="cert-text-pdf">This certificate is proudly awarded to</p>
        <h2 className="cert-name-pdf">{name}</h2>
        <p className="cert-text-pdf">for participating in and completing the course</p>
        <h3 className="cert-course-pdf">{course}</h3>
        <p className="cert-footer-text-pdf">in <strong>Learners’ Space 2025</strong></p>

        <div className="cert-emblem-pdf">
          <img src={Sign} alt="Signature" style={{ height: '90px', maxWidth: '300px', objectFit: 'contain' }} />
        </div>

        <div className="cert-signatures-pdf">
          <div>
            <div className="cert-signature-line-pdf"></div>
            <p>
              <strong>Parv Khandelwal</strong><br />
              Institute Secretary Academic Affairs<br />
              Head, Career Cell
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cert-container">
      <div className="cert-layout">
        {/* Responsive visible certificate */}
        <CertificateContent className="cert-certificate" />

        {/* Hidden, fixed-size certificate for PDF export */}
        {/* Hidden, fixed-size PDF version */}
        <div
          ref={pdfRef}
          className="cert-certificate-pdf"
          style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}
        >
          <CertificateContentPdf />
        </div>


        <div className="cert-button-wrapper">
          <button onClick={downloadPDF} className="cert-button">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateComponent;
