// frontend/src/services/authServices.js
import axios from 'axios';
import { API_URL } from '../utils/apiConfig';
const LOCAL_API_URL = `${API_URL}/api/auth`

const signUp = async (formData) => {
  try {
    const response = await axios.post(`${LOCAL_API_URL}/signup`, formData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

const login = async (formData) => {
  try {
    const response = await axios.post(`${LOCAL_API_URL}/login`, formData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// const isAuthenticated = () => {
//   const token = localStorage.getItem('jwt');
//   if (token) {
//     const decoded = parseJwt(token);
//     return decoded;
//   }
//   return null;
// };

// const logout = () => {
//   localStorage.removeItem('jwt');
// };

// const parseJwt = (token) => {
//   const base64Url = token.split('.')[1];
//   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   const jsonPayload = decodeURIComponent(
//     atob(base64)
//       .split('')
//       .map(function (c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//       })
//       .join('')
//   );

//   return JSON.parse(jsonPayload);
// };

export { signUp, login };//, isAuthenticated, logout