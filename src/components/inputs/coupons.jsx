import React, { useState, useEffect } from "react";
import apiRequest from "../../modules/apiRequest";
import { Modal, Button } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Coupon({ usersData }) {
  const [showModal, setShowModal] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const [placeholderUser, setPlaceholderUser] = useState("Selecione um associado");
  const [couponType, setCouponType] = useState("money");

  const [formData, setFormData] = useState({
    cod: null,
    use_limit: null,
    discount: null,
    type: "money",
    date_limit: null,
    user: null,
  });

  useEffect(() => {
    async function getCoupons() {
      const coupons = await apiRequest("/api/directus/coupons", "", "GET");
      const users = await usersData.filter((item) => item.name_associate !== null);
      const selectOptions = users.map(({ name_associate, lastname_associate, id }) => ({ label: `${name_associate} ${lastname_associate}`, value: id }));
     
      setSelectData(selectOptions);
      setCoupons(coupons);
    }

    getCoupons();
  }, [usersData]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleChangeInput = (event) => {
    if (event.target) {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
      });
    } else {
      setFormData({
        ...formData,
        ["user"]: event.value,
      });
      document.getElementById("user").placeholder = event.value;
      setPlaceholderUser(event.label);
    }

    if (event.target.name == "type") {
      setCouponType(event.target.value);
    }
  };


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
              <div className="col-md-12">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Código</th>
                      <th scope="col">Data Limite</th>
                      <th scope="col">Desconto</th>
                      <th scope="col">Limite de Uso</th>
                      <th scope="col">Usuário</th>
                      <th scope="col">Tipo</th>
                      <th scope="col">Excluir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((item, index) => (
                      <tr key={index}>
                        <td>{item.cod}</td>
                        <td>{item.date_limit}</td>
                        <td>{item.discount}</td>
                        <td>{item.use_limit}</td>
                        <td>{item.user}</td>
                        <td>{item.type}</td>
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
            </Tab>
            <Tab eventKey="newCoupom" title="Criar Cupom">
              <div className="container">
                <form>
                  <div className="mb-3">
                    <label htmlFor="codigo" className="form-label">
                      Código:
                    </label>
                    <input onChange={handleChangeInput} type="text" className="form-control" id="cod" name="cod" value={formData.cod} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="limiteUso" className="form-label">
                      Limite de Uso (entre 1 e 3):
                    </label>
                    <input onChange={handleChangeInput} type="number" className="form-control" id="use_limit" name="use_limit" min="1" max="3" value={formData.use_limit} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="tipo" className="form-label">
                      Tipo:
                    </label>
                    <select onChange={handleChangeInput} className="form-select" id="type" name="type" value={formData.type} required>
                      <option value="money">Dinheiro</option>
                      <option value="percentage">Porcentagem</option>
                    </select>
                  </div>
                  {couponType == "percentage" ? (
                    <div>
                      <div className="mb-3">
                        <label htmlFor="desconto" className="form-label">
                           Desconto (entre 1% e 100%)
                        </label>
                        <input onChange={handleChangeInput} type="number" className="form-control" id="discount" name="discount" min="1" max="100" value={formData.discount} required />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-3">
                        <label htmlFor="desconto" className="form-label">
                          Desconto em R$:
                        </label>
                        <input onChange={handleChangeInput} type="number" className="form-control" id="discount" name="discount" min="1" max="100" value={formData.discount} required />
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="dataLimite" className="form-label">
                      Data Limite:
                    </label>
                    <input onChange={handleChangeInput} type="date" className="form-control" id="date_limit" name="date_limit" value={formData.date_limit} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="user" className="form-label">
                      User:
                    </label>
                    <Select onChange={handleChangeInput} id="user" name="user" options={selectData} placeholder={placeholderUser} value={placeholderUser} isSearchable />
                  </div>
                  <Button onClick={formSubmit} variant="primary">
                    Save Changes
                  </Button>
                </form>
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
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
