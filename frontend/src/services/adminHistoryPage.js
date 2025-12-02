import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// GET history for event
export const getHistoryByEvent = (eventId) =>
  API.get(`/history/${eventId}`);

// ADD or UPDATE history
export const saveHistory = (eventId, formData) =>
  API.post(`/history/${eventId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export default API;
