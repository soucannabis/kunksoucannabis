import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiRequest from "../../modules/apiRequest";
import InputMask from "react-input-mask";
import { ToastContainer, toast } from "react-toastify";
function AssociatesPartner() {
  const { code } = useParams();
  const [formData, setFormData] = useState("");
  const [associate, setAssociate] = useState(false);
  const [associateError, setAssociateError] = useState(false);
  const [partnerData, setPartnerData] = useState([]);
  const [associates, setAssociates] = useState([]);
  const [tableAssociates, setTableAssociates] = useState([]);

  useEffect(() => {
    async function partnerData() {
      const data = await apiRequest("/api/directus/partner?code=" + code, "", "GET");

      if (data.associates) {
        const associates = JSON.parse(data.associates)
        var newTableAssociates = [];

        for (const code of associates) {
          const userData = await apiRequest("/api/directus/user?code=" + code, "", "GET");
          newTableAssociates.push(userData[0])
        };

        setTableAssociates(newTableAssociates)
        setAssociates(associates);
      }
      setPartnerData(data);
    }
    partnerData();
  }, []);

  async function searchAssociate(e) {
    e.preventDefault();
    setAssociate(false);

    const response = await apiRequest("/api/directus/user?cpf=" + formData, "", "GET");
    if (response.length == 0) {
      setAssociateError(true);
    } else {
      setAssociate(response[0]);
      setAssociates([...associates, response[0].user_code]);
      setAssociateError(false);
    }
  }

  function handleChange(e) {
    setFormData(e.target.value);
  }

  async function addAssociate() {
    console.log(associate)
    setTableAssociates([...tableAssociates, associate]);
    console.log(associates);
    await apiRequest("/api/directus/partner", { partnerId: partnerData.id, data: { associates: associates } }, "PATCH");
    await apiRequest("/api/directus/update", { userId: associate.id, formData: { partner: code } }, "POST");
    setAssociate(false);
  }

  async function deleteAssociate(e) {
    if (confirm(`Tem certeza que deseja excluir o associado?`)) {
      const associatesData = tableAssociates.filter(item => item.user_code != e.target.name)
      const associateData = associates.filter(item => item != e.target.name)
      setTableAssociates(associatesData);
     await apiRequest("/api/directus/partner", { partnerId: partnerData.id, data: { associates: associateData } }, "PATCH");
      await apiRequest("/api/directus/update", { userId: e.target.id, formData: { partner: null } }, "POST");
    }

  }

  return (
    <div className="container">
      <table className="table"> 
        <thead>
          <tr>
            <th>Name</th>
            <th>Endereço</th>
            <th>Email Account</th>
            <th>CPF Associate</th>
            <th>Mobile Number</th>
            <th>Birthday Associate</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {tableAssociates.map((associate, index) => (
            <tr key={index}>
              <td>{associate.name_associate} {associate.lastname_associate}</td>
              <td>{associate.street}, {associate.number} - {associate.neighborhood} - {associate.city} - {associate.state} - {associate.cep}</td> 
              <td>{associate.email_account}</td>
              <td>{associate.cpf_associate}</td>
              <td>{associate.mobile_number}</td>
              <td>{associate.birthday_associate}</td>
              <td><a id={associate.id} name={associate.user_code} style={{color:"red", cursor:"pointer"}} onClick={deleteAssociate}>X</a></td>
            </tr>
          ))}
        </tbody>
      </table>
      <form>
        <InputMask mask="999.999.999-99" style={{ width: "50%" }} onChange={handleChange} placeholder="000.000.000-00" typee="text" class="form-control" id="seacrhAssociate" name="seacrhAssociate"></InputMask>
        <button type="submit" onClick={searchAssociate} className="btn btn-success">
          Pesquisar Associado
        </button>
      </form>
      {associateError && (
        <div>
          <p>Nenhum associado foi encontrado com o CPF informado</p>
        </div>
      )}
      {associate && (
        <div>
          {associate.name_associate + " " + associate.lastname_associate}
          <button type="submit" onClick={addAssociate} className="btn btn-success">
            Adicionar Associado
          </button>
        </div>
      )}
    </div>
  );
}

export default AssociatesPartner;
