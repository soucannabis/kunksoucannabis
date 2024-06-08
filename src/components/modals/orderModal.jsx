import React, { useState, useEffect } from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import apiRequest from "../../modules/apiRequest";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OrderModal({ data, handleShowModal, handleCloseModal, showModal }) {
  const [user, setUserData] = useState([]);
  const [show, setShowModal] = useState(showModal);
  const [trackingData, setTrackingData] = useState([]);
  const [tabKey, setTabKey] = useState("user");
  const [loader, setLoader] = useState(false);
  const [trackingCode, setTrackingCode] = useState("cod");
  const [isTrack, setIsTrack] = useState(false);

  handleCloseModal = () => setShowModal(false);
  handleShowModal = () => setShowModal(true);

  useEffect(() => {
    async function userData() {
      userData = await apiRequest("/api/directus/users?userId=" + data.user, "", "GET");
      setUserData(userData);
    }
    userData();

    if(data.tracking_code){
      setTrackingCode(data.tracking_code)
      setIsTrack(true)
    }
  }, []);

  async function getTrackingData(e) {
    if (e == "tracking" && trackingCode != "cod") {
      setTabKey(e);
      if (trackingData.length == 0) {
        setLoader(true);

        const intervalId = setInterval(async () => {
          var response = [];
          try {
            response = await fetch("https://api.linketrack.com/track/json?user=teste&token=1abcd00b2731640e886fb41a8a9671ad1434c599dbaa0a0de9a5aa619f29a83f&codigo=" + trackingCode);
          } catch {
            clearInterval(intervalId);
            setIsTrack(false);
            setLoader(false);
            toast.error("Código de rastreamento inválido");
          }

          if (response && response.status === 200) {
            setLoader(false);
            const trackingData = await response.json();
            setTrackingData(trackingData.eventos);
            clearInterval(intervalId);
          }
        }, 3000);
      }
    } else {
      setTabKey(e);
    }
  }

  function trackingCodeHandleChange(e) {
    setTrackingCode(e.target.value);
  }

  async function updateOrder(e) {
    getTrackingData("tracking");
    setIsTrack(true);

    if(trackingData.length > 0){
      setTrackingData([])
      getTrackingData("tracking");
      setIsTrack(true);
      const el = e.target
      el.click()
    }
     await apiRequest("/api/directus/update-order", { orderId: data.id, formData: {tracking_code:trackingCode} }, "POST");
  }

  return (
    <div>
      <a style={{ cursor: "pointer" }} variant="primary" onClick={handleShowModal}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </a>

      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{user.name_associate + " " + user.lastname_associate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <Tabs defaultActiveKey="user" id="uncontrolled-tab-example" activeKey={tabKey} onSelect={(k) => getTrackingData(k)} className="mb-3">
                <Tab eventKey="user" title="Dados do Associado">
                  <div className="row">
                    <div className="col-md-4">
                      <p id="nome">
                        <strong>Nome:</strong> {user.name_associate}
                      </p>
                      <p id="sobrenome">
                        <strong>Sobrenome:</strong> {user.lastname_associate}
                      </p>
                      <p id="cpf">
                        <strong>CPF:</strong> {user.cpf_associate}
                      </p>
                      <p id="rg">
                        <strong>RG:</strong> {user.rg_associate}
                      </p>
                      <p id="emiiter_rg_associate">
                        <strong>Emissor do RG:</strong> {user.emiiter_rg_associate}
                      </p>
                    </div>
                    <div className="col-md-4">
                      <p id="sexo">
                        <strong>Sexo:</strong> {user.gender}
                      </p>
                      <p id="nacionalidade">
                        <strong>Nacionalidade:</strong> {user.nationality}
                      </p>
                      <p id="estado_civil">
                        <strong>Estado Civil:</strong> {user.marital_status}
                      </p>
                      <p id="email">
                        <strong>Email:</strong> {user.email_account}
                      </p>
                    </div>
                    <div className="col-md-4">
                      <p id="telefone">
                        <strong>Telefone:</strong> {user.mobile_number}
                      </p>
                      <p id="rua">
                        <strong>Rua:</strong> {user.street}
                      </p>
                      <p id="numero">
                        <strong>Número:</strong> {user.number}
                      </p>
                      <p id="bairro">
                        <strong>Bairro:</strong> {user.neighborhood}
                      </p>
                      <p id="cidade">
                        <strong>Cidade:</strong> {user.city}
                      </p>
                      <p id="estado">
                        <strong>Estado:</strong> {user.state}
                      </p>
                      <p id="cep">
                        <strong>CEP:</strong> {user.cep}
                      </p>
                      <p id="razao_tratamento">
                        <strong>Razão de Tratamento:</strong> {user.reason_treatment_text}
                      </p>
                    </div>
                  </div>
                </Tab>

                <Tab eventKey="tracking" title="Rastreamento">
                  {!isTrack ? (
                    <div>
                      <input type="text" name="trackingCode" onChange={trackingCodeHandleChange} />
                      <input type="button" class="btn btn-success btn-sm" onClick={updateOrder} value="Inserir código" />
                    </div>
                  ) : (
                    <div>
                      {loader ? (
                        <div style={{ textAlign: "center" }}>
                          <div className="loader-container">
                            <div className="loader"></div>
                          </div>
                          <p>Carregando dados do rastreamento, isso pode demorar um pouco.</p>
                        </div>
                      ) : (
                        <div>
                          <div>
                            <input type="text" name="trackingCode" onChange={trackingCodeHandleChange} value={trackingCode}/>
                            <input type="button" class="btn btn-success btn-sm" onClick={updateOrder} value="Salvar" />
                          </div>
                          {trackingData.map((item, index) => (
                            <div key={index}>
                              <p>Data: {item.data}</p>
                              <p>Hora: {item.hora}</p>
                              <p>Local: {item.local}</p>
                              <p>Status: {item.status}</p>
                              <p>Substatus:</p>
                              <ul>
                                {item.subStatus.map((subItem, subIndex) => (
                                  <li key={subIndex}>{subItem}</li>
                                ))}
                              </ul>
                              <p>------------</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Tab>
              </Tabs>
            </div>
          </div>
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
