import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import SelectProducts from "./inputs/selectProducts";
import Documents from "./inputs/documents";
import apiRequest from "../modules/apiRequest";

function ModalPopup({ field, userData, updateTable }) {
  delete userData.pass_account;
  delete userData.date_created;
  delete userData.date_updated;

  const [showModal, setShowModal] = useState(false);
  const [userDataUpload, setUserDataUpload] = useState(userData);
  const [datePrescrition, setDatePrescription] = useState(userData.date_prescription);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDataUpload((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    await apiRequest("/api/directus/update", { userId: userDataUpload.id, formData: userDataUpload }, "POST");
    updateTable(userDataUpload);
    setShowModal(false);
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

  return (
    <div>
      <a style={{ cursor: "pointer" }} variant="primary" onClick={handleShow}>
        {field}
      </a>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{userDataUpload.name_associate + " " + userDataUpload.lastname_associate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <Tabs defaultActiveKey="shopData" id="uncontrolled-tab-example" className="mb-3">
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
                <Tab eventKey="receitas" title="Data da Prescrição">
                  <div className="col-md-12">
                    <input type="text" className="form-control" id="userid" name="id" value={userDataUpload.id} hidden />
                    <div className="form-group">
                      <input type="date" onChange={dataPrescriptionHandle} value={datePrescrition}></input>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="termo" title="Termo do Associado">
                  <div className="col-md-12">
                    <a href={userDataUpload.contract} target="_blank">Termo do Associado</a>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
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

export default ModalPopup;