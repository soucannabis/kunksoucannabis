import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import Table from "../table";
import Coupon from "../inputs/coupons";
import TrackingCodeModal from "../modals/trackingCodeModal"
import OrderModal from "../modals/orderModal"
import apiRequest from "../../modules/apiRequest";
import Menu from '../../components/menu';

function Orders() {
  const [orderData, setorderData] = useState([]);

  useEffect(() => {
    async function orderData() {
      orderData = await apiRequest("/api/directus/orders", "", "GET");  

      function calcularTempoDecorrido(dataString) {
        const data = new Date(dataString);
        const diferenca = new Date() - data;
        const minutos = Math.floor(diferenca / (1000 * 60));
        if (minutos > 1440) {
          const dias = Math.floor(minutos / 1440);
          const restoMinutos = minutos % 1440;
          var diaTxt = "dias";
          var minTxt = "min";
          if (dias === 1) {
            diaTxt = "dia";
          }
          if (restoMinutos === 1) {
            minTxt = "min";
          }
          return `Há ${dias} ${diaTxt}`;
        } else if (minutos > 59) {
          const horas = Math.floor(minutos / 60);
          const restoMinutos = minutos % 60;
          var horaTxt = "h";
          var minTxt = "min";
          if (horas === 1) {
            horaTxt = "h";
          }
          if (restoMinutos === 1) {
            minTxt = "minuto";
          }
          return `Há ${horas} ${horaTxt} e ${restoMinutos} ${minTxt}`;
        } else {
          return `Há ${minutos} min`;
        }
      }

      orderData.forEach((order) => {
        order.created = calcularTempoDecorrido(order.date_created);
        order.total = "R$"+order.total
        order.delivery_price = "R$"+order.delivery_price

        switch (order.status) {
          case "finished":
            order.status = "Concluído";
            break;
          case "awaiting-payment":
            order.status = "Aguardando pagamento";
            break;
        }
      });

      setorderData(orderData);
    }
    orderData();
  }, []);

  return (
    <div>
      <Menu />
      <div class="nav-scroller bg-white box-shadow">
        <nav class="nav nav-underline">
         
        </nav>
      </div>
      <div className="container main my-3 p-3 bg-white rounded box-shadow">
        <Table dataTable={orderData} 
        headers={["","ID", "Items", "Nome", "Endereço", "Valor Total", "Frete", "Status", "Criado"]} 
        fields={["id", "items", "name_associate", "address", "total", "delivery_price", "status", "created"]}  
        OrderModal={OrderModal} 
        TrackingCodeModal={TrackingCodeModal}  
        />
      </div>
    </div>
  );
}

export default Orders;
