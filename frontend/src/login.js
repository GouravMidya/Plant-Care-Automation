import React from "react";
import Navigation from "./navigation";
import Contact from './contact';
import Footer from './footer';



function login() {

    return (
      <div className="login">
          <Navigation />
          <Contact />
          <Footer />
      </div>
    );
  }
  
  export default login;