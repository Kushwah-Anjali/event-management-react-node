import axios from "axios";

// Axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Admin key helper
export const withAdminKey = (key) => ({
  headers: { "x-admin-key": key },
});

export const getUsers = () => API.get("/users");
export const addUser = (data, adminKey) => API.post("/users/add", data, withAdminKey(adminKey));
export const updateUser = (data, adminKey) => API.post("/users/update", data, withAdminKey(adminKey));
export const deleteUser = (data, adminKey) => API.post("/users/delete", data, withAdminKey(adminKey));

// Default export
export default API;
