// frontend/src/utils/authUtils.js
import mongoose from 'mongoose';

const TOKEN_KEY = 'jwt';

export const isAuthenticated = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    const decoded = parseJwt(token);
    return decoded;
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const parseJwt = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  const payload = JSON.parse(jsonPayload);
  // Convert the _id string to an ObjectId
  if (payload._id) {
    payload._id = new mongoose.Types.ObjectId(payload._id);
  }
  return payload;
};