import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import Table from "../table";
import Coupon from "../inputs/coupons";
import apiRequest from "../../modules/apiRequest";
import Partners from "../inputs/partners";
import Menu from '../../components/menu';

function Dash() {
  const [usersData, setUsersData] = useState([]);
  const [patientsData, setpatientsData] = useState([]);

  useEffect(() => {
    async function usersData() {
      usersData = await apiRequest("/api/directus/all-users", "", "GET");

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

      usersData.forEach((user) => {
        user.created = calcularTempoDecorrido(user.date_created);

        switch (user.status) {
          case "formerror":
            user.status = "Problema ao preencher os dados";
            break;
          case "registered":
            user.status = "Apenas preencheu os dados";
            break;
          case "published":
            user.status = "Ainda não preencheu os dados";
            break;
          case "signedcontract":
            user.status = "Associado";
            break;
          case "aguardando-aprovacao":
            user.status = "Associado";
            break;
          default:
            break;
        }
      });
      setpatientsData(usersData.filter((obj) => obj.status === "patient"));
      usersData = usersData.filter((obj) => obj.status !== "patient");
   
      usersData = usersData.map((obj) => {
        const firstName = obj.name_associate || "";
        const lastName = obj.lastname_associate || "";
        const fullname = `${firstName} ${lastName}`.trim();
        return { ...obj, fullname };
      })

      setUsersData(usersData);
    }
    usersData();
  }, [usersData]);


  const updateTable = (updatedUser) => {
    setUsersData((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === updatedUser.id) {
          return updatedUser;
        }
        return user;
      })
    );
  };
  
  return (
    
    <div>
      <div className="container main my-3 p-3 bg-white rounded box-shadow">        
        <Table data={[{usersData:usersData, patientsData:patientsData}]} headers={["Nome", "E-mail", "Telefone", "Status", "Criado"]} fields={["fullname", "email_account", "mobile_number", "status", "created"]} updateTable={updateTable} usersData={usersData} />
      </div>
    </div>
  );
}

export default Dash;
