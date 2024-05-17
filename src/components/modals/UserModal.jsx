import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import SelectProducts from "../inputs/selectProducts";
import Documents from "../modals/documents";
import Anotations from "../inputs/anotations";
import apiRequest from "../../modules/apiRequest";
import ciap2 from "../../modules/ciap2";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserModal({ field, data, updateTable, handleShowModal, handleCloseModal, showModal }) {
  delete data.pass_account;
  delete data.date_created;
  delete data.date_updated;

  const [show, setShow] = useState(false);
  const [userDataUpload, setUserDataUpload] = useState(data);
  const [datePrescrition, setDatePrescription] = useState();
  const [anotations, setAnnotationss] = useState(data.anotations);
  const [ciap2Data, setCiap2] = useState(ciap2(data.reason_treatment));

  const [modalIsOpen, setModalIsOpen] = useState(false);

  handleCloseModal = () => setShow(false);
  handleShowModal = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDataUpload((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    delete userDataUpload.status;
    await apiRequest("/api/directus/update", { userId: userDataUpload.id, formData: userDataUpload }, "POST");
    updateTable(userDataUpload);
    toast.success("Dados salvos com sucesso");
  };

  function selectedProducts(value) {
    userDataUpload.products = value;
  }

  function dataPrescriptionHandle(item) {
    setDatePrescription(item.target.value);
    setUserDataUpload((prevState) => ({
      ...prevState,
      ["date_prescription"]: item.target.value,
    }));
  }

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  function saveAnotations(anotations) {
    userDataUpload.anotations = anotations;
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
          <Modal.Title>
            <div className="row">
              <div class="col-md-8"> {userDataUpload.name_associate + " " + userDataUpload.lastname_associate}</div>
              <div class="col-md-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-file-medical" viewBox="0 0 16 16">
                  <path d="M8.5 4.5a.5.5 0 0 0-1 0v.634l-.549-.317a.5.5 0 1 0-.5.866L7 6l-.549.317a.5.5 0 1 0 .5.866l.549-.317V7.5a.5.5 0 1 0 1 0v-.634l.549.317a.5.5 0 1 0 .5-.866L9 6l.549-.317a.5.5 0 1 0-.5-.866l-.549.317zM5.5 9a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z" />
                  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1" />
                </svg>
              </div>
              <div class="col-md-1">
                <Documents documents={data.documents}/>            
              </div>
              <div class="col-md-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-bag-check-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0m-.646 5.354a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>
</svg>
              </div>
              <div class="col-md-4">
                {" "}
                <Button variant="primary" onClick={handleSubmit}>
                  Salvar Mudanças
                </Button>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <Tabs defaultActiveKey="userData" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="userData" title="Dados do Associado">
                  <div class="container">
                    <form id="formUser" className="block">                    
                      <div class="row">
                        <div class="col-md-2">
                          <div className="form-group">
                            <label htmlFor="nome">Nome:</label>
                            <input type="text" className="form-control" id="nome" name="name_associate" value={userDataUpload.name_associate} onChange={handleChange} />
                          </div>
                        </div>

                        <div class="col-md-2">
                          <div className="form-group">
                            <label htmlFor="sobrenome">Sobrenome:</label>
                            <input type="text" className="form-control" id="sobrenome" name="lastname_associate" value={userDataUpload.lastname_associate} onChange={handleChange} />
                          </div>
                        </div>
                        <div class="col-md-2">
                          <div className="form-group">
                            <label htmlFor="cpf">CPF:</label>
                            <input type="text" className="form-control" id="cpf" name="cpf_associate" value={userDataUpload.cpf_associate} onChange={handleChange} />
                          </div>
                        </div>
                        <div class="col-md-2">
                          {" "}
                          <div className="form-group">
                            <label htmlFor="rg">RG:</label>
                            <input type="text" className="form-control" id="rg" name="rg_associate" value={userDataUpload.rg_associate} onChange={handleChange} />
                          </div>
                        </div>
                        <div class="col-md-2">
                          <div className="form-group">
                            <label htmlFor="emiiter_rg_associate">Emissor</label>
                            <input type="text" className="form-control" id="emiiter_rg_associate" name="emiiter_rg_associate" value={userDataUpload.emiiter_rg_associate} onChange={handleChange} />
                          </div>
                        </div>
                        <div class="col-md-2">
                          <div className="form-group">
                            <label htmlFor="sexo">Sexo:</label>
                            <input type="text" className="form-control" id="sexo" name="gender" value={userDataUpload.gender} onChange={handleChange} />
                          </div>
                        </div>
                      </div>

                      <br></br>
                      <div class="row">
                        <div class="col-md-2">
                          <input type="text" className="form-control" id="userid" name="id" value={userDataUpload.id} hidden />
                          <div className="form-group">
                            <label htmlFor="nacionalidade">Nacionalidade:</label>
                            <input type="text" className="form-control" id="nacionalidade" name="nationality" value={userDataUpload.nationality} onChange={handleChange} />
                          </div>
                        </div>

                        <div class="col-md-2">
                          <div className="form-group">
                            <label htmlFor="estado_civil">Estado Civil:</label>
                            <input type="text" className="form-control" id="estado_civil" name="marital_status" value={userDataUpload.marital_status} onChange={handleChange} />
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div className="form-group">
                            <label htmlFor="telefone">Telefone:</label>
                            <input type="tel" className="form-control" id="telefone" name="mobile_number" value={userDataUpload.mobile_number} onChange={handleChange} />
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" className="form-control" id="email" name="email_account" value={userDataUpload.email_account} onChange={handleChange} />
                          </div>
                        </div>
                        <div class="col-md-2"></div>
                      </div>
                      <br></br>
                      <div class="row">
                        <div class="col-md-4">
                          <div className="form-group">
                            <label htmlFor="rua">Rua:</label>
                            <input type="text" className="form-control" id="rua" name="street" value={userDataUpload.street} onChange={handleChange} />
                          </div>
                        </div>

                        <div class="col-md-1">
                          <div className="form-group">
                            <label htmlFor="numero">Número:</label>
                            <input type="text" className="form-control" id="numero" name="number" value={userDataUpload.number} onChange={handleChange} />
                          </div>
                        </div>
                        <div class="col-md-2">
                          <div className="form-group">
                            <label htmlFor="bairro">Bairro:</label>
                            <input type="text" className="form-control" id="bairro" name="neighborhood" value={userDataUpload.neighborhood} onChange={handleChange} />
                          </div>
                        </div>
                        <div class="col-md-2">
                          <div className="form-group">
                            <label htmlFor="cidade">Cidade:</label>
                            <input type="text" className="form-control" id="cidade" name="city" value={userDataUpload.city} onChange={handleChange} />
                          </div>
                        </div>
                        <div class="col-md-1">
                          <div className="form-group">
                            <label htmlFor="estado">Estado:</label>
                            <input type="text" className="form-control" id="estado" name="state" value={userDataUpload.state} onChange={handleChange} />
                          </div>
                        </div>
                        <div class="col-md-2">
                          <div className="form-group">
                            <label htmlFor="cep">CEP:</label>
                            <input type="text" className="form-control" id="cep" name="cep" value={userDataUpload.cep} onChange={handleChange} />
                          </div>
                        </div>
                      </div>
                      <br></br>
                      <br></br>
                      <div class="row">
                        <div class="col-md-6">
                          <div className="form-group">
                            <label htmlFor="razao_tratamento">Razão de Tratamento Texto:</label>
                            <textarea rows="4" type="text" className="form-control" id="razao_tratamento" name="reason_treatment_text" value={userDataUpload.reason_treatment_text} onChange={handleChange} />
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div className="form-group">
                            <label htmlFor="razao_tratamento">Razão de Tratamento CIAP2:</label>
                            <ul>
                              {ciap2Data.map((option) => (
                                <li key={option} value={option}>
                                  {option}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </form>
                    <div class="row">
                      <div class="col-md-12">
                        <div class="col">
                          <div className="form-group block">
                            <label>Data da prescrição:</label>
                            <input type="date" onChange={dataPrescriptionHandle} value={datePrescrition || userDataUpload.date_prescription}></input>
                          </div>
                          <div className="block">
                            {" "}
                            <SelectProducts selectedProducts={selectedProducts} userProducts={userDataUpload.products} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="anotações" title="Anotações">
                  <div className="col-md-12">
                    <Anotations id="anotations" name="anotations" anotations={anotations} saveAnotations={saveAnotations} />
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserModal;
