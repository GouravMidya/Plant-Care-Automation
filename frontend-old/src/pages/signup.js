import React from 'react';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
//import GoogleOAuth from '../components/GoogleOAuth'; // Adjust the path

function signup() {
  return (
    <div className="login">
      <Navigation />
      <div className="signup-container">
        <div className="login-box">
          <h1 className='signup'>SIGN UP</h1>
          <p>Please enter your email and password</p>
          <form>
            <div className="form-group">
              <label>Email</label>
              <input type="email" />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input type="text" />
            </div>
            <div className="form-group">
              <label>Region</label>
              <input type="text" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" />
            </div>
            <button type="submit" className="button1">
              SIGNUP
            </button>
            {/* Add the Google OAuth component here */}
          </form>
          <div className="divider"></div>
          <button className="google-login">Sign in with Google</button>
          <p className="forgot-password">
            Forgot your password? <a href="#">Click here</a>
          </p>
          <br></br>
          <br></br>
          <br></br>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default signup;
