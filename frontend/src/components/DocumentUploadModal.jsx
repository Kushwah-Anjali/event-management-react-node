import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaUpload } from "react-icons/fa";

const DocumentUploadModal = ({ show, handleClose, event_id, email }) => {
  const [requiredDocs, setRequiredDocs] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [loading, setLoading] = useState(false);

  // Use ref to store previous event_id/email to avoid unnecessary re-fetch
  const prevEventRef = useRef({ event_id: null, email: null });

  useEffect(() => {
    if (!show) return;

    // Only fetch if event_id or email changed or if first open
    if (
      prevEventRef.current.event_id === event_id &&
      prevEventRef.current.email === email &&
      requiredDocs.length > 0
    ) {
      return; // Already fetched for this event
    }

    let isMounted = true;

    const fetchDocs = async () => {
      try {
        setLoading(true);

        // Fetch required docs
        const reqRes = await fetch(
          `http://localhost:5000/api/register/required-docs/${event_id}`
        );
        const reqData = await reqRes.json();
        if (!isMounted) return;

        if (reqData.status === "success") {
          setRequiredDocs(reqData.required_docs);
        } else {
          console.error("Failed to load required documents");
        }

        // Fetch uploaded docs
        const upRes = await fetch(
          `http://localhost:5000/api/register/getUserDocuments?email=${email}&event_id=${event_id}`
        );
        const upData = await upRes.json();
        if (!isMounted) return;

        setUploadedDocs(upData.uploadedDocs || {});

        // Save current event/email to ref
        prevEventRef.current = { event_id, email };
      } catch (error) {
        console.error("Unable to fetch documents:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDocs();

    return () => {
      isMounted = false;
    };
  }, [show, event_id, email, requiredDocs.length]);

  const handleModalClose = () => {
    setSelectedFiles({});
    handleClose();
  };

  const handleFileChange = (e, docName) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [docName]: e.target.files[0],
    }));
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("event_id", event_id);
      formData.append("email", email);

      Object.entries(selectedFiles).forEach(([docKey, file]) => {
        formData.append(docKey, file);
      });

      const res = await fetch(
        "http://localhost:5000/api/register/upload-documents",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (data.success) {
        Swal.fire("Success", "Documents uploaded successfully!", "success");
        setUploadedDocs((prev) => ({ ...prev, ...data.data }));
        setSelectedFiles({});
        handleModalClose();
      } else {
        Swal.fire(
          "Upload Failed",
          data.message || "Something went wrong.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", "Upload failed. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton className="bg-primary btn-close-white">
        <Modal.Title className="fw-bold d-flex align-items-center gap-2 text-white ms-3">
          <FaUpload className="text-light" />
          Upload Required Docs
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
            <p className="mt-2">Loading documents…</p>
          </div>
        ) : requiredDocs.length === 0 ? (
          <p className="text-center text-muted">
            No documents required for this event.
          </p>
        ) : (
          requiredDocs.map((doc, index) => (
            <div
              key={index}
              className="p-3 mb-3 border rounded bg-light shadow-sm"
            >
              <div className="d-flex justify-content-between mb-2">
                <strong>{doc}</strong>
                {uploadedDocs[doc] && (
                  <span className="badge bg-success">Uploaded</span>
                )}
              </div>

              {uploadedDocs[doc] && (
                <p className="text-success small mb-2">
                  <strong>File:</strong> {uploadedDocs[doc]}
                </p>
              )}

              <label className="form-label mb-1">
                {uploadedDocs[doc] ? "Re-upload file" : "Upload file"}
              </label>

              <input
                type="file"
                className="form-control"
                onChange={(e) => handleFileChange(e, doc)}
              />
            </div>
          ))
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleModalClose}
          disabled={loading}
        >
          Cancel
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
