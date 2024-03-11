import React from "react";
import Navigation from "../components/navigation";
import Contact from '../components/contact';
import Footer from '../components/footer';



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