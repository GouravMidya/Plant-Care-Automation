import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Navigation from './components/navigation';
import Products from './components/products';
import Contact from './components/contact';
import Footer from './components/footer';
import Login from './pages/login';
import Aboutus from './pages/aboutus';
import Dashboard from './components/dashboard';
import Productpage from './pages/productpage';
import Blog from './components/blog';
import Signup from './pages/signup';
import Home from './pages/Home';

function App() {

  
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path='/' element={<Home />} />
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

export default App;
