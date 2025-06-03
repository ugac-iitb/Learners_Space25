import React from "react";
import "../styles/HomePage.css";

// import homeImg from "../data/images/HomePage.png"
import homeImg from "../data/images/homeimg.webp";
import AboutIng from "../data/images/about-home.webp";
import AboutImgBg from "../data/images/aboutImgBg.png"
import homeCardData from "../data/HomeCards.json";
import HomeCards from "../components/HomeCards";
import { useNavigate } from "react-router-dom";

import itcLogo from "../data/images/ITC.png";
import iccLogo from "../data/images/ICC.png";
import iscLogo from "../data/images/ISC.png";
import ugacLogo from "../data/images/ugac.png";
import { Grid } from "@mui/material";

const HomePage = () => {
    const aboutText = "Learners' Space is an online platform with a set of diverse courses for you to start exploring various topics propagated by student bodies across the institute. We bring to you a plethora of courses, all made with utmost attention to help serve you the best! In this 9th edition of Learners' Space, we are back bigger and better, with 40+ courses spread across 6 schools, being offered by 25+ student bodies. The courses will be spread out over a few weeks, each week building your skills even more. Go through the courses section of the website to explore the topics in detail. We have received an enormous amount of participation in the past few years and this time, we hope to see you too!";

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/Schools");
    }
    return ( 
        <div>
            <section className="hero-section">
                {/* Text Content */}
                <div className="hero-text">
                    <h1 className="hero-heading">
                        Igniting Curiosity, Inspiring Excellence
                        
                    </h1>

                    <p className="hero-subtext">
                    This edition of Learners' Space brings to you carefully curated courses and the chance to upskill and learn various topics catering to the taste of students today!
                    </p>

                    <div className="hero-buttons">
                        <button onClick={()=>handleClick()} className="btn-primary">Get Started</button>
                    </div>
                </div>

                {/* Image */}
                <div className="hero-image">
                    <img
                    src={homeImg}
                    alt="Education Illustration"
                    />
                </div>
            </section>

            <section className="home-collab-section">
                <h1 className="collab-heading">
                    In Collaboration With
                </h1>

                <p className="collab-subtext">
                Brought to you by the Career Cell in collaboration with the student bodies of UGAC, ITC, ISC, and ICC, Department Councils (EESA, SAPD, Economics Association), Tech Teams (SHUNYA, Zero Waste, iGEM and ChemECA), ELP, EnB Club and the Sustainability Cell.
                </p>
                <Grid container className="collab-grid">
                    <Grid item className="collab-grid-item" md={3} sm={6} xs={12}>
                        <img className="collab-logo" src={ugacLogo} alt="" />
                    </Grid>
                    <Grid item className="collab-grid-item" md={3} sm={6} xs={12}>
                        <img className="collab-logo" style={{height:"140px"}} src={itcLogo} alt="" />
                    </Grid>
                    <Grid item className="collab-grid-item" md={3} sm={6} xs={12}>
                        <img className="collab-logo" style={{height:"140px"}} src={iccLogo} alt="" />
                    </Grid>
                    <Grid item className="collab-grid-item" md={3} sm={6} xs={12}>
                        <img className="collab-logo" src={iscLogo} alt="" />
                    </Grid>
                </Grid>
            </section>

            <section className="home-cards-section">
                {homeCardData.map((data, index) => (
                    <HomeCards key={index} title={data.title} description={data.desc} index={index} />
                ))}
            </section>

            <section className="about-section">

                <div className="about-image">
                    <img
                        className="about-main"
                        src={AboutIng}
                        alt="Education Illustration"
                    />
                    <img
                        className="about-bg"
                        src={AboutImgBg}
                        alt="Bg Image"
                    />
                </div>
                {/* Text Content */}
                <div className="about-text">
                    <h6 className="about-subheading">About Learners' Space</h6>
                    <h1 className="about-heading">
                    Explore. Evolve. Excel.
                        {/* <span className="highlight">Experience</span> with <span className="bold">Eduko.</span> */}
                    </h1>

                    <p className="about-subtext">
                        {aboutText}
                    </p>
                </div>
            </section>
        </div>
    );
}
 
export default HomePage;