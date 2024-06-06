import React, { useState, useEffect } from "react";
import apiRequest from "../../modules/apiRequest";
import {
  Box,
  Button,
  Tabs,
  Tab,
  Select,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "../forms/form";
import DeleteIcon from '@mui/icons-material/Delete';

function Coupon({ usersData }) {
  const [coupons, setCoupons] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const [couponType, setCouponType] = useState("money");
  const [formFields, setFormFields] = useState([]);
  const [saveButton, setSaveButton] = useState(true);
  const [formData, setFormData] = useState({
    cod: null,
    use_limit: null,
    discount: null,
    type: "money",
    user: null,
    name_user: null,
  });

  useEffect(() => {
    async function getCoupons() {
      const coupons = await apiRequest("/api/directus/coupons", "", "GET");
      const users = await usersData.filter((item) => item.name_associate !== null);
      const selectOptions = users.map(({ name_associate, lastname_associate, id }) => ({ label: `${name_associate} ${lastname_associate}`, value: id }));

      setSelectData(selectOptions);
      setCoupons(coupons);
      setFormFields([
        { name: "Código", id: "cod", type: "text", options: null, size: 2 },
        { name: "Limite de uso", id: "use_limit", type: "text", options: null, size: 2 },
        {
          name: "Tipo",
          id: "type",
          type: "selectCond",
          options: {
            values: [
              { value: "money", label: "Dinheiro" },
              { value: "percentage", label: "Porcentagem" },
            ],
            placeholder: "Selecione o tipo do cupom"
          },
          size: 2,
          fields: [
            { name: "Desconto em reais", id: "money", type: "conditional", options: null, size: 2, elementName: "discount" },
            { name: "Desconto em %", id: "percentage", type: "conditional", options: null, size: 2, elementName: "discount" },
          ],
        },
        { name: "Associado", id: "user", type: "selectUser", options: selectOptions, size: 2 },
      ]);
    }

    getCoupons();
  }, [usersData]);

  function returnDataForm(data) {
    if (data && !data.setButton) {
      console.log(data)
      setFormData(data);
    }

    if (data.setButton) {
      setSaveButton(false);
    } else {
      setSaveButton(true);
    }
  }

  async function formSubmit() {
    function insNull(obj) {
      for (const chave in obj) {
        if (obj[chave] === null) {
          return true;
        }
      }
      return false;
    }
    if (insNull(formData)) {
      toast.error("Você precisa preencher todos os campos");
      return false;
    }

    formData.discount = parseInt(formData.discount);
    formData.use_limit = parseInt(formData.use_limit);

    const coupon = await apiRequest("/api/directus/coupons", { coupon: formData }, "POST");
    if (coupon) {
      toast.success("Novo cupom criado");
      setCoupons([...coupons, formData]);
    } else {
      toast.error("Já existe um cupom para este associado");
    }
  }

  async function deleteCoupom(el) {
    await apiRequest("/api/directus/coupons", { couponId: el.currentTarget.id }, "DELETE");
    const id = parseInt(el.currentTarget.id);
    const deleteItem = coupons.filter((item) => item.id !== id);
    setCoupons(deleteItem);
  }

  return (
    <div className="container">
      <ToastContainer />
      <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', maxWidth: '100%', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Cupons de Desconto</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <TableContainer component={Paper} sx={{ flex: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Desconto</TableCell>
                  <TableCell>Limite de Uso</TableCell>
                  <TableCell>Associado</TableCell>
                  <TableCell>Excluir</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coupons.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.cod}</TableCell>
                    <TableCell>{item.type === "money" ? "Dinheiro" : "Porcentagem"}</TableCell>
                    <TableCell>{item.type === "money" ? `R$${item.discount}` : `${item.discount}%`}</TableCell>
                    <TableCell>{item.use_limit}</TableCell>
                    <TableCell>{item.name_user}</TableCell>
                    <TableCell>
                      <IconButton id={item.id} onClick={deleteCoupom}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ flex: 1, marginLeft: 2 }}>
            <Form formFields={formFields} returnDataForm={returnDataForm} full />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={formSubmit} variant="contained" color="primary" disabled={saveButton}>
            Save Changes
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default Coupon;
