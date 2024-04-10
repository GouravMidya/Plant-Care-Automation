import React from "react";
import AboutUsLay1 from "../components/aboutuslay1"; // Capitalized component name
import AboutUsLay2 from "../components/aboutuslay2";
import Aboutuslay3 from "../components/aboutuslay3";


function AboutUs() {
    return (
        <div className="aboutus">
            <AboutUsLay1 />
            <AboutUsLay2/>
            <Aboutuslay3/>  
        </div>
    );
}

export default AboutUs;
