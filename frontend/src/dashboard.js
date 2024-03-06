import React from "react";
import Navigation from "./navigation";
import Contact from './contact';
import Footer from './footer';



function dashboard() {

    return (
      <div className="dashboard">
          <Navigation />
          <Contact />
          <Footer />
      </div>
    );
  }
  
  export default dashboard;