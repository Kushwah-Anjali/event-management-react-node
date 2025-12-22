import axios from "axios";

const API_BASE = "http://localhost:5000";

export async function fetchEventHistory(eventId) {
  if (!eventId) return null;

  // 1️⃣ Fetch event
  const eventRes = await axios.get(`${API_BASE}/api/register/event/${eventId}`);
  const evt = eventRes.data.event || eventRes.data;

  // 2️⃣ Fetch history
  const historyRes = await axios.get(`${API_BASE}/api/history/${eventId}`);
  const history = historyRes.data.exists
    ? Array.isArray(historyRes.data.history)
      ? historyRes.data.history[0]
      : historyRes.data.history
    : null;

  // 3️⃣ Sections (event + history)
  const sections = [
    evt.summary && { title: "Summary", content: evt.summary },
    evt.long_summary && { title: "Long Summary", content: evt.long_summary },
    evt.highlights && { title: "Highlights", content: evt.highlights },
    evt.lessons && { title: "Lessons Learned", content: evt.lessons },

    history?.summary && {
      title: "History Summary",
      content: history.summary,
    },
    history?.long_summary && {
      title: "History Long Summary",
      content: history.long_summary,
    },
    history?.highlights && {
      title: "Event Highlights",
      content: history.highlights,
    },
    history?.lessons_learned && {
      title: "Lessons Learned",
      content: history.lessons_learned,
    },
  ].filter(Boolean); // removes false values

  // 4️⃣ Media
  const eventMedia = evt.media_links
    ? JSON.parse(evt.media_links).map((m) => ({
        ...m,
        src: `${API_BASE}/events/${m.url}`,
      }))
    : [];

  const historyMedia = Array.isArray(history?.media)
    ? history.media.map((m) => ({
        ...m,
        src: `${API_BASE}/history/${m.url}`,
      }))
    : [];

  return {
    ...evt,

    attendees_count:
      history?.attendees_count ?? evt.attendees_count ?? evt.attendees ?? 0,

    guests: history?.guests ?? evt.guests ?? 0,

    budget_spent:
      history?.budget_spent ?? evt.budget_spent ?? evt.budget ?? "N/A",

    sections,
    media: [...eventMedia, ...historyMedia],
  };
}
