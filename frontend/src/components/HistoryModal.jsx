import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { 
  FaUserFriends, FaFileAlt, FaCamera, FaVideo, FaList, FaMoneyBillWave, FaBook 
} from "react-icons/fa";

const HistoryModal = ({ show, onHide, eventData, historyData, onSubmit }) => {
  const [formData, setFormData] = useState({
    summary: "",
    highlights: "",
    attendees_count: "",
    guests: "",
    budget_spent: "",
    lessons_learned: "",
    long_summary: "",
    photos: [],
    videos: [],
  });

  const [existingMedia, setExistingMedia] = useState([]);
  const [photoPreview, setPhotoPreview] = useState([]);
  const [videoPreview, setVideoPreview] = useState([]);

  useEffect(() => {
    if (show && historyData) {
      setFormData({
        summary: historyData.summary || "",
        highlights: historyData.highlights || "",
        attendees_count: historyData.attendees_count || "",
        guests: historyData.guests || "",
        budget_spent: historyData.budget_spent || "",
        lessons_learned: historyData.lessons_learned || "",
        long_summary: historyData.long_summary || "",
        photos: [],
        videos: [],
      });
      setExistingMedia(Array.isArray(historyData.media) ? historyData.media : []);
      setPhotoPreview([]);
      setVideoPreview([]);
    }
  }, [show, historyData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    const files = [...e.target.files];
    if (type === "photos") {
      setFormData({ ...formData, photos: files });
      setPhotoPreview(files.map((f) => URL.createObjectURL(f)));
    }
    if (type === "videos") {
      setFormData({ ...formData, videos: files });
      setVideoPreview(files.map((f) => URL.createObjectURL(f)));
    }
  };

  const removeExistingMedia = (url) => {
    setExistingMedia((prev) => prev.filter((m) => m.url !== url));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("summary", formData.summary);
    fd.append("highlights", formData.highlights);
    fd.append("attendees", formData.attendees_count);
    fd.append("guests", formData.guests);
    fd.append("budget", formData.budget_spent);
    fd.append("lessons", formData.lessons_learned);
    fd.append("long_summary", formData.long_summary);
    fd.append("existingMedia", JSON.stringify(existingMedia));
    [...formData.photos, ...formData.videos].forEach((f) => fd.append("media", f));
    onSubmit(fd, eventData.id);
  };

  return (
       <div
      className="modal show d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        transition: "opacity 0.25s ease",
      }}
    >
    <Modal show={show} onHide={onHide} centered scrollable>
      <Modal.Header className="bg-primary text-white">
        <Modal.Title>
          <FaFileAlt className="me-2" /> Event History
        </Modal.Title>
        <Button variant="close" onClick={onHide} className="btn-close-white" />
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body style={{ maxHeight: "65vh", overflowY: "auto" }}>
          <h6 className="mb-3">
            <strong>{eventData?.title}</strong> ({eventData?.date})
          </h6>
 
          <Form.Group className="mb-3">
            <Form.Label><FaFileAlt className="me-1 text-primary" /> Summary <span  className="star">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FaList className="me-1 text-primary" /> Success Highlights</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="highlights"
              value={formData.highlights}
              onChange={handleChange}
            />
          </Form.Group>

          <Row>
            <Col md={4} className="mb-3">
              <Form.Label><FaUserFriends className="me-1 text-primary" /> Attendees</Form.Label>
              <Form.Control
                type="number"
                name="attendees_count"
                value={formData.attendees_count}
                onChange={handleChange}
              />
            </Col>
            <Col md={4} className="mb-3">
              <Form.Label><FaUserFriends className="me-1 text-primary" /> Guests</Form.Label>
              <Form.Control
                type="text"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
              />
            </Col>
            <Col md={4} className="mb-3">
              <Form.Label><FaMoneyBillWave className="me-1 text-primary"  /> Budget (₹)</Form.Label>
              <Form.Control
                type="number"
                name="budget_spent"
                value={formData.budget_spent}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label><FaBook className="me-1 text-primary" /> Lessons Learned</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="lessons_learned"
              value={formData.lessons_learned}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FaCamera className="me-1 text-primary" /> Upload Photos</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileChange(e, "photos")}
            />
          </Form.Group>

          {photoPreview.length > 0 && (
            <div className="d-flex flex-wrap mb-3">
              {photoPreview.map((src, i) => (
                <img key={i} src={src} alt="" className="img-thumbnail me-2 mb-2" style={{ height: "80px" }} />
              ))}
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label><FaVideo className="me-1 text-primary" /> Upload Videos</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => handleFileChange(e, "videos")}
            />
          </Form.Group>

          {videoPreview.length > 0 && (
            <div className="d-flex flex-wrap mb-3">
              {videoPreview.map((src, i) => (
                <video key={i} src={src} controls className="me-2 mb-2" style={{ height: "80px" }} />
              ))}
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label><FaFileAlt className="me-1 text-primary" /> Long Summary</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="long_summary"
              value={formData.long_summary}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="position-sticky bottom-0 bg-white border-top py-2">
          <Button type="submit" variant="primary">
            <FaFileAlt className="text-primary"/>Save History
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
    </div>
  );
};

export default HistoryModal;
