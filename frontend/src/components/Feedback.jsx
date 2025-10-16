import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Navigation, Autoplay } from "swiper/modules";
import "../styles/Feedback.css";

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
    <section
      id="feedback"
      className="py-5 text-center text-white position-relative"
      style={{ background: "#0d0d4d" }}
    >
      <div className="container">
        <h2 className="fw-bold text-uppercase mb-3 display-6 text-white">
          💬 What Our Customers Say
        </h2>
        <p className="text-light opacity-75 mb-5">
          Real experiences from people who trusted us with their events
        </p>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {feedbackData.map((f, i) => (
            <SwiperSlide key={i}>
              <div className="card border-0 shadow feedback-card mx-2">
                <div className="card-body text-start">
                  <p className="fst-italic text-dark mb-4">{f.text}</p>
                  <div className="d-flex align-items-center">
                    <img
                      src={f.img}
                      alt={f.name}
                      className="rounded-circle me-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        border: "2px solid #0d0d2d",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">{f.name}</h6>
                      <small className="text-primary">{f.role}</small>
                    </div>
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
