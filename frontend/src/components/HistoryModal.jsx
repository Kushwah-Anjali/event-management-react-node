import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import {
  FaUserFriends,
  FaFileAlt,
  FaCamera,
  FaVideo,
  FaList,
  FaMoneyBillWave,
  FaBook,
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
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (show && historyData != null) {
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
      setExistingMedia(
        Array.isArray(historyData?.media) ? historyData.media : []
      );
    }
  }, [show, historyData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSmartPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotos((prev) => [
      ...prev,
      { file, preview: URL.createObjectURL(file) },
    ]);

    e.target.value = ""; // reset input
  };
  const handleSmartVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newVideo = {
      file: file,
      preview: URL.createObjectURL(file),
    };

    setVideos((prev) => [...prev, newVideo]);

    e.target.value = ""; // reset input so same file can reupload
  };

  const handleFileChange = (e, type) => {
    const files = [...e.target.files];
    if (type === "videos") {
      setFormData({ ...formData, videos: files });
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

 photos.forEach((p) => fd.append("media", p.file));
videos.forEach((v) => fd.append("media", v.file));


    onSubmit(fd, eventData?.id ?? "");
    onHide(); // 🔥 critical fix
  };

  return (
    <Modal show={show} onHide={onHide} centered scrollable>
      <Modal.Header closeButton className="bg-primary text-white ">
        <Modal.Title>
          <FaFileAlt className="me-2" /> Event History
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body
          style={{ maxHeight: "65vh", overflowY: "auto", overflowX: "hidden" }}
        >
          <Form.Group className="mb-3">
            <Form.Label>
              <FaFileAlt className="me-1 text-primary" /> Summary{" "}
              <span className="star">*</span>
            </Form.Label>
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
            <Form.Label>
              <FaList className="me-1 text-primary" /> Success Highlights
            </Form.Label>
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
              <Form.Label>
                <FaUserFriends className="me-1 text-primary" /> Attendees
              </Form.Label>
              <Form.Control
                type="number"
                name="attendees_count"
                value={formData.attendees_count}
                onChange={handleChange}
              />
            </Col>
            <Col md={4} className="mb-3">
              <Form.Label>
                <FaUserFriends className="me-1 text-primary" /> Guests
              </Form.Label>
              <Form.Control
                type="text"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
              />
            </Col>
            <Col md={4} className="mb-3">
              <Form.Label>
                <FaMoneyBillWave className="me-1 text-primary" /> Budget (₹)
              </Form.Label>
              <Form.Control
                type="number"
                name="budget_spent"
                value={formData.budget_spent}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>
              <FaBook className="me-1 text-primary" /> Lessons Learned
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="lessons_learned"
              value={formData.lessons_learned}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaCamera className="me-1 text-primary" /> Upload Photos
            </Form.Label>

            {/* Show uploaded photos */}
            {photos.map((p, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <img
                  src={p.preview}
                  className="img-thumbnail me-2"
                  style={{ height: "70px" }}
                />

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    setPhotos((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  Remove
                </Button>
              </div>
            ))}

            {/* Always visible single upload input */}
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleSmartPhotoUpload}
              className="mt-2"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FaVideo className="me-1 text-primary" /> Upload Videos
            </Form.Label>

            {videos.map((v, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <video
                  src={v.preview}
                  className="me-2 rounded"
                  style={{ height: "70px" }}
                  controls
                />

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    setVideos((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  Remove
                </Button>
              </div>
            ))}

            <Form.Control
              type="file"
                 className="mt-2"
              accept="video/*"
             onChange={handleSmartVideoUpload}
             
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FaFileAlt className="me-1 text-primary" /> Long Summary
            </Form.Label>
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
          <Button type="submit" variant="primary" className="rounded-pill px-3">
            <FaFileAlt className="text-primary" />
            Save History
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default HistoryModal;
