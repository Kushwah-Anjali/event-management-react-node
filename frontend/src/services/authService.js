// 🧠 This file is a helper for React to talk to your backend for login/signup etc.
// We keep backend calls here so our components stay clean.

// Step 1: Import axios to make HTTP requests
import axios from "axios";
// Step 2: Setup your backend URL

const API_URL = process.env.REACT_APP_API_URL ;
// Step 3: Create a function to log in a user
// credentials = { email: "abc@gmail.com", password: "12345" }
export const loginUser = async (credentials) => {
  try {
    // ✅ Send POST request to backend login route
    const response = await axios.post(`${API_URL}/api/auth/login`, credentials);

    // ✅ Return the backend response data to the component
    // This includes status, token, and user info
    return response.data;
  } catch (error) {
    // ❌ If backend says "Invalid password" or "User not found", throw error
    // The component (Login.jsx) will handle showing a SweetAlert
    throw error;
  }
};
