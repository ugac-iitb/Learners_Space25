const OvCourse = ({ courseData }) => {
    const decodeUnicode = (str) => {
      try {
        return JSON.parse(`"${str}"`);
      } catch (e) {
        return str;
      }
    };
  
    const renderParagraphs = (raw) => {
      const decoded = decodeUnicode(raw || "");
      return decoded.split("\n").map((line, i) => (
        <p key={i} className="cd-course-description">{line}</p>
      ));
    };
  
    return (
      <div className="cd-Ov-main">
        <h2 className="cd-course-name">{decodeUnicode(courseData["Course Name"])}</h2>
  
        <h3>Description</h3>
        {renderParagraphs(courseData["Desc"])}
  
        <h3>Pre-requisites</h3>
        {renderParagraphs(courseData["Pre-req"])}
  
        <h3>Evaluation</h3>
        {renderParagraphs(courseData["Evaluation"])}
  
        <h3>Certification</h3>
        {renderParagraphs(courseData["Certification"])}
      </div>
    );
  };
  
  export default OvCourse;
  