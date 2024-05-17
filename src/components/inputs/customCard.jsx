import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const CustomCard = ({ card }) => {
  const [show, setShowModal] = useState(false);

  function openModal(card) {
    setShowModal(true);
  }

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  return (
    <>
      <div style={styles.card} onClick={openModal}>
        <b>{card.title}</b>
        <p>{card.email}</p>
        <p>{card.phone}</p>
        <p>{card.option1}</p>
        <p>{card.option2}</p>
        <p>{card.message}</p>
      </div>
      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{card.title}</Modal.Title>
          <Button style={{ float: "right" }} variant="primary">
            Salvar Mudanças
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div>dsfgsd</div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px",
    margin: "10px 0",
    backgroundColor: "#fff",
  },
};

export default CustomCard;
