import axios from "axios";

// URL of your Node backend
const API_URL = process.env.REACT_APP_API_URL + "/events";
export const getEvents = () => axios.get(API_URL);
export const addEvent = (data) => axios.post(API_URL, data);
export const updateEvent = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteEvent = (id) => axios.delete(`${API_URL}/${id}`);
