import React, { useState, useEffect } from "react";
import { Box, Typography, Button, FormControl, Input, InputLabel } from "@mui/material";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import ModalClose from "@mui/joy/ModalClose";
import SelectProducts from "../inputs/selectProducts";
import Documents from "../modals/documents";
import Anotations from "../inputs/anotations";
import apiRequest from "../../modules/apiRequest";
import ciap2 from "../../modules/ciap2";
import Form from "../forms/form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserModal({ field, data, patientsData, updateTable, showModal }) {
  delete data.pass_account;
  delete data.date_created;
  delete data.date_updated;

  const [show, setShow] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [userDataUpload, setUserDataUpload] = useState(data);
  const [datePrescrition, setDatePrescription] = useState();
  const [patientFormData, setPatientFormData] = useState([]);
  const [anotations, setAnnotationss] = useState(data.anotations);
  const [ciap2Data, setCiap2] = useState(ciap2(data.reason_treatment));
  const [formFields, setFormFields] = useState([
    { name: "Nome", id: "name_associate", type: "text", options: null, size: 2 },
    { name: "Sobrenome", id: "lastname_associate", type: "text", options: null, size: 2 },
    { name: "CPF", id: "cpf_associate", type: "cpf", options: null, size: 2 },
    { name: "RG", id: "rg_associate", type: "text", options: null, size: 2 },
    { name: "Emissor", id: "emiiter_rg_associate", type: "text", options: null, size: 2 },
    { name: "Nascimento", id: "birthday_associate", type: "date", options: null, size: 2 },
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
    { name: "Nascimento", id: "birthday_associate", type: "date", options: null, size: 2 },
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

  const handleCloseModal = () => setShow(false);
  const handleShowModal = () => setShow(true);

  useEffect(() => {
    const filteredPatient = patientsData.filter((patient) => {
      return patient.user_code === data.responsible_for;
    });

    setPatientFormData(filteredPatient[0]);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  async function selectedProducts(value) {
    console.log(value)
    if (value.length > 0) {
      await apiRequest("/api/directus/update", { userId: data.id, formData: { products: value } }, "POST")
    } 
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
    // Lógica para atualizar dados do paciente
  }

  return (
    <div>
      <a style={{ cursor: "pointer" }} onClick={handleShowModal}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </a>

      <Modal open={show} onClose={handleCloseModal}>
        <ModalDialog
          layout="center"
          sx={{
            width: "900px",
            height: "78vh",
            maxHeight: "80vh",
            overflow: "auto",
          }}
        >
          <ModalClose />
          <Typography variant="h5">{userDataUpload.name_associate + " " + userDataUpload.lastname_associate}</Typography>
          <Box sx={{ padding: 1}}>
            <Documents documents={data.documents} />
          </Box>
          <Box sx={{ padding: 2 }}>
            <Tabs onChange={handleTabChange}>
              <TabList>
                <Tab>Dados do Associado</Tab>
                {userDataUpload.responsible_for && <Tab>Dados do Paciente</Tab>}
                <Tab>Loja</Tab>
                <Tab>Anotações</Tab>
              </TabList>
              <TabPanel value={0}>
                <Form formData={data} formFields={formFields} updateTable={updateTable} returnDataForm={returnDataForm} autoupload />
              </TabPanel>
              {userDataUpload.responsible_for && (
                <TabPanel value={1}>
                  <Form formData={patientFormData} formFields={formFieldsPatient} returnDataForm={returnDataFormPatient} autoupload />
                </TabPanel>
              )}
              <TabPanel value={userDataUpload.responsible_for ? 2 : 1}>
                <FormControl>
                  <InputLabel htmlFor="date_prescription">Data da prescrição</InputLabel>
                  <Input id="date_prescription" type="date" onChange={dataPrescriptionHandle} value={datePrescrition || userDataUpload.date_prescription} />
                </FormControl>
                <SelectProducts selectedProducts={selectedProducts} userProducts={userDataUpload.products} />
              </TabPanel>
              <TabPanel value={3}>
                <div className="col-md-12">
                  <Anotations id="anotations" name="anotations" anotations={anotations} saveAnotations={saveAnotations} />
                </div>
              </TabPanel>
            </Tabs>
          </Box>
        </ModalDialog>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default UserModal;
