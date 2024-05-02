import React, { useState, useEffect } from "react";
import { Modal, Popover, OverlayTrigger, Button } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import apiRequest from "../../modules/apiRequest";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OrderModal({ data, type }) {
  const [user, setUserData] = useState([]);
  const [order, setOrderData] = useState([]);
  const [itemsOrder, setItemsOrder] = useState([]);
  const [show, setShowModal] = useState();

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  useEffect(() => {
    async function request() {
      if (type == "user") {
        const userData = await apiRequest("/api/directus/user?code=" + data, "", "GET");
        setUserData(userData[0]);
      }

      if (type == "order") {
        const orderData = await apiRequest("/api/directus/order?code=" + data, "", "GET");
        setItemsOrder(JSON.parse(orderData[0].items));
        setOrderData(orderData[0]);
      }
    }
    request();
  }, []);

  const popoverUser = (
    <Popover id="popover-positioned-right" title="Popover right">
      <div style={{ padding: "20px" }}>
        <p>
          <strong>Nome:</strong> {user.name_associate + " " + user.lastname_associate}
        </p>
        <p>
          <strong>CPF:</strong> {user.cpf_associate}
        </p>
        <p>
          <strong>Telefone:</strong> {user.mobile_number}
        </p>
        <p>
          <strong>Endereço:</strong> {user.street + " - " + user.number + " - " + user.city + " - " + user.state + " - " + user.cep}
        </p>
      </div>
    </Popover>
  );

  const popoverOrder = (
    <Popover id="popover-positioned-right" title="Popover right">
      <div style={{ padding: "20px" }}>
        <p>
          <p>
            <strong>Nome do Associado:</strong> {order.name_associate}
          </p>
          <p>
            <strong>Endereço de entrega:</strong> {order.address}
          </p>
          <div>
            <strong>Itens:</strong>
            {console.log(order)}
            {itemsOrder.map((item, index) => (
              <div key={index}>
                <p>
                  {item.quantity}x {item.code}
                </p>
              </div>
            ))}
          </div>
          <p>
            <strong>Total do Pedido:</strong> {order.total}
          </p>
          <p>
            <strong>Valor do Frete:</strong> {order.delivery_price}
          </p>
        </p>
      </div>
    </Popover>
  );

  return (
    <div>
      {type == "user" && (
        <div>
          <OverlayTrigger trigger={["hover"]} placement="right" overlay={popoverUser}>
            <Button className="btn-popover"> {user.name_associate + " " + user.lastname_associate}</Button>
          </OverlayTrigger>
        </div>
      )}
      {type == "order" && (
        <div>
          <OverlayTrigger trigger={["hover"]} placement="right" overlay={popoverOrder}>
            <Button className="btn-popover"> {order.payment_form}</Button>
          </OverlayTrigger>
        </div>
      )}
      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          {type == "user" && <Modal.Title>{user.name_associate + " " + user.lastname_associate}</Modal.Title>}
          {type == "partner" && <Modal.Title>{order.name_associate}</Modal.Title>}
        </Modal.Header>
        <Modal.Body>
          <div className="container"></div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default OrderModal;
