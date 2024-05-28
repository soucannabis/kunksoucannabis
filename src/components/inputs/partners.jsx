import React, { useState, useEffect } from "react";
import apiRequest from "../../modules/apiRequest";
import { Modal, Button } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputMask from "react-input-mask";
import Form from "../forms/form";

function Partners() {
  const [showModalPartners, setShowModalPartners] = useState(false);
  const [showModalEditPartners, setShowModalEditPartners] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [partners, setPartners] = useState([]);
  const [partnerType, setPartnerType] = useState(false);

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
        { name: "Documento CPF ou CNPJ", id: "rg", type: "text", options: null, size: 2 },
        { name: "Data de Nascimento", id: "birthday", type: "data", options: null, size: 2 },
        { name: "Gênero", id: "gender", type: "text", options: null, size: 2 },
        { name: "Nacionalidade", id: "nationality", type: "text", options: null, size: 2 },
        { name: "Email", id: "email", type: "email", options: null, size: 2 },
        { name: "Telefone", id: "mobile_number", type: "phone", options: null, size: 2 },
        { name: "Rua", id: "street", type: "text", options: null, size: 2 },
        { name: "Número", id: "number_street", type: "text", options: null, size: 2 },
        { name: "Bairro", id: "neighborhood", type: "text", options: null, size: 2 },
        { name: "Cidade", id: "city", type: "text", options: null, size: 2 },
        { name: "Estado", id: "state", type: "selectStates", options: {placeholder:"Selecione o estado"}, size: 2 },
        { name: "CEP", id: "cep", type: "cep", options: null, size: 2 },
        { name: "Comissão %", id: "commission_value", type: "number", options: null, size: 2 }       
      ]);
    }

    getPartners();
  }, []);

  const handleClosePartners = () => setShowModalPartners(false);
  const handleShowPartners = () => setShowModalPartners(true);

  const handleCloseEditPartners = () => setShowModalEditPartners(false);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "date" ? new Date(value) : value, // Handle date input
    }));
  };

  const handleChangePartnerEdit = (event) => {
    if (event.target.id == "partner_type" && event.target.value == 1) {
      setPartnerType(true);
    } else {
      setPartnerType(false);
    }
    const { name, value, type } = event.target;
    setPartner((prevData) => ({
      ...prevData,
      [name]: type === "date" ? new Date(value) : value, // Handle date input
    }));
  };

  function returnDataForm(data) {
    setFormData(data);
  }

  async function deletePartner(el) {
    if (confirm(`Tem certeza que deseja excluir o parceiro?`)) {
      await apiRequest("/api/directus/partner", { partnerId: el.target.id }, "DELETE");
      const id = parseInt(el.target.id);
      const deleteItem = partners.filter((item) => item.id !== id);
      setPartners(deleteItem);
    }
  }

  async function editPartner(e) {
    const partner = partners.filter((partiner) => partiner.id == e.target.id);
    setPartner(partner[0]);
    setShowModalEditPartners(true);
  }

  const updatePartner = async (event) => {
    event.preventDefault();
    await apiRequest("/api/directus/partner", { partnerId: partner.id, data: partner }, "PATCH");

    const partnersUpdateData = partners.map((item) => {
      if (item.id === partner.id) {
        return partner;
      } else {
        return item;
      }
    });

    setPartners(partnersUpdateData);
    setShowModalEditPartners(false);
  };

  return (
    <div className="container">
      <ToastContainer />
      <Modal show={showModalEditPartners} onHide={handleCloseEditPartners}>
        <Modal.Header closeButton>
          <Modal.Title>{partner.first_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="conteiner">
            <form onSubmit={updatePartner}>
              {partner.type == "1" && (
                <div>
                  <label htmlFor="first_name">Nome da Empresa:</label>
                  <input className="form-control" type="text" id="first_name" name="first_name" value={partner.first_name} onChange={handleChangePartnerEdit} />

                  <label htmlFor="first_name">CNPJ:</label>
                  <input className="form-control" type="text" id="cnpj" name="cnpj" value={partner.cpf} onChange={handleChangePartnerEdit} />
                </div>
              )}

              <div>
                {!partner.type == "0" ? <label htmlFor="first_name">Nome:</label> : <label htmlFor="first_name">Nome do responsável:</label>}
                <input className="form-control" type="text" id="first_name" name="first_name" value={partner.first_name} onChange={handleChangePartnerEdit} />
              </div>
              <div>
                {!partner.type == "0" ? <label htmlFor="last_name">Sobrenome:</label> : <label htmlFor="last_name">Sobrenome do responsável:</label>}

                <input className="form-control" type="text" id="last_name" name="last_name" value={partner.last_name} onChange={handleChangePartnerEdit} />
              </div>
              <div>
                <label htmlFor="first_name">CPF:</label>
                <InputMask mask="999.999.999-99" onChange={handleChangePartnerEdit} placeholder="000.000.000-00" typee="text" class="form-control" id="cpf" name="cpf" value={partner.cpf}></InputMask>
              </div>
              <div>
                <label htmlFor="first_name">RG:</label>
                <input className="form-control" type="text" id="rg" name="rg" value={partner.rg} onChange={handleChangePartnerEdit} />
              </div>
              <div>
                <label htmlFor="birthday">Data de Nascimento:</label>
                <input className="form-control" type="text" id="birthday" name="birthday" value={partner.birthday} onChange={handleChangePartnerEdit} />
              </div>
              <div>
                <label htmlFor="gender">Gênero:</label>
                <input className="form-control" type="text" id="gender" name="gender" value={partner.gender} onChange={handleChangePartnerEdit} />
              </div>
              <div>
                <label htmlFor="nationality">Nationality:</label>
                <input className="form-control" type="text" id="nationality" name="nationality" value={partner.nationality} onChange={handleChangePartnerEdit} />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <input className="form-control" type="email" id="email" name="email" value={partner.email} onChange={handleChangePartnerEdit} />
              </div>
              <div>
                <label htmlFor="mobile_number">Mobile Number:</label>
                <InputMask mask="(99) 99999-9999" onChange={handleChangePartnerEdit} placeholder="000.000.000-00" type="text" class="form-control" id="mobile_number" name="mobile_number" value={partner.mobile_number}></InputMask>
              </div>
              <div>
                <label htmlFor="mobile_number">Rua</label>
                <input className="form-control" type="text" id="street" name="street" value={partner.street} onChange={handleChangePartnerEdit} />
              </div>
              <div>
                <label htmlFor="mobile_number">Número</label>
                <input className="form-control" type="text" id="number_street" name="number_street" value={partner.number_street} onChange={handleChangePartnerEdit} />
              </div>
              <div>
                <label htmlFor="mobile_number">Bairro</label>
                <input className="form-control" type="text" id="neighborhood" name="neighborhood" value={partner.neighborhood} onChange={handleChangePartnerEdit} />
              </div>
              <div>
                <label htmlFor="mobile_number">Cidade</label>
                <input className="form-control" type="text" id="city" name="city" value={partner.city} onChange={handleChangePartnerEdit} />
              </div>
              <div>
                <label htmlFor="mobile_number">Estado</label>
                <input className="form-control" type="text" id="state" name="state" value={partner.state} onChange={handleChangePartnerEdit} />
              </div>
              <div>
                <label htmlFor="mobile_number">CEP</label>
                <input className="form-control" type="text" id="cep" name="cep" value={partner.cep} onChange={handleChangePartnerEdit} />
              </div>
              <div>
                <label htmlFor="mobile_number">Comissão</label>
                <input className="form-control" type="text" id="commission_value" name="commission_value" value={partner.commission_value} onChange={handleChangePartnerEdit} />
              </div>

              <button>Submit</button>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditPartners}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalPartners} onHide={handleClosePartners}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="partners" className="mb-3">
            <Tab eventKey="partners" title="Parceiros">
              <div className="col-md-12">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Nome</th>
                      <th scope="col">E-mail</th>
                      <th scope="col">Comissão</th>
                      <th scope="col">Comissão Total</th>
                      <th scope="col">Editar</th>
                      <th scope="col">Excluir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map((item, index) => (
                      <tr key={index}>
                        <td></td>
                        <td>{item.first_name + " " + item.last_name}</td>
                        <td>{item.email}</td>
                        <td>{item.commission_value} %</td>
                        <td>R$ {item.commission_total}</td>
                        <td>
                          <a style={{ cursor: "pointer", color: "green" }} id={item.id} onClick={editPartner}>
                            <svg id={item.id} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                              <path id={item.id} d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                            </svg>
                          </a>
                        </td>
                        <td>
                          <a style={{ cursor: "pointer", color: "red" }} id={item.id} onClick={deletePartner}>
                            X
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tab>
            <Tab eventKey="newPartner" title="Criar Parceiro">
              <div className="container">
                <Form formFields={formFields} returnDataForm={returnDataForm} half />
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePartners}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <a style={{ cursor: "pointer" }} variant="primary" onClick={handleShowPartners} handleChangePartnerEdit={handleChangePartnerEdit}>
        Parceiros
      </a>
    </div>
  );
}

export default Partners;
