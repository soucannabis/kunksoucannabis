import React, { useState, useEffect } from "react";
import Toast from "react-bootstrap/Toast";

const Anotations = ({ anotations, anotationsHandleChange, addAnotation, deleteAnotation }) => {
  const [anotationsData, setAnotations] = useState("");
  const [showA, setShowA] = useState(true);

  useEffect(() => {
    if (typeof anotations == "string") {
      setAnotations(JSON.parse(anotations));
    } else {
      setAnotations(anotations);
    }
  }, [addAnotation]);


  return (
    <div>
      {anotationsData &&
        anotationsData.length > 0 &&
        anotationsData.map((anotation) => (
          <Toast
            show={true}
            id={anotation.id}
            onClose={() =>deleteAnotation(anotation.id)}
          >
            <Toast.Header>
              <strong className="me-auto">Nome do usuário do sistema</strong>
              <small>{anotation.date_created}</small>
            </Toast.Header>
            <Toast.Body>{anotation.text}</Toast.Body>
          </Toast>
        ))}
      <textarea onChange={anotationsHandleChange} rows={3} cols={100} />
      <button variant="primary" onClick={addAnotation}>
        Add Anotação
      </button>
    </div>
  );
};

export default Anotations;
