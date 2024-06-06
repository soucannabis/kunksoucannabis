import React, { useState, useEffect } from "react";
import apiRequest from "../../modules/apiRequest";
import { Box, Button, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Tab, Tabs } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "../forms/form";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";

function Partners() {
  const [showModalEditPartners, setShowModalEditPartners] = useState(false);
  const [partners, setPartners] = useState([]);
  const [partnerType, setPartnerType] = useState(false);
  const [saveButton, setSaveButton] = useState(true);

  const partnerData = {
    first_name: null,
    last_name: null,
    birthday: null,
    gender: null,
    nationality: null,
    cpf: null,
    cnpj: null,
    partner_type: "Pessoa Física",
    rg: null,
    rg_emitter: null,
    marital_status: null,
    email: null,
    pass_account: null,
    mobile_number: null,
    street: null,
    number_street: null,
    neighborhood: null,
    city: null,
    state: null,
    cep: null,
    documents: null,
  };

  const [partner, setPartner] = useState(partnerData);
  const [formData, setFormData] = useState(partnerData);
  const [formFields, setFormFields] = useState([]);

  useEffect(() => {
    async function getPartners() {
      const partners = await apiRequest("/api/directus/partners", "", "GET");
      setPartners(partners);
      setFormFields([
        { name: "Nome", id: "first_name", type: "text", options: null, size: 2 },
        { name: "Sobrenome", id: "last_name", type: "text", options: null, size: 2 },
        { name: "Documento CPF ou CNPJ", id: "id_doc", type: "text", options: null, size: 2 },
        { name: "Data de Nascimento", id: "birthday", type: "date", options: null, size: 2 },
        { name: "Gênero", id: "gender", type: "text", options: null, size: 2 },
        { name: "Nacionalidade", id: "nationality", type: "text", options: null, size: 2 },
        { name: "Email", id: "email", type: "email", options: null, size: 2 },
        { name: "Telefone", id: "mobile_number", type: "phone", options: null, size: 2 },
        { name: "Rua", id: "street", type: "text", options: null, size: 2 },
        { name: "Número", id: "number_street", type: "text", options: null, size: 2 },
        { name: "Bairro", id: "neighborhood", type: "text", options: null, size: 2 },
        { name: "Cidade", id: "city", type: "text", options: null, size: 2 },
        { name: "Estado", id: "state", type: "selectStates", options: { placeholder: "Selecione o estado" }, size: 2 },
        { name: "CEP", id: "cep", type: "cep", options: null, size: 2 },
      ]);
    }

    getPartners();
  }, []);

  const handleCloseEditPartners = () => setShowModalEditPartners(false);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "date" ? new Date(value) : value,
    }));
  };

  const handleChangePartnerEdit = (event) => {
    if (event.target.id === "partner_type" && event.target.value === 1) {
      setPartnerType(true);
    } else {
      setPartnerType(false);
    }
    const { name, value, type } = event.target;
    setPartner((prevData) => ({
      ...prevData,
    }));
  };

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

  async function createPartner(e) {
    setPartners([...partners, formData]);
    const partner = await apiRequest("/api/directus/partner", formData, "POST");
    if (partner) {
      toast.success("Novo parceiro criado");
    } else {
      toast.error("Já existe um parceiro com esses dados");
    }
  }

  async function deletePartner(el) {
    if (window.confirm(`Tem certeza que deseja excluir o parceiro?`)) {
      await apiRequest("/api/directus/partner", { partnerId: el.target.id }, "DELETE");
      const id = parseInt(el.target.id);
      const deleteItem = partners.filter((item) => item.id !== id);
      setPartners(deleteItem);
    }
  }

  async function editPartner(e) {
    const partner = partners.filter((partiner) => partiner.id === parseInt(e.currentTarget.id));
    setPartner(partner[0]);
    setShowModalEditPartners(true);
  }

  const updatePartner = async (event) => {
    event.preventDefault();
    await apiRequest("/api/directus/partner", { partnerId: partner.id, data: partner }, "PATCH");
    setShowModalEditPartners(false);
  };

  function updateTable(data) {
    const partnersUpdateData = partners.map((item) => {
      if (data.id === item.id) {
        return data;
      } else {
        return item;
      }
    });
    setPartners(partnersUpdateData);
  }

  return (
    <div className="container">
      <ToastContainer />
      <Modal open={showModalEditPartners} onClose={handleCloseEditPartners}>
        <ModalDialog layout="center">
          <ModalClose onClick={handleCloseEditPartners} />
          <DialogTitle> {partner.first_name}</DialogTitle>
          <DialogContent>
            <Box sx={{ padding: 4, backgroundColor: "white", margin: "auto", marginTop: "10%", maxWidth: "90%", borderRadius: 2 }}>
              <Form formFields={formFields} formData={partner} updateTable={updateTable} returnDataForm={returnDataForm} half partnerEditForm autoupload />
            </Box>
          </DialogContent>
        </ModalDialog>
      </Modal>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <Box sx={{ flex: 2, marginRight: 2 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>E-mail</TableCell>
                  <TableCell>Comissão</TableCell>
                  <TableCell>Comissão Total</TableCell>
                  <TableCell>Editar</TableCell>
                  <TableCell>Excluir</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {partners.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.first_name + " " + item.last_name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.commission_value} %</TableCell>
                    <TableCell>R$ {item.commission_total}</TableCell>
                    <TableCell>
                      <IconButton id={item.id} onClick={editPartner}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton id={item.id} onClick={deletePartner}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Criar Parceiro
          </Typography>
          <Form formFields={formFields} returnDataForm={returnDataForm} half />
          <Button onClick={createPartner} variant="contained" color="primary" disabled={saveButton}>
            Save Changes
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default Partners;
