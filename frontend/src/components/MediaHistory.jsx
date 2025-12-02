import React, { useState, useMemo } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function MediaHistory({ media = [], thumbnailWidth = 50 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Only images for lightbox
  const slides = useMemo(() => media.filter(m => m.type !== "video").map(m => ({ src: m.src })), [media]);

  if (!media.length) return "-"; // Return dash if no media

  const handleOpen = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  return (
    <div className="d-flex flex-wrap gap-2">
      {media.map((m, i) =>
        m.type === "video" ? (
          <video
            key={i}
            src={m.src}
            width={thumbnailWidth}
            className="rounded img-fluid"
            style={{ cursor: "pointer", maxWidth: "100%", height: "auto" }}
            controls
          />
        ) : (
          <img
            key={i}
            src={m.src}
            width={thumbnailWidth}
            className="rounded img-fluid"
            style={{ cursor: "pointer", maxWidth: "100%", height: "auto", objectFit: "cover" }}
            onClick={() => handleOpen(slides.findIndex(s => s.src === m.src))}
          />
        )
      )}

      {isOpen && (
        <Lightbox
          slides={slides}
          open={isOpen}
          index={currentIndex}
          close={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
