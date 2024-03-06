import React from "react";
import Navigation from "./navigation";
import Contact from './contact';
import Footer from './footer';



function aboutus() {

    return (
      <div className="aboutus">
          <Navigation />
          <Contact />
          <Footer />
      </div>
    );
  }
  
  export default aboutus;