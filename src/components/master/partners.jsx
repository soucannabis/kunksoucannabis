import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Menu from "../menuPartner";
import PartnerForm from "../forms/partnerForm";
import apiRequest from "../../modules/apiRequest";
import AssociatesPartner from "../inputs/addAssociateToPartner";
import PartnersModal from "../modals/partnerPopover";
function Partners() {
  const { code } = useParams();
  const [partnerData, setPartnerData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day < 10 ? "0" : ""}${day}/${month < 10 ? "0" : ""}${month}/${year}`;
    return formattedDate;
  }

  useEffect(() => {
    async function partnerData() {
      const data = await apiRequest("/api/directus/partner?code=" + code, "", "GET");
      setPartnerData(data);

      var transaction = JSON.parse(data.transactions);
      transaction = transaction.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
      setTransactions(transaction);
    }

    partnerData();
  }, []);
  

  return (
    <div>
      <Menu />
      <div class="nav-scroller bg-white box-shadow"></div>
      <div style={{ padding: "50px 200px" }} className="container">
        <Tabs defaultActiveKey="history" id="uncontrolled-tab-example" className="mb-3">
          <Tab eventKey="history" title="Histórico de comissões">
            <table className="table">
              <thead>
                <tr>
                  <th>Detalhes do pedido</th>
                  <th>Detalhes do associado</th>
                  <th>Total do pedido</th>
                  <th>Comissão do pedido</th>
                  <th>Valor da comissão</th>
                  <th>Total de comissões</th>
                  <th>Data do pedido</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>
                      <PartnersModal data={transaction.orderCode} type="order" />
                    </td>
                    <td>
                      <PartnersModal data={transaction.userCode} type="user" />
                    </td>
                    <td>{transaction.totalOrder}</td>
                    <td>{transaction.commissionOrder}</td>
                    <td>{transaction.commissionValue}%</td>
                    <td>{transaction.commissionTotal}</td>
                    <td>{formatDate(transaction.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Tab>
          <Tab eventKey="associates" title="Meus Associados">
            <AssociatesPartner />
          </Tab>
          <Tab eventKey="user" title="Editar Dados Pessoais">
            <PartnerForm data={partnerData} hiddenFields={["commission_value", "pass_account", "type"]} disabledFields={["first_name", "last_name", "cpf", "cnpj", "rg", "rg_emitter"]} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default Partners;
