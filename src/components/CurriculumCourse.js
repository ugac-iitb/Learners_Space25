import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import "../styles/CurCourse.css";

const CurCourse = ({ courseData }) => {
  const weeks = [
    { label: "Week 1", content: courseData["Week 1"] },
    { label: "Week 2", content: courseData["Week 2"] },
    { label: "Week 3", content: courseData["Week 3"] },
    { label: "Week 4", content: courseData["Week 4"] },
    { label: "Extra Week", content: courseData["Week Null"] },
  ].filter(week => week.content);

  return (
    <div className="cd-Cur-main">
      <h3 className="cd-table-title">Course Curriculum</h3>
      <TableContainer component={Paper} className="cd-table-container">
        <Table className="cd-table" aria-label="course table">
          <TableHead>
            <TableRow>
              <TableCell className="cd-header-cell">Week</TableCell>
              <TableCell className="cd-header-cell">Content</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {weeks.map((week, index) => (
              <TableRow key={index}>
                <TableCell className="cd-week-cell">{week.label}</TableCell>
                <TableCell className="cd-content-cell">
                  {week.content.split("\n").map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CurCourse;
