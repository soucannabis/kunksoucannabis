import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import SelectProducts from "../inputs/selectProducts";
import Documents from "../inputs/documents";
import Anotations from "../inputs/anotations";
import apiRequest from "../../modules/apiRequest";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserModal({ field, data, updateTable, handleShowModal, handleCloseModal, showModal }) {
  delete data.pass_account;
  delete data.date_created;
  delete data.date_updated;

  const [show, setShowModal] = useState(false);
  const [userDataUpload, setUserDataUpload] = useState(data);
  const [datePrescrition, setDatePrescription] = useState();
  const [anotation, setAnotation] = useState([]);
  const [anotations, setAnotations] = useState(data.anotations);

  handleCloseModal = () => setShowModal(false);
  handleShowModal = () => setShowModal(true);

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
    console.log(value);
    userDataUpload.products = value;
  }

  function dataPrescriptionHandle(item) {
    setDatePrescription(item.target.value);
    setUserDataUpload((prevState) => ({
      ...prevState,
      ["date_prescription"]: item.target.value,
    }));
  }

  function anotationsHandleChange(el) {
    var anotations = JSON.parse(data.anotations);
    if (!anotations) {
      anotations = [];
    }
    var anotationData = {
      id: anotations.length + 1,
      text: el.target.value,
      system_user: 1,
      date_created: "2024-02-08",
    };

    setAnotation(anotationData);
  }

  function addAnotation() {
    var anotations = JSON.parse(data.anotations);
    if (!anotations) {
      anotations = [];
    }
    anotations = anotations.concat(anotation);
    userDataUpload.anotations = anotations;
    setAnotations(anotations);
  }

  function deleteAnotation(id) {
    if (typeof anotations == "string") {
      var anotationsData = JSON.parse(anotations);
    } else {
      var anotationsData = anotations;
    }
    anotationsData = anotationsData.filter((anotation) => anotation.id != id);
    console.log(anotationsData);
    setAnotations(anotationsData);
    userDataUpload.anotations = anotationsData;
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
          <Modal.Title>{userDataUpload.name_associate + " " + userDataUpload.lastname_associate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <Tabs defaultActiveKey="userData" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="userData" title="Dados do Associado">
                  <div className="col-md-12">
                    <form id="formUser">
                      <input type="text" className="form-control" id="userid" name="id" value={userDataUpload.id} hidden />
                      <div className="form-group">
                        <label htmlFor="nome">Nome:</label>
                        <input type="text" className="form-control" id="nome" name="name_associate" value={userDataUpload.name_associate} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="sobrenome">Sobrenome:</label>
                        <input type="text" className="form-control" id="sobrenome" name="lastname_associate" value={userDataUpload.lastname_associate} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="cpf">CPF:</label>
                        <input type="text" className="form-control" id="cpf" name="cpf_associate" value={userDataUpload.cpf_associate} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="rg">RG:</label>
                        <input type="text" className="form-control" id="rg" name="rg_associate" value={userDataUpload.rg_associate} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="emiiter_rg_associate">Emissor do RG:</label>
                        <input type="text" className="form-control" id="emiiter_rg_associate" name="emiiter_rg_associate" value={userDataUpload.emiiter_rg_associate} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="sexo">Sexo:</label>
                        <input type="text" className="form-control" id="sexo" name="gender" value={userDataUpload.gender} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="nacionalidade">Nacionalidade:</label>
                        <input type="text" className="form-control" id="nacionalidade" name="nationality" value={userDataUpload.nationality} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="estado_civil">Estado Civil:</label>
                        <input type="text" className="form-control" id="estado_civil" name="marital_status" value={userDataUpload.marital_status} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" className="form-control" id="email" name="email_account" value={userDataUpload.email_account} onChange={handleChange} />
                      </div>
                    </form>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="telefone">Telefone:</label>
                      <input type="tel" className="form-control" id="telefone" name="mobile_number" value={userDataUpload.mobile_number} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="rua">Rua:</label>
                      <input type="text" className="form-control" id="rua" name="street" value={userDataUpload.street} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="numero">Número:</label>
                      <input type="text" className="form-control" id="numero" name="number" value={userDataUpload.number} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="bairro">Bairro:</label>
                      <input type="text" className="form-control" id="bairro" name="neighborhood" value={userDataUpload.neighborhood} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cidade">Cidade:</label>
                      <input type="text" className="form-control" id="cidade" name="city" value={userDataUpload.city} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="estado">Estado:</label>
                      <input type="text" className="form-control" id="estado" name="state" value={userDataUpload.state} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cep">CEP:</label>
                      <input type="text" className="form-control" id="cep" name="cep" value={userDataUpload.cep} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="razao_tratamento">Razão de Tratamento:</label>
                      <input type="text" className="form-control" id="razao_tratamento" name="reason_treatment_text" value={userDataUpload.reason_treatment_text} onChange={handleChange} />
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="shopData" title="Loja">
                  <div className="col-md-12">
                    <input type="text" className="form-control" id="userid" name="id" value={userDataUpload.id} hidden />

                    <div className="form-group">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Data da prescrição:</label>
                          <input type="date" onChange={dataPrescriptionHandle} value={datePrescrition || userDataUpload.date_prescription}></input>
                        </div>
                        <br></br>
                      </div>
                      <label htmlFor="nome">Produtos:</label>
                      <SelectProducts selectedProducts={selectedProducts} userProducts={userDataUpload.products} />
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="documents" title="Documentos">
                  <div className="col-md-12">
                    <Documents documents={userDataUpload.documents} />
                  </div>
                </Tab>
                <Tab eventKey="termo" title="Termo do Associado">
                  <div className="col-md-12">
                    <a href={userDataUpload.contract} target="_blank">
                      Termo do Associado
                    </a>
                  </div>
                </Tab>
                <Tab eventKey="anotações" title="Anotações">
                  <div className="col-md-12">
                    <Anotations id="anotations" name="anotations" anotationsHandleChange={anotationsHandleChange} addAnotation={addAnotation} deleteAnotation={deleteAnotation} anotations={anotations} />
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserModal;
