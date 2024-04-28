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

export const checkEmail = async (email) => {
  try {
    const response = await axios.post(`${LOCAL_API_URL}/check-email`, { email });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export { signUp, login };