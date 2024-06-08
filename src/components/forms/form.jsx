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
import Grid from "@mui/material/Grid";
import Chip from '@mui/material/Chip';
import apiRequest from "../../modules/apiRequest";
import axios from "axios";

function Form({ formData, returnDataForm, formFields, full, half, threecol, fourcol, updateTable, partnerEditForm, autoupload, pageform }) {
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
          <Grid item xs={12} sx={{margin:"40px 0 20px 0"}}>
            <label htmlFor={field.id}>{field.name}:</label>
            <Textarea  className="formInput" size="sm" id={field.id} name={field.id} value={formValue[field.id]} onChange={handleChange} onBlur={saveForm} required />
          </Grid>
        );
      case "ul":
        return (        
          <Grid item xs={12}>
             <Grid> <label htmlFor={field.id}>{field.name}:</label></Grid>
              {field.options.map((option) => (
                    <Tooltip title={option.category}>
                    <Chip color="primary" sx={{margin:"2px"}} label={option.value+" - "+option.label}/>
                    </Tooltip>
              ))}
          </Grid>
        );
      case "selectUser":
        return (
          <Grid item xs={size}>
            <SelectFind id={field.id} name={field.id} options={field.options} placeholder="Selecione um associado" onChange={handleChange} isSearchable required />
          </Grid>
        );
      case "number":
        return (
          <Grid item xs={size}>
            <TextField  className="formInput" label={field.name} id={field.id} type="number" onChange={handleChange} variant="standard" value="15" required />
          </Grid>
        );
      case "radio":
        return (
          <Grid item xs={size}>
            <FormControl>
              {field.name}
              <RadioGroup aria-labelledby="demo-radio-buttons-group-label" name={field.id} onChange={handleChange} variant="standard" required>
                {field.options.map((item, i) => {
                  return (
                    <div>
                      <FormControlLabel key={i} value={item} control={<Radio />} label={item} />
                    </div>
                  );
                })}
              </RadioGroup>
            </FormControl>
          </Grid>
        );
      case "select":
        return (
          <Grid item xs={size}>
            <FormControl fullWidth>
              <InputLabel id={field.id}>{field.options.placeholder}</InputLabel>
              <Select id={field.id} name={field.id} className={`input-form`} label={field.options.placeholder} onChange={handleChange}>
                {field.options.values.map((field, i) => {
                  return (
                    <MenuItem key={i} value={field.value}>
                      {field.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        );

      case "selectStates":
        return (
          <Grid item xs={size}>
            <FormControl fullWidth>
              <InputLabel id={field.id}>{field.options.placeholder}</InputLabel>
              <Select id={field.id} name={field.id} className={`input-form`} label={field.options.placeholder} onChange={handleChange} required>
                {states.map((field, i) => {
                  return (
                    <MenuItem key={i} value={field.value}>
                      {field.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        );

      case "selectCond":
        return (
          <Grid item xs={size}>
            <FormControl fullWidth>
              <InputLabel id={field.id}>{field.options.placeholder}</InputLabel>
              <Select id={field.id} name={field.id} className={`input-form`} label={field.options.placeholder} onChange={handleChange}>
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
                return <TextField className="formInput"  label={field.name} id={field.id} name={field.elementName} onChange={handleChange} variant="standard" required />;
              })}
          </Grid>
        );

      case "conditional":
        return (
          <Grid item xs={size}>
            <TextField  className="formInput" label={field.name} id={field.id} name={field.id} defaultValue={formValue[field.id]} value={formValue[field.id]} onChange={handleChange} onBlur={saveForm} variant="standard" hidden={field.options.hidden} required />
          </Grid>
        );
      case "cpf":
        return (
          <Grid item xs={size}>
            <InputMask mask="999.999.999-99" value={formValue[field.id]} onChange={handleChange} onBlur={saveForm}>
              {(inputProps) => (
                <TextField className="formInput" 
                  {...inputProps}
                  label={field.name}
                  id={field.id}
                  error={!!errorStates[field.id]}
                  name={field.id}
                  variant="standard"
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
          </Grid>
        );
      case "cep":
        return (
          <Grid item xs={size}>
            <InputMask mask="99999-999" value={formValue[field.id]} onChange={handleChange} onBlur={saveForm}>
              {(inputProps) => (
                <TextField className="formInput" 
                  {...inputProps}
                  label={field.name}
                  id={field.id}
                  name={field.id}
                  variant="standard"
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
          </Grid>
        );
      case "data":
        return (
          <Grid item xs={size}>
            <InputMask mask="99/99/9999" value={formValue[field.id]} onChange={handleChange} onBlur={saveForm}>
              {(inputProps) => (
                <TextField className="formInput" 
                  {...inputProps}
                  label={field.name}
                  id={field.id}
                  error={!!errorStates[field.id]}
                  name={field.id}
                  variant="standard"
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
          </Grid>
        );
      case "phone":
        return (
          <Grid item xs={size}>
            <InputMask mask="55 (99) 99999-9999" value={formValue[field.id]} onChange={handleChange} onBlur={saveForm}>
              {(inputProps) => (
                <TextField className="formInput" 
                  {...inputProps}
                  label={field.name}
                  id={field.id}
                  name={field.id}
                  variant="standard"
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
          </Grid>
        );
      case "email":
        return (
          <Grid item xs={size}>
            <TextField  className="formInput"  label={field.name} id={field.id} name={field.id} onChange={handleChange} value={formValue[field.id]} onBlur={saveForm} variant="standard" error={!!errorStates[field.id]} data-mask="true" helperText={!!errorStates[field.id] ? "Email Inválido" : ""} required />
          </Grid>
        );

      default:
        return (
          <Grid item xs={size}>
            <TextField className="formInput" error={false} label={field.name} id={field.id} name={field.id} defaultValue={formValue[field.id]} value={formValue[field.id]} onChange={handleChange} onBlur={saveForm} variant="standard" required />
          </Grid>
        );
    }
  }

  return (
      <form>
        <Grid container spacing={1}>
          {formFields.map((field) => renderFormField(field, formValue, handleChange))}
        </Grid>
      </form>
  );
}

export default Form;
