// services/contactService.js
const BASE_URL = process.env.REACT_APP_API_URL;
export async function sendContactMessage(formData, onProgress) {
  let progress = 10;
  onProgress(progress);

  const interval = setInterval(() => {
    if (progress < 90) {
      progress += 10;
      onProgress(progress);
    }
  }, 200);

  try {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    onProgress(100);
    return data;
  } catch (error) {
    throw new Error("Server Error");
  } finally {
    clearInterval(interval);
  }
}
