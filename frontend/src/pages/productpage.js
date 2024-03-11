import React from "react";
import Navigation from "../components/navigation";
import Footer from '../components/footer';
import Products from '../components/products';



function productpage() {

    return (
      <div className="productpage">
          <Navigation />
          <Products />
          <Footer />
      </div>
    );
  }
  
  export default productpage;