import React from "react";
import "../styles/Feedback.css";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

// Import modules directly
import { Navigation, Autoplay } from "swiper/modules";

// Feedback Data
const feedbackData = [
  {
    text: "Amazing experience! The team managed everything smoothly and the event went beyond expectations.",
    name: "Rohit Sharma",
    role: "Corporate Client",
    img: "https://i.pravatar.cc/80?img=12",
  },
  {
    text: "Very professional and supportive. I loved how they customized everything for our college fest.",
    name: "Anjali Mehta",
    role: "College Event",
    img: "https://i.pravatar.cc/80?img=32",
  },
  {
    text: "Top-notch service and great coordination. Highly recommend for weddings and private functions.",
    name: "Rahul Verma",
    role: "Wedding Client",
    img: "https://i.pravatar.cc/80?img=44",
  },
];

export default function Feedback() {
  return (
    <section id="feedback" className="feedback-section">
      <div className="container">
        <h2 className="section-title">💬 What Our Customers Say</h2>
        <p className="section-subtitle">
          Real experiences from people who trusted us with their events
        </p>

        <Swiper
          modules={[Navigation, Autoplay]} // Pass modules here
          spaceBetween={30}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {feedbackData.map((f, i) => (
            <SwiperSlide key={i}>
              <div className="feedback-card">
                <div className="feedback-text">{f.text}</div>
                <div className="feedback-user">
                  <img src={f.img} alt={f.name} className="user-img" />
                  <div>
                    <h4>{f.name}</h4>
                    <span>{f.role}</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
