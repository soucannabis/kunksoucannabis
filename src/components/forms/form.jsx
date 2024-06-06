import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import TextField from "@mui/material/TextField";
import SelectFind from "react-select";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Textarea from "@mui/joy/Textarea";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";
import apiRequest from "../../modules/apiRequest";
import axios from "axios";

function Form({ formData, returnDataForm, formFields, full, half, threecol, fourcol, updateTable, partnerEditForm, autoupload, pageform}) {
  const [formValue, setFormValue] = useState(formData || []);
  const [states, setStates] = useState([]);
  const [errorStates, setErrorStates] = useState({});

  useEffect(() => {
    if (!autoupload && !pageform) {
      const fields = formFields
        .map((field) => {
          return field.id;
        })
        .reduce((acc, key) => {
          acc[key] = null;
          return acc;
        }, {});
      setFormValue(fields);
    }
  }, []);

  useEffect(() => {
    returnDataForm(formValue);

    async function state() {
      const response = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
      const formattedStates = response.data.map((state) => ({
        label: state.nome,
        value: state.sigla,
      }));
      await formattedStates.sort((a, b) => a.label.localeCompare(b.label));
      setStates(await formattedStates);
    }

    state();

    if (!autoupload) {
      const hasNullProperty = Object.values(formValue).some((value) => value === null || value === ""); //|| value.includes("_")
      if (!hasNullProperty) {
        returnDataForm({ setButton: true });
      }
    }
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

      const value = e.target.value;

      if (e.target.id == "email") {
        if (!isValidEmail(value)) {
          setErrorStates((prevState) => ({
            ...prevState,
            [e.target.id]: true,
          }));
        } else {
          setErrorStates((prevState) => ({
            ...prevState,
            [e.target.id]: false,
          }));
        }
      }

      if (e.target.dataset && e.target.dataset.mask) {
        if (value.includes("_")) {
          setErrorStates((prevState) => ({
            ...prevState,
            [e.target.id]: true,
          }));
        } else {
          setErrorStates((prevState) => ({
            ...prevState,
            [e.target.id]: false,
          }));
        }
      }
    }
  };

  function getNullProperties(obj) {
    if (typeof obj !== "object" || obj === null) {
      throw new TypeError("O argumento fornecido não é um objeto");
    }

    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value === null) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const saveForm = async (e) => {
    if (autoupload) {
      delete formValue.status;

      if (partnerEditForm) {
        await apiRequest("/api/directus/partner", { partnerId: formValue.id, formData: formValue }, "PATCH");
      } else {
        await apiRequest("/api/directus/update", { userId: formValue.id, formData: formValue }, "POST");
      }

      if (formData.status != "patient") {
        updateTable(formValue);
        returnDataForm(formValue);
      }
    }
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
          <div style={{ marginTop: "40px" }} className={`col-md-${size}`} key={field.id}>
            <label htmlFor={field.id}>{field.name}:</label>
            <Textarea size="lg" id={field.id} name={field.id} value={formValue[field.id]} onChange={handleChange} onBlur={saveForm} required />
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
            <SelectFind id={field.id} name={field.id} options={field.options} placeholder="Selecione um associado" onChange={handleChange} isSearchable required />
          </div>
        );
      case "number":
        return (
          <div style={{ marginTop: "5px" }} className={`col-md-${size}`} key={field.id}>
            <TextField label={field.name} id={field.id} type="number" onChange={handleChange} variant="outlined" value="15" required />
          </div>
        );
      case "radio":
        return (
          <div style={{ marginTop: "5px" }} className={`col-md-${size}`} key={field.id}>
            <FormControl>
              {field.name}
              <RadioGroup aria-labelledby="demo-radio-buttons-group-label" name={field.id} onChange={handleChange} variant="outlined" required>
                {field.options.map((item, i) => {
                  return (
                    <div>
                      <FormControlLabel key={i} value={item} control={<Radio />} label={item} />
                    </div>
                  );
                })}
              </RadioGroup>
            </FormControl>
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
              <Select id={field.id} name={field.id} className={`col-md-${size}`} label={field.options.placeholder} onChange={handleChange} required>
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
                return <TextField label={field.name} id={field.id} name={field.elementName} onChange={handleChange} variant="outlined" required />;
              })}
          </div>
        );

      case "conditional":
        return (
          <div className={`col-md-${size}`} key={field.id}>
            <TextField label={field.name} id={field.id} name={field.id} defaultValue={formValue[field.id]} value={formValue[field.id]} onChange={handleChange} onBlur={saveForm} variant="outlined" hidden={field.options.hidden} required />
          </div>
        );
      case "cpf":
        return (
          <div className={`col-md-${size}`} key={field.id}>
            <InputMask mask="999.999.999-99" value={formValue[field.id]} onChange={handleChange} onBlur={saveForm}>
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  label={field.name}
                  id={field.id}
                  error={!!errorStates[field.id]}
                  name={field.id}
                  variant="outlined"
                  helperText={!!errorStates[field.id] ? "CPF inválido" : ""}
                  required
                  InputProps={{
                    ...inputProps.InputProps,
                    inputProps: {
                      ...inputProps.inputProps,
                      "data-mask": "true",
                    },
                  }}
                />
              )}
            </InputMask>
          </div>
        );
      case "cep":
        return (
          <div className={`col-md-${size}`} key={field.id}>
            <InputMask mask="99999-999" value={formValue[field.id]} onChange={handleChange} onBlur={saveForm}>
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  label={field.name}
                  id={field.id}
                  name={field.id}
                  variant="outlined"
                  error={!!errorStates[field.id]}
                  helperText={!!errorStates[field.id] ? "CEP inválido" : ""}
                  required
                  InputProps={{
                    ...inputProps.InputProps,
                    inputProps: {
                      ...inputProps.inputProps,
                      "data-mask": "true",
                    },
                  }}
                />
              )}
            </InputMask>
          </div>
        );
      case "data":
        return (
          <div className={`col-md-${size}`} key={field.id}>
            <InputMask mask="99/99/9999" value={formValue[field.id]} onChange={handleChange} onBlur={saveForm}>
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  label={field.name}
                  id={field.id}
                  error={!!errorStates[field.id]}
                  name={field.id}
                  variant="outlined"
                  helperText={!!errorStates[field.id] ? "Data Inválida" : ""}
                  required
                  InputProps={{
                    ...inputProps.InputProps,
                    inputProps: {
                      ...inputProps.inputProps,
                      "data-mask": "true",
                    },
                  }}
                />
              )}
            </InputMask>
          </div>
        );
      case "phone":
        return (
          <div className={`col-md-${size}`} key={field.id}>
            <InputMask mask="55 (99) 99999-9999" value={formValue[field.id]} onChange={handleChange} onBlur={saveForm}>
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  label={field.name}
                  id={field.id}
                  name={field.id}
                  variant="outlined"
                  error={!!errorStates[field.id]}
                  helperText={!!errorStates[field.id] ? "Telefone Inválido" : ""}
                  required
                  InputProps={{
                    ...inputProps.InputProps,
                    inputProps: {
                      ...inputProps.inputProps,
                      "data-mask": "true",
                    },
                  }}
                />
              )}
            </InputMask>
          </div>
        );
      case "email":
        return (
          <div className={`col-md-${size}`} key={field.id}>
            <TextField label={field.name} id={field.id} name={field.id} onChange={handleChange} value={formValue[field.id]} onBlur={saveForm} variant="outlined" error={!!errorStates[field.id]} data-mask="true" helperText={!!errorStates[field.id] ? "Email Inválido" : ""} required />
          </div>
        );

      default:
        return (
          <div className={`col-md-${size}`} key={field.id}>
            <TextField error={false} label={field.name} id={field.id} name={field.id} defaultValue={formValue[field.id]} value={formValue[field.id]} onChange={handleChange} onBlur={saveForm} variant="outlined" required />
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
