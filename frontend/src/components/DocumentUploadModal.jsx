import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

const DocumentUploadModal = ({ show, handleClose, event_id, email }) => {
  const [requiredDocs, setRequiredDocs] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch required + uploaded documents when modal opens
  useEffect(() => {
    if (!show || !event_id || !email) return;

    const fetchDocs = async () => {
      try {
        setLoading(true);

        // 1️⃣ Get required docs for this event
       const reqRes = await fetch(
  `http://localhost:5000/api/register/required-docs/${event_id}`
);

        
        const reqData = await reqRes.json();
        if (reqData.status === "success") {
          setRequiredDocs(reqData.required_docs || []);
        }

        // 2️⃣ Get already uploaded docs for this user
        const upRes = await fetch(
          `http://localhost:5000/api/register/getUserDocuments?email=${email}&event_id=${event_id}`
        );
        const upData = await upRes.json();
        if (upData.status === "success") {
          setUploadedDocs(upData.uploadedDocs || []);
        }
      } catch (err) {
        console.error("❌ Error loading documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [show, event_id, email]);

  // 🔹 Handle file selection
  const handleFileChange = (e, docName) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [docName]: e.target.files[0],
    }));
  };

  // 🔹 Upload selected documents
  const handleUpload = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("event_id", event_id);
      formData.append("email", email);

      Object.entries(selectedFiles).forEach(([docName, file]) => {
        if (file) formData.append("files", file);
      });

      const res = await fetch(
        "http://localhost:5000/api/register/upload-documents",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.status === "success") {
        alert("✅ Documents uploaded successfully!");
        setUploadedDocs((prev) => [...prev, ...data.files]);
        setSelectedFiles({});
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("❌ Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Required Documents</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : requiredDocs.length === 0 ? (
          <p>No documents required for this event.</p>
        ) : (
          requiredDocs.map((doc) => (
            <div key={doc} className="mb-3">
              <label className="form-label fw-semibold">{doc}</label>
              {uploadedDocs.includes(doc) ? (
                <div className="text-success">✅ Already Uploaded</div>
              ) : (
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => handleFileChange(e, doc)}
                />
              )}
            </div>
          ))
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleUpload}
          disabled={loading || Object.keys(selectedFiles).length === 0}
        >
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DocumentUploadModal;
