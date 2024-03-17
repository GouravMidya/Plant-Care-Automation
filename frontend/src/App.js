import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Navigation from './components/navigation';
import Header from './components/header';
import Layout1 from './components/layout1';
import Layout2 from './components/layout2';
import Products from './components/products';
import Contact from './components/contact';
import Footer from './components/footer';
import Login from './pages/login';
import Aboutus from './pages/aboutus';
import Dashboard from './components/dashboard';
import Productpage from './pages/productpage';
import Blog from './components/blog';
import Signup from './pages/signup';
import Usercard from './components/card'

function App() {

  
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path='/' element={<HomeWithLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/blog" element={<Blog />} />
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
