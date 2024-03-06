import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Navigation from './navigation';
import Header from './header';
import Layout1 from './layout1';
import Layout2 from './layout2';
import Products from './products';
import Contact from './contact';
import Footer from './footer';
import Login from './login';
import Aboutus from './aboutus';
import Dashboard from './dashboard';
import Productpage from './productpage';

function App() {


  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path='/' element={<HomeWithLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/productpage" element={<Productpage />} />
        </Routes>
      </Router>
    </div>
  );
}

function HomeWithLayout() {
  const headerRef = useRef(null); // Create a ref for the header element
  const [headerHeight, setHeaderHeight] = useState(0); // State to store the header height

  useEffect(() => {
    // Calculate the header height
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);
  
  return (
    <>
    <Navigation />
    <Header ref={headerRef} />
    <Layout1 headerHeight={headerHeight} />
    <Layout2 />
    <Products />
    <Contact />
    <Footer />
    </>
  );
}

export default App;
