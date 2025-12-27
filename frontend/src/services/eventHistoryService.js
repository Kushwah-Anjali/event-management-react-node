import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

export async function fetchEventHistory(eventId) {
  if (!eventId) return null;

  try {
    const { data } = await axios.get(
      `${API_BASE}/api/events/history/${eventId}`
    );

    // 🔥 return HISTORY, not event
    return data.history;
  } catch (err) {
    console.error("fetchEventHistory failed:", err);
    return null;
  }
}

