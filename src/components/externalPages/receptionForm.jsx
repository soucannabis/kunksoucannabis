import React, { useState, useEffect } from "react";
import apiRequest from "../../modules/apiRequest";
import { Modal, Button } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "../forms/form";

function ReceptionForm() {
  const [formFields, setFormFields] = useState([]);
  const [saveButton, setSaveButton] = useState(true);
  const [formData, setFormData] = useState({
    name: null,
    lastname: null,
    email: null,
    phone: null,
    option1: null,
    isAssociate: null,
    message: null,
    reception_phase:0
  });

  useEffect(() => {
    setFormFields([
      { name: "Nome", id: "name", type: "text", options: null, size: 2 },
      { name: "Sobrenome", id: "lastname", type: "text", options: null, size: 2 },
      { name: "Email", id: "email", type: "email", options: null, size: 2 },
      { name: "Telefone", id: "phone", type: "phone", options: null, size: 2 },
      { name: "O que você precisa para o seu tratamento?", id: "option1", type: "radio", options: ["Já tenho receita e quero ajuda para adquirir o remédio", "Não tenho receita e quero agendar uma consulta", "Minha situação é diferente"], size: 2 },
      { name: "Já é Associado?", id: "isAssociate", type: "radio", options: ["Sim", "Não"], size: 2 },
      { name: "Messagem", id: "message", type: "textarea", options: null, size: 2 },
    ]);
  }, []);

  function returnDataForm(data) {
    if (data && !data.setButton) {
      setFormData(data);
    }

    if (data.setButton) {
      setSaveButton(false);
    } else {
      setSaveButton(true);
    }
  }

  async function createReceptionCard() {
    await apiRequest("/api/directus/reception", formData, "POST");
  }

  return (
    <div>
      <Form formFields={formFields} formData={formData} returnDataForm={returnDataForm} full pageform />
      <Button onClick={createReceptionCard} variant="primary" disabled={saveButton}>
        Save Changes
      </Button>
    </div>
  );
}

export default ReceptionForm;
