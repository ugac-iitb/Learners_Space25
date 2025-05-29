import React from "react";
import "../styles/HomeCards.css";
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import useCountUpOnView from "../hooks/useCountOnView"; // adjust path as needed

export default function HomeCards({ index, title }) {
  const colors = ['#f2bc00', '#4540e1', '#15a280', '#F9406c'];
  const backColors = ['#fcf7e6', '#f3f2ff', '#e6faf5', '#ffeef2'];

  const icons = [
    <SchoolIcon sx={{ color: "white" }} fontSize="large" />,
    <GroupsIcon sx={{ color: "white" }} fontSize="large" />,
    <PlayCircleFilledWhiteIcon sx={{ color: "white" }} fontSize="large" />,
    <RecordVoiceOverIcon sx={{ color: "white" }} fontSize="large" />
  ];

  const match = title.match(/(\d+)/);
  const number = match ? parseInt(match[1]) : null;
  const prefix = match ? title.split(match[0])[0] : title;
  const suffix = match ? title.split(match[0])[1] : "";

  const [ref, animatedNumber] = useCountUpOnView(number);

  return (
    <div ref={ref} style={{ '--hover-bgcolor': backColors[index] }} className="home-card">
      <div style={{ '--hover-color': colors[index] }} className="icon-wrapper">
        {icons[index]}
      </div>
      <h3 className="card-title">
        {number !== null ? `${prefix}${animatedNumber}${suffix}` : title}
      </h3>
    </div>
  );
}
