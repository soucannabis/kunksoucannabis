import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import TextField from "@mui/material/TextField";
import SelectFind from "react-select";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Tooltip from "@mui/material/Tooltip";
import apiRequest from "../../modules/apiRequest";
import axios from 'axios';

function Form({ formData, returnDataForm, formFields, full, half, threecol, fourcol, updateTable, nodata, autoupload }) {
  if (!formData) {
    formData = [];
  }
  const [formValue, setFormValue] = useState(formData);
  const [states, setStates] = useState([]);

  useEffect(() => {
    returnDataForm(formValue);

    async function state () {
      const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
      const formattedStates = response.data.map(state => ({
        label: state.nome,
        value: state.sigla,
      }));
      await formattedStates.sort((a, b) => a.label.localeCompare(b.label));
      setStates(await formattedStates)
    }

    state()
  }, [formValue]);

  const handleChange = (e) => {
    if (e.label) {
      setFormValue((prevState) => ({
        ...prevState,
        user: e.value,
        name_user: e.label,
      }));
    } else {
      setFormValue((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const saveForm = async (e) => {
    if (autoupload) {
      delete formValue.status;
      await apiRequest("/api/directus/update", { userId: formValue.id, formData: formValue }, "POST");

      if (formData.status != "patient") {
        updateTable(formValue);
        returnDataForm(formValue);
      }
    }
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  function renderFormField(field, formValue, handleChange) {
    var size = 0;
    if (full) {
      size = 12;
    }
    if (half) {
      size = 6;
    }
    if (threecol) {
      size = 3;
    }
    if (fourcol) {
      size = 2;
    }
    if (!full && !half && !threecol && !fourcol) {
      size = field.size;
    }

    switch (field.type) {
      case "textarea":
        return (
          <div style={{ marginTop: "40px" }} className={`col-md-6`} key={field.id}>
            <label htmlFor={field.id}>{field.name}:</label>
            <textarea className="form-control" id={field.id} name={field.id} value={formValue[field.id]} onChange={handleChange} onBlur={saveForm} />
          </div>
        );
      case "ul":
        return (
          <div style={{ marginTop: "40px" }} className={`col-md-6`} key={field.id}>
            <label htmlFor={field.id}>{field.name}:</label>
            <ul style={{ listStyle: "none" }}>
              {field.options.map((option) => (
                <div>
                  <li style={{ marginTop: "5px" }} key={option.value} value={option.value}>
                    <Tooltip title={option.category}>
                      <span style={{ cursor: "cell", padding: "5px", border: "1px solid #000", fontSize: "12px", margin: "10px" }}>{option.value}</span>
                    </Tooltip>
                    {option.label}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        );
      case "selectUser":
        return (
          <div style={{ marginTop: "5px" }} className={`col-md-${size}`} key={field.id}>
            <SelectFind id={field.id} name={field.id} options={field.options} placeholder="Selecione um associado" onChange={handleChange} isSearchable />
          </div>
        );
      case "number":
        return (
          <div style={{ marginTop: "5px" }} className={`col-md-${size}`} key={field.id}>
           <TextField label={field.name} id={field.id} type="number" onChange={handleChange} variant="outlined" value="15" />
          </div>
        );
      case "select":
        return (
          <div style={{ marginTop: "5px" }}>
            <FormControl fullWidth>
              <InputLabel id={field.id}>{field.options.placeholder}</InputLabel>
              <Select id={field.id} name={field.id} className={`col-md-${size}`} label={field.options.placeholder} onChange={handleChange}>
                {field.options.values.map((field, i) => {
                  return (
                    <MenuItem key={i} value={field.value}>
                      {field.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
        );

        case "selectStates":
          return (
            <div style={{ marginTop: "5px" }}>
              <FormControl fullWidth>
                <InputLabel id={field.id}>{field.options.placeholder}</InputLabel>
                <Select id={field.id} name={field.id} className={`col-md-${size}`} label={field.options.placeholder} onChange={handleChange}>
                  {states.map((field, i) => {
                    return (
                      <MenuItem key={i} value={field.value}>
                        {field.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          );

      case "selectCond":
        return (
          <div style={{ marginTop: "5px" }}>
            <FormControl fullWidth>
              <InputLabel id={field.id}>{field.options.placeholder}</InputLabel>
              <Select id={field.id} name={field.id} className={`col-md-${size}`} label={field.options.placeholder} onChange={handleChange}>
                {field.options.values.map((field, i) => {
                  return (
                    <MenuItem key={i} value={field.value}>
                      {field.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {field.fields
              .filter((item) => item.id === formValue.type)
              .map((field) => {
                return <TextField label={field.name} id={field.id} name={field.elementName} onChange={handleChange} variant="outlined" />;
              })}
          </div>
        );

      case "conditional":
        return (
          <div className={`col-md-${size}`} key={field.id}>
            <TextField error={false} label={field.name} id={field.id} name={field.id} defaultValue={formValue[field.id]} value={formValue[field.id]} onChange={handleChange} onBlur={saveForm} variant="outlined" hidden={field.options.hidden} />
          </div>
        );
      case "cpf":
        if (formValue.length > 0) {
          var hasInvalidChars = formValue[field.id].includes("_");
        }
        return (
          <div className={`col-md-${size}`} key={field.id}>
            <InputMask mask="999.999.999-99" value={formValue[field.id]} onChange={handleChange} onBlur={saveForm}>
              {(inputProps) => <TextField {...inputProps} label={field.name} id={field.id} name={field.id} variant="outlined" error={hasInvalidChars} helperText={hasInvalidChars ? "CPF inválido" : ""} />}
            </InputMask>
          </div>
        );
      case "cep":
        if (formValue.length > 0) {
          var hasInvalidChars = formValue[field.id].includes("_");
        }
        return (
          <div className={`col-md-${size}`} key={field.id}>
            <InputMask mask="99999-999" value={formValue[field.id]} onChange={handleChange} onBlur={saveForm}>
              {(inputProps) => <TextField {...inputProps} label={field.name} id={field.id} name={field.id} variant="outlined" error={hasInvalidChars} helperText={hasInvalidChars ? "CEP inválido" : ""} />}
            </InputMask>
          </div>
        );
      case "data":
        if (formValue.length > 0) {
          var hasInvalidChars = formValue[field.id].includes("_");
        }
        return (
          <div className={`col-md-${size}`} key={field.id}>
            <InputMask mask="99/99/9999" value={formValue[field.id]} onChange={handleChange} onBlur={saveForm}>
              {(inputProps) => <TextField {...inputProps} label={field.name} id={field.id} name={field.id} variant="outlined" error={hasInvalidChars} helperText={hasInvalidChars ? "Data Inválida" : ""} />}
            </InputMask>
          </div>
        );
      case "phone":
        if (formValue.length > 0) {
          var hasInvalidChars = formValue[field.id].includes("_");
        }
        return (
          <div className={`col-md-${size}`} key={field.id}>
            <InputMask mask="99 (99) 99999-9999" value={formValue[field.id]} onChange={handleChange} onBlur={saveForm}>
              {(inputProps) => <TextField {...inputProps} label={field.name} id={field.id} name={field.id} variant="outlined" error={hasInvalidChars} helperText={hasInvalidChars ? "Telefone Inválido" : ""} />}
            </InputMask>
          </div>
        );
      case "email":
        const isInvalidEmail = !isValidEmail(formValue[field.id]);
        return (
          <div className={`col-md-${size}`} key={field.id}>
            <TextField label={field.name} id={field.id} name={field.id} variant="outlined" value={formValue[field.id]} onChange={handleChange} onBlur={saveForm} error={isInvalidEmail} helperText={isInvalidEmail ? "E-mail inválido" : ""} />
          </div>
        );

      default:
        return (
          <div className={`col-md-${size}`} key={field.id}>
            <TextField error={false} label={field.name} id={field.id} name={field.id} defaultValue={formValue[field.id]} value={formValue[field.id]} onChange={handleChange} onBlur={saveForm} variant="outlined" />
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
