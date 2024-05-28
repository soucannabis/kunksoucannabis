import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import SelectProducts from "../inputs/selectProducts";
import Documents from "../modals/documents";
import Anotations from "../inputs/anotations";
import apiRequest from "../../modules/apiRequest";
import ciap2 from "../../modules/ciap2";
import Form from "../forms/form";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserModal({ field, data, patientsData, updateTable, handleShowModal, handleCloseModal, showModal }) {
  delete data.pass_account;
  delete data.date_created;
  delete data.date_updated;

  const [show, setShow] = useState(false);
  const [userDataUpload, setUserDataUpload] = useState(data);
  const [datePrescrition, setDatePrescription] = useState();
  const [patientFormData, setPatientFormData] = useState([])
  const [anotations, setAnnotationss] = useState(data.anotations);
  const [ciap2Data, setCiap2] = useState(ciap2(data.reason_treatment));
  const [formFields, setFormFields] = useState([
    { name: "Nome", id: "name_associate", type: "text", options: null, size: 2 },
    { name: "Sobrenome", id: "lastname_associate", type: "text", options: null, size: 2 },
    { name: "CPF", id: "cpf_associate", type: "cpf", options: null, size: 2 },
    { name: "RG", id: "rg_associate", type: "text", options: null, size: 2 },
    { name: "Emissor", id: "emiiter_rg_associate", type: "text", options: null, size: 2 },
    { name: "Nascimento", id: "birthday_associate", type: "data", options: null, size: 2 },
    { name: "Sexo", id: "gender", type: "text", options: null, size: 2 },
    { name: "Nacionalidade", id: "nationality", type: "text", options: null, size: 2 },
    { name: "Estado Civil", id: "marital_status", type: "text", options: null, size: 2 },
    { name: "Telefone", id: "mobile_number", type: "phone", options: null, size: 3 },
    { name: "Email", id: "email_account", type: "email", options: null, size: 3 },
    { name: "Rua", id: "street", type: "text", options: null, size: 4 },
    { name: "Número", id: "number", type: "text", options: null, size: 1 },
    { name: "Bairro", id: "neighborhood", type: "text", options: null, size: 2 },
    { name: "Cidade", id: "city", type: "text", options: null, size: 2 },
    { name: "Estado", id: "state", type: "text", options: null, size: 1 },
    { name: "CEP", id: "cep", type: "cep", options: null, size: 2 },
    { name: "Razão de Tratamento Texto", id: "reason_treatment_text", type: "textarea", options: null, size: 6 },
    { name: "Razão de Tratamento CIAP2", id: "reason_treatment_ciap2", type: "ul", options: ciap2Data, size: 6 },
  ]);
  const [formFieldsPatient, setFormFieldsPatient] = useState([
    { name: "Nome", id: "name_associate", type: "text", options: null, size: 2 },
    { name: "Sobrenome", id: "lastname_associate", type: "text", options: null, size: 2 },
    { name: "CPF", id: "cpf_associate", type: "cpf", options: null, size: 2 },
    { name: "RG", id: "rg_associate", type: "text", options: null, size: 2 },
    { name: "Emissor", id: "emiiter_rg_associate", type: "text", options: null, size: 2 },
    { name: "Nascimento", id: "birthday_associate", type: "data", options: null, size: 2 },
    { name: "Sexo", id: "gender", type: "text", options: null, size: 2 },
    { name: "Nacionalidade", id: "nationality", type: "text", options: null, size: 2 },
    { name: "Estado Civil", id: "marital_status", type: "text", options: null, size: 2 },
    { name: "Rua", id: "street", type: "text", options: null, size: 4 },
    { name: "Número", id: "number", type: "text", options: null, size: 1 },
    { name: "Bairro", id: "neighborhood", type: "text", options: null, size: 2 },
    { name: "Cidade", id: "city", type: "text", options: null, size: 2 },
    { name: "Estado", id: "state", type: "text", options: null, size: 1 },
    { name: "CEP", id: "cep", type: "cep", options: null, size: 2 },
  ]);


  handleCloseModal = () => setShow(false);
  handleShowModal = () => setShow(true);

  useEffect(() => {

   const filteredPatient = patientsData.filter(patient => {
     return patient.user_code === data.responsible_for
   })

   setPatientFormData(filteredPatient[0])

  }, []);



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

  function saveAnotations(anotations) {
    userDataUpload.anotations = anotations;
  }

  function returnDataForm(value) {
    setUserDataUpload(value);
  }

  function returnDataFormPatient(value) {

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
                <Documents documents={data.documents} />
              </div>
              <div class="col-md-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-bag-check-fill" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0m-.646 5.354a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z" />
                </svg>
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
                    <Form formData={data} formFields={formFields} updateTable={updateTable} returnDataForm={returnDataForm} autoupload/>
                    <div class="row">
                      <div class="col-md-12">
                        <div class="col">
                          <div className="form-group block">
                            <label>Data da prescrição:</label>
                            <input type="date" onChange={dataPrescriptionHandle} value={datePrescrition || userDataUpload.date_prescription}></input>
                          </div>
                          <div className="block">
                            <SelectProducts selectedProducts={selectedProducts} userProducts={userDataUpload.products} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab>
                {userDataUpload.responsible_for && (
                  <Tab eventKey="patient" title="Dados do Paciente">
                    <div class="container">
                      <Form formData={patientFormData} threecol formFields={formFieldsPatient} returnDataForm={returnDataFormPatient} autoupload />                     
                    </div>
                  </Tab>
                )}
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
