import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import Navigation from '../components/navigation';
import Footer from '../components/footer';
//import GoogleOAuth from '../components/GoogleOAuth'; // Adjust the path

function Login() {
  const responseGoogle = (response) => {
    // Handle the Google login response (e.g., store tokens, update UI)
    console.log(response);
  };

  return (
    <div className="login">
      <GoogleOAuthProvider clientId='455527957691-lhb9go1ft3jk6tip51qdk85j6uts6bs0.apps.googleusercontent.com'>
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
          <GoogleLogin
            clientId="455527957691-lhb9go1ft3jk6tip51qdk85j6uts6bs0.apps.googleusercontent.com"
            onSuccess={responseGoogle}
            onError={() => console.log('Login Failed')}
            />
          <p className="forgot-password">
            Forgot your password? <a href="#">Click here</a>
          </p>
        </div>
      </div>
      <Footer />
      </GoogleOAuthProvider>
    </div>
  );
}

export default Login;
