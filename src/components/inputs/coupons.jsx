import React, { useState, useEffect } from "react";
import apiRequest from "../../modules/apiRequest";
import { Modal, Button } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "../forms/form";

function Coupon({ usersData }) {
  const [showModal, setShowModal] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const [placeholderUser, setPlaceholderUser] = useState("Selecione um associado");
  const [couponType, setCouponType] = useState("money");
  const [formFields, setFormFields] = useState([]);

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

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  function returnDataForm(data) {
    setFormData(data);
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
    await apiRequest("/api/directus/coupons", { couponId: el.target.id }, "DELETE");
    const id = parseInt(el.target.id);
    const deleteItem = coupons.filter((item) => item.id !== id);
    setCoupons(deleteItem);
  }

  return (
    <div className="container">
      <ToastContainer />
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="coupons" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="coupons" title="Cupons">
              <div className="row">
                <div className="col-md-8">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Código</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Desconto</th>
                        <th scope="col">Limite de Uso</th>
                        <th scope="col">Associado</th>
                        <th scope="col">Excluir</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons
                        .map((item) => {
                          if (item.type === "money") {
                            return { ...item, type: "Dinheiro" };
                          } else if (item.type === "percentage") {
                            return { ...item, type: "Porcentagem" };
                          }
                          return item;
                        })
                        .map((item, index) => (
                          <tr key={index}>
                            <td>{item.cod}</td>
                            <td>{item.type}</td>
                            <td>{item.type == "Dinheiro" ? "R$" + item.discount : item.discount + "%"}</td>
                            <td>{item.use_limit}</td>
                            <td>{item.name_user}</td>

                            <td>
                              <a style={{ cursor: "pointer", color: "red" }} id={item.id} onClick={deleteCoupom}>
                                X
                              </a>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="col-md-4">
                  <Form formFields={formFields} returnDataForm={returnDataForm} full />
                </div>
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={formSubmit} variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <a style={{ cursor: "pointer" }} variant="primary" onClick={handleShow}>
        Cupons de Desconto
      </a>
    </div>
  );
}

export default Coupon;
