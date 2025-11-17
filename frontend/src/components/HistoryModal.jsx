import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";

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

  const [existingMedia, setExistingMedia] = useState([]); // OLD media
  const [photoPreview, setPhotoPreview] = useState([]);
  const [videoPreview, setVideoPreview] = useState([]);

  // Reset + preload history if exists
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

      const existing = Array.isArray(historyData.media) ? historyData.media : [];
      setExistingMedia(existing);
      setPhotoPreview([]);
      setVideoPreview([]);
    }
  }, [show, historyData]);

  // Text fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // File uploads
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

  // Delete an existing image
  const removeExistingMedia = (url) => {
    setExistingMedia((prev) => prev.filter((m) => m.url !== url));
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    formDataToSend.append("summary", formData.summary);
    formDataToSend.append("highlights", formData.highlights);
    formDataToSend.append("attendees", formData.attendees_count);
    formDataToSend.append("guests", formData.guests);
    formDataToSend.append("budget", formData.budget_spent);
    formDataToSend.append("long_summary", formData.long_summary);
    formDataToSend.append("lessons", formData.lessons_learned);

    // Send list of existing media that user kept
    formDataToSend.append("existingMedia", JSON.stringify(existingMedia));

    // Add new uploaded files
    [...formData.photos, ...formData.videos].forEach((file) =>
      formDataToSend.append("media", file)
    );

    onSubmit(formDataToSend, eventData.id);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <div className="modal-content border-primary">

        {/* Header */}
        <div className="modal-header bg-primary text-white">
          <h5 className="modal-title">
            <i className="bi bi-clock-history me-2"></i> Event History
          </h5>
          <Button variant="close" onClick={onHide} className="btn-close-white" />
        </div>

        <Form onSubmit={handleSubmit} className="modal-body">

          <Alert variant="primary" className="py-2">
            <strong>{eventData?.title}</strong> ({eventData?.date})
          </Alert>

          <div className="mb-3 small text-muted">
            <strong>Venue:</strong> {eventData?.venue} <br />
            <strong>Author:</strong> {eventData?.author}
          </div>

          {/* Summary */}
          <Form.Group className="mb-3">
            <Form.Label>Event Summary *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Existing Media */}
          {existingMedia.length > 0 && (
            <div className="mb-3">
              <h6>Existing Media</h6>
              <div className="d-flex flex-wrap">
                {existingMedia.map((m, i) => (
                  <div key={i} className="me-2 mb-2 position-relative">
                    {m.type.startsWith("image") ? (
                      <img
                        src={`http://localhost:5000/history/${m.url}`}
                        className="img-thumbnail"
                        style={{ height: "80px" }}
                      />
                    ) : (
                      <video
                        src={`http://localhost:5000/history/${m.url}`}
                        controls
                        className="img-thumbnail"
                        style={{ height: "80px" }}
                      />
                    )}

                    <Button
                      size="sm"
                      variant="danger"
                      className="position-absolute top-0 end-0"
                      onClick={() => removeExistingMedia(m.url)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New photo preview */}
          {photoPreview.length > 0 && (
            <div className="mb-2 d-flex flex-wrap">
              {photoPreview.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="img-thumbnail me-2 mb-2"
                  style={{ height: "80px" }}
                />
              ))}
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Upload Photos</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileChange(e, "photos")}
            />
          </Form.Group>

          {/* New video preview */}
          {videoPreview.length > 0 && (
            <div className="mb-2 d-flex flex-wrap">
              {videoPreview.map((src, i) => (
                <video
                  key={i}
                  src={src}
                  controls
                  className="me-2 mb-2"
                  style={{ height: "80px" }}
                />
              ))}
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Upload Videos</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => handleFileChange(e, "videos")}
            />
          </Form.Group>

          {/* Highlights */}
          <Form.Group className="mb-3">
            <Form.Label>Success Highlights</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="highlights"
              value={formData.highlights}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Stats */}
          <Row>
            <Col md={4} className="mb-3">
              <Form.Label>Total Attendees</Form.Label>
              <Form.Control
                type="number"
                name="attendees_count"
                value={formData.attendees_count}
                onChange={handleChange}
              />
            </Col>

            <Col md={4} className="mb-3">
              <Form.Label>Speakers/Guests</Form.Label>
              <Form.Control
                type="text"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
              />
            </Col>

            <Col md={4} className="mb-3">
              <Form.Label>Budget Used (₹)</Form.Label>
              <Form.Control
                type="number"
                name="budget_spent"
                value={formData.budget_spent}
                onChange={handleChange}
              />
            </Col>
          </Row>

          {/* Lessons */}
          <Form.Group className="mb-3">
            <Form.Label>Lessons Learned</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="lessons_learned"
              value={formData.lessons_learned}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Long Summary */}
          <Form.Group className="mb-3">
            <Form.Label>Long Summary</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="long_summary"
              value={formData.long_summary}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="text-end">
            <Button type="submit" variant="primary">
              <i className="bi bi-upload me-2"></i> Save History
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default HistoryModal;
