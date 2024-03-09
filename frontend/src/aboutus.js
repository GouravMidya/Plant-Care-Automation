import React from "react";
import Navigation from "./navigation";
import Contact from './contact';
import Footer from './footer';
import AboutUsLay1 from "./aboutuslay1"; // Capitalized component name
import './aboutus.css';
import AboutUsLay2 from "./aboutuslay2";
import './App.css'
import Aboutuslay3 from "./aboutuslay3";


function AboutUs() {
    return (
        <div className="aboutus">
            <Navigation />
            <AboutUsLay1 />
            <AboutUsLay2/>
            <Aboutuslay3/>
            <Footer />
        </div>
    );
}

export default AboutUs;
