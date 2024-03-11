import React from 'react';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
//import GoogleOAuth from '../components/GoogleOAuth'; // Adjust the path

function Login() {
  return (
    <div className="login">
      <Navigation />
      <div className="login-container">
        <div className="login-box">
          <h1>LOG IN</h1>
          <p>Please enter your email and password</p>
          <form>
            <div className="form-group">
              <label>Email</label>
              <input type="email" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" />
            </div>
            <button type="submit" className="button1">
              Login
            </button>
            {/* Add the Google OAuth component here */}
          </form>
          <div className="divider"></div>
          <button className="google-login">Login with Google</button>
          <p className="forgot-password">
            Forgot your password? <a href="#">Click here</a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
