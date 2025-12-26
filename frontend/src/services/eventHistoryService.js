import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

export async function fetchEventHistory(eventId) {
  if (!eventId) return null;

  try {
    // Only ONE API call now
    const { data } = await axios.get(`${API_BASE}/api/events/history/${eventId}`);
    // backend already returns everything normalized
    return data.event;
  } catch (err) {
    console.error("fetchEventHistory failed:", err);
    return null;
  }
}
