import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import TrackingCodeScanner from '../inputs/trackingCodeScanner'
import apiRequest from "../../modules/apiRequest";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OrderModal({ data, handleShowModal, handleCloseModal, showModal }) {
  const [user, setUserData] = useState([]);
  const [show, setShowModal] = useState(showModal);
  const [trackingData, setTrackingData] = useState([]);
  const [tabKey, setTabKey] = useState("user");
  const [loader, setLoader] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [isTrack, setIsTrack] = useState(false);

  handleCloseModal = () => setShowModal(false);
  handleShowModal = () => setShowModal(true);

  useEffect(() => {
    async function userData() {
      userData = await apiRequest("/api/directus/users?userId=" + data.user, "", "GET");
      setUserData(userData);
    }
    userData();

    if (data.tracking_code) {
      setTrackingCode(data.tracking_code);
      setIsTrack(true);
    }
  }, []);

  function trackingCodeHandleChange(e) {
    setTrackingCode(e.target.value);
  }

  async function updateOrder(e) {
    await apiRequest("/api/directus/update-order", { orderId: data.id, formData: { tracking_code: trackingCode } }, "POST");
    toast.success("Código de rastreamento salvo");
  }

  return (
    <div>
      <a style={{ cursor: "pointer" }} variant="primary" onClick={handleShowModal}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-truck" viewBox="0 0 16 16">
          <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
        </svg>
      </a>

      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{user.name_associate + " " + user.lastname_associate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TrackingCodeScanner />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary">Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OrderModal;
