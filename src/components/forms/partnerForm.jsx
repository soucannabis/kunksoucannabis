import React, { useState, useEffect } from "react";
import apiRequest from "../../modules/apiRequest";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputMask from "react-input-mask";

function PartnerForm({ data, hiddenFields, disabledFields }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      setFormData({
        first_name: null,
        last_name: null,
        birthday: null,
        gender: null,
        nationality: null,
        cpf: null,
        cnpj: null,
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
        type: null,
      });
    }

    if (hiddenFields) {
      hiddenFields.forEach((id) => {
        const el = document.getElementById(id);
        const label = document.getElementById("label-" + id);
        el.hidden = true;
        label.hidden = true;
      });
    }

    if (disabledFields) {
      disabledFields.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.disabled = true;
        } 
      });
    }
  }, [data]);

  const [partnerType, setPartnerType] = useState(false);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "date" ? new Date(value) : value,
    }));

    if (event.target.id == "type" && event.target.value == 1) {
      setPartnerType(true);
    } else {
      setPartnerType(false);
    }
  };

  async function createPartner(e) {
    e.preventDefault();

    function insNull(obj) {
      for (const chave in obj) {
        if (obj[chave] === null || obj[chave] === "") {
          return true;
        }
      }
      return false;
    }

    if (!partnerType) {
      delete formData.cnpj;
      delete formData.documents;
    }

    /*  if (insNull(formData)) {
      toast.error("Você precisa preencher todos os campos");
      return false;
    }*/

    if (data) {
      const partner = await apiRequest("/api/directus/partner", { partnerId: formData.id, data: formData }, "PATCH");
      if (partner) {
        toast.success("Seus dados foram atualizados");
      } else {
        toast.error("Erro ao atualizar os dados");
      }
    } else {
      const partner = await apiRequest("/api/directus/partner", formData, "POST");
      if (partner) {
        toast.success("Novo parceiro criado");
      } else {
        toast.error("Já existe um parceiro com esses dados");
      }
    }
  }

  return (
    <div className="container">
      <ToastContainer />
      <form onSubmit={createPartner}>
        <div>
          <label id="label-type">Pessoa fisica ou juridica?</label>
          <select className="form-control" id="type" name="type" value={formData.type} onChange={handleChange}>
            <option value={0}>Pessoa Física</option>
            <option value={1}>Pessoa Jurídica</option>
          </select>
        </div>
        {partnerType && (
          <div>
            <label htmlFor="first_name">Nome da Empresa:</label>
            <input className="form-control" type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />

            <label htmlFor="first_name">CNPJ:</label>
            <InputMask mask="99.999.999/9999-99" onChange={handleChange} placeholder="00.000.000/0000-00" typee="text" class="form-control" id="cnpj" name="cnpj" value={formData.cnpj}></InputMask>
          </div>
        )}

        <div>
          {!partnerType ? <label htmlFor="first_name">Nome:</label> : <label htmlFor="first_name">Nome do responsável:</label>}
          <input className="form-control" type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
        </div>
        <div>
          {!partnerType ? <label htmlFor="last_name">Sobrenome:</label> : <label htmlFor="last_name">Sobrenome do responsável:</label>}

          <input className="form-control" type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="first_name">CPF:</label>
          <InputMask mask="999.999.999-99" onChange={handleChange} placeholder="000.000.000-00" typee="text" class="form-control" id="cpf" name="cpf" value={formData.cpf}></InputMask>
        </div>
        <div>
          <label htmlFor="first_name">RG:</label>
          <input className="form-control" type="text" id="rg" name="rg" value={formData.rg} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="first_name">Orgão Emissor:</label>
          <input className="form-control" type="text" id="rg_emitter" name="rg_emitter" value={formData.rg_emitter} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="birthday">Data de Nascimento:</label>
          <InputMask mask="99/99/9999" onChange={handleChange} typee="text" class="form-control" id="birthday" name="birthday" value={formData.birthday}></InputMask>
        </div>
        <div>
          <label htmlFor="gender">Gênero:</label>
          <input className="form-control" type="text" id="gender" name="gender" value={formData.gender} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="nationality">Nationality:</label>
          <input className="form-control" type="text" id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="first_name">Estado Civil:</label>
          <input className="form-control" type="text" id="marital_status" name="marital_status" value={formData.marital_status} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input className="form-control" type="text" id="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label id="label-pass_account" htmlFor="email">
            Defina uma senha para a sua conta:
          </label>
          <input className="form-control" type="text" id="pass_account" name="pass_account" value={formData.pass_account} onChange={handleChange} />
        </div>
        <div>
          <label>Mobile Number:</label>
          <InputMask mask="(99) 99999-9999" onChange={handleChange} placeholder="(00) 00000-0000" type="text" class="form-control" id="mobile_number" name="mobile_number" value={formData.mobile_number}></InputMask>
        </div>
        <div>
          <label>Rua</label>
          <input className="form-control" type="text" id="street" name="street" value={formData.street} onChange={handleChange} />
        </div>
        <div>
          <label>Número</label>
          <input className="form-control" type="text" id="number_street" name="number_street" value={formData.number_street} onChange={handleChange} />
        </div>
        <div>
          <label>Bairro</label>
          <input className="form-control" type="text" id="neighborhood" name="neighborhood" value={formData.neighborhood} onChange={handleChange} />
        </div>
        <div>
          <label>Cidade</label>
          <input className="form-control" type="text" id="city" name="city" value={formData.city} onChange={handleChange} />
        </div>
        <div>
          <label>Estado</label>
          <input className="form-control" type="text" id="state" name="state" value={formData.state} onChange={handleChange} />
        </div>
        <div>
          <label>CEP</label>
          <input className="form-control" type="text" id="cep" name="cep" value={formData.cep} onChange={handleChange} />
        </div>

        <div>
          <label id="label-commission_value">Comissão</label>
          <input className="form-control" type="text" id="commission_value" name="commission_value" value={formData.commission_value} onChange={handleChange} />
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default PartnerForm;
