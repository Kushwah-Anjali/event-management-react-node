import axios from "axios";
const Base_url=process.env.REACT_APP_API_URL;


export async function fetchEvent(eventId) {
  if (!eventId) return null;

  try {
    const { data } = await axios.get(
      `${Base_url}/api/events/event/${eventId}`
    );
    return data.status === "success" ? data.event : null;
  } catch (err) {
    console.error("fetchEvent failed", err);
    return null;
  }
}
