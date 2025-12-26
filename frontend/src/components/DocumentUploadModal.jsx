import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaUpload } from "react-icons/fa";

const Base_Url = process.env.REACT_APP_API_URL;

const DocumentUploadModal = ({
  show,
  handleClose,
  event_id,
  email,
  requiredDocs = [],
}) => {
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Fetch ONLY uploaded docs
  useEffect(() => {
    if (!show || !event_id || !email) return;

    let isMounted = true;

    const fetchUploadedDocs = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${Base_Url}/api/register/getUserDocuments?email=${email}&event_id=${event_id}`
        );
        const data = await res.json();

        if (isMounted) {
          setUploadedDocs(data.uploadedDocs || {});
        }
      } catch (error) {
        console.error("Failed to fetch uploaded documents:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUploadedDocs();

    return () => {
      isMounted = false;
    };
  }, [show, event_id, email]);

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

      Object.entries(selectedFiles).forEach(([key, file]) => {
        formData.append(key, file);
      });

      const res = await fetch(
        `${Base_Url}/api/register/upload-documents`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        Swal.fire("Success", "Documents uploaded successfully!", "success");

        // ✅ Optimistic UI update
        setUploadedDocs((prev) => ({ ...prev, ...data.data }));
        setSelectedFiles({});
        handleClose();
      } else {
        Swal.fire("Upload Failed", data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title className="fw-bold d-flex align-items-center gap-2">
          <FaUpload />
          Upload Required Docs
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
            <p className="mt-2">Loading…</p>
          </div>
        ) : requiredDocs.length === 0 ? (
          <p className="text-center text-muted">
            No documents required for this event.
          </p>
        ) : (
          requiredDocs.map((doc, index) => (
            <div
              key={index}
              className="p-3 mb-3 border rounded bg-light"
            >
              <div className="d-flex justify-content-between">
                <strong>{doc}</strong>
                {uploadedDocs[doc] && (
                  <span className="badge bg-success">Uploaded</span>
                )}
              </div>

              {uploadedDocs[doc] && (
                <p className="text-success small mt-1">
                  File: {uploadedDocs[doc]}
                </p>
              )}

              <input
                type="file"
                className="form-control mt-2"
                onChange={(e) => handleFileChange(e, doc)}
              />
            </div>
          ))
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
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
