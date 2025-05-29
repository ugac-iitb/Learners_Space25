const OvCourse = ({courseData}) => {
    // console.log("Course Data:", courseData);
    return ( 
     <div className="cd-Ov-main">
        <h2>{courseData["Course Name"]}</h2>
        <p className="cd-course-description">
            {courseData["Desc"]}
        </p>

        <h3>Pre-requisities</h3>
        <p className="cd-course-description">
            {courseData["Pre-req"]}
        </p>

        <h3>Evaluation</h3>
        <p className="cd-course-description">
            {courseData["Evaluation"]}
        </p>

        <h3>Certification</h3>
        <p className="cd-course-description">
            {courseData["Certification"]}
        </p>
    </div>
    );
}
 
export default OvCourse;