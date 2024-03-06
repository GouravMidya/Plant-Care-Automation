import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import Navigation from './navigation';
import Header from './header';
import Layout1 from './layout1';
import Layout2 from './layout2';
import Products from './products';
import Contact from './contact';
import Footer from './footer';

function App() {
  const headerRef = useRef(null); // Create a ref for the header element
  const [headerHeight, setHeaderHeight] = useState(0); // State to store the header height

  useEffect(() => {
    // Calculate the header height
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);


  return (
    <div className="App">
        <Navigation />
        <Header ref={headerRef} />
        <Layout1 headerHeight={headerHeight} />
        <Layout2 />
        <Products />
        <Contact />
        <Footer />
    </div>
  );
}

export default App;
