import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import ciap2 from "../../modules/ciap2";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

function Form({ formData }) {
  const [formValue, setFormValue] = useState(formData);
  const [ciap2Data, setCiap2] = useState(ciap2(formData.reason_treatment));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    console.log(value);
    if (value.includes("_")) {
      console.log(e);
    }
  };

  const formFields = [
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
  ];

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  function renderFormField(field, formValue, handleChange) {
    switch (field.type) {
      case "textarea":
        return (
          <div style={{ marginTop: "40px" }} className={`col-md-${field.size}`} key={field.id}>
            <label htmlFor={field.id}>{field.name}:</label>
            <textarea className="form-control" id={field.id} name={field.id} value={formValue[field.id]} onChange={handleChange} />
          </div>
        );
      case "ul":
        return (
          <div style={{ marginTop: "40px" }} className={`col-md-${field.size}`} key={field.id}>
            <label htmlFor={field.id}>{field.name}:</label>
            <ul style={{ listStyle: "none" }}>
              {field.options.map((option) => (
                <div>
                  <li key={option.value} value={option.value}>
                    <Tooltip title={option.category}> - <span style={{cursor:"cell"}}>{option.value}</span> </Tooltip> - {option.label}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        );
      case "cpf":
        var hasInvalidChars = formValue[field.id].includes("_");
        return (
          <div className={`col-md-${field.size}`} key={field.id}>
            <InputMask mask="999.999.999-99" value={formValue[field.id]} onChange={handleChange}>
              {(inputProps) => <TextField {...inputProps} label={field.name} id={field.id} name={field.id} variant="outlined" error={hasInvalidChars} helperText={hasInvalidChars ? "CPF inválido" : ""} />}
            </InputMask>
          </div>
        );
      case "cep":
        var hasInvalidChars = formValue[field.id].includes("_");
        return (
          <div className={`col-md-${field.size}`} key={field.id}>
            <InputMask mask="99999-999" value={formValue[field.id]} onChange={handleChange}>
              {(inputProps) => <TextField {...inputProps} label={field.name} id={field.id} name={field.id} variant="outlined" error={hasInvalidChars} helperText={hasInvalidChars ? "CEP inválido" : ""} />}
            </InputMask>
          </div>
        );
      case "data":
        var hasInvalidChars = formValue[field.id].includes("_");
        return (
          <div className={`col-md-${field.size}`} key={field.id}>
            <InputMask mask="99/99/9999" value={formValue[field.id]} onChange={handleChange}>
              {(inputProps) => <TextField {...inputProps} label={field.name} id={field.id} name={field.id} variant="outlined" error={hasInvalidChars} helperText={hasInvalidChars ? "Data Inválida" : ""} />}
            </InputMask>
          </div>
        );
      case "phone":
        var hasInvalidChars = formValue[field.id].includes("_");
        return (
          <div className={`col-md-${field.size}`} key={field.id}>
            <InputMask mask="99 (99) 99999-9999" value={formValue[field.id]} onChange={handleChange}>
              {(inputProps) => <TextField {...inputProps} label={field.name} id={field.id} name={field.id} variant="outlined" error={hasInvalidChars} helperText={hasInvalidChars ? "Telefone Inválido" : ""} />}
            </InputMask>
          </div>
        );
      case "email":
        // Verifica se o valor do campo de e-mail não corresponde ao formato de e-mail válido
        const isInvalidEmail = !isValidEmail(formValue[field.id]);
        return (
          <div className={`col-md-${field.size}`} key={field.id}>
            <TextField
              label={field.name}
              id={field.id}
              name={field.id}
              variant="outlined"
              value={formValue[field.id]}
              onChange={handleChange}
              // Define o estado de erro com base na validação de e-mail
              error={isInvalidEmail}
              // Exibe uma mensagem de erro se o e-mail for inválido
              helperText={isInvalidEmail ? "E-mail inválido" : ""}
            />
          </div>
        );

      default:
        return (
          <div className={`col-md-${field.size}`} key={field.id}>
            <TextField error={false} label={field.name} id={field.id} name={field.id} defaultValue={formValue[field.id]} value={formValue[field.id]} onChange={handleChange} variant="outlined" />
          </div>
        );
    }
  }

  return (
    <form>
      <div className="row">{formFields.map((field) => renderFormField(field, formValue, handleChange))}</div>
    </form>
  );
}

export default Form;
