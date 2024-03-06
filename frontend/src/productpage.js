import React from "react";
import Navigation from "./navigation";
import Contact from './contact';
import Footer from './footer';



function productpage() {

    return (
      <div className="productpage">
          <Navigation />
          <Contact />
          <Footer />
      </div>
    );
  }
  
  export default productpage;