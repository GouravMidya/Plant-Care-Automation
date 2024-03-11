import React from "react";
import Navigation from "../components/navigation";
import Footer from '../components/footer';
import AboutUsLay1 from "../components/aboutuslay1"; // Capitalized component name
import '../components/aboutus.css';
import AboutUsLay2 from "../components/aboutuslay2";
import '../App.css';
import Aboutuslay3 from "../components/aboutuslay3";


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
