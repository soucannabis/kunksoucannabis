import React, { useState, useEffect } from "react";
import ModalUser from "./modals/UserModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "../modules/apiRequest";

const Table = ({ data, headers, fields, updateTable, OrderModal, TrackingCodeModal }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  useEffect(() => {
    if(data.length > 1){
      setDataTable(data)
    }else{
      setDataTable(data[0].usersData)
      setPatientsData(data[0].patientsData)
    }
  }, [data]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = dataTable.filter((item) => {
    return fields.some((field) => {
      const value = item[field].toString().toLowerCase();
      return value.includes(searchTerm.toLowerCase());
    });
  });

  async function validateShop(e) {
    const user = dataTable.find((user) => user.id == e.target.id);

    if (!user.products || user.products == "[]") {
      toast.error("Associado sem produtos habilitados");
    }

    if (!user.date_prescription || user.date_prescription == "") {
      toast.error("A prescriçãoo do associado não contém nenhuma data de validade");
    }

    if (user.date_prescription && user.date_prescription != "" && user.products && user.products != "[]") {
      toast.success("Associado habilitado para a loja");
      document.getElementById(user.id).style.color = "green";
      await apiRequest("/api/directus/update", { userId: user.id, formData: { associate_status: 10 } }, "POST");
    }
  }

  return (
    <div className="container-fluid">
      <input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={handleSearch} />
      <table className="table">
        <thead>
          <tr>
            {headers.map((item, index) => (
              <th key={index} scope="row">
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              {OrderModal ? (
                <div>
                  <OrderModal handleCloseModal={handleCloseModal} handleShowModal={handleShowModal} data={item} updateTable={updateTable} />
                  <TrackingCodeModal handleCloseModal={handleCloseModal} handleShowModal={handleShowModal} data={item} updateTable={updateTable} />
                </div>
              ) : (
                <div>
                  {item.associate_status >= 4 && (
                    <div>
                      <a id={item.id} style={{ cursor: "pointer" }} onClick={validateShop}>
                        <svg id={item.id} color={item.date_prescription && item.date_prescription !== "" && item.products && item.products !== "[]" && item.associate_status !== 10 ? "blue" : item.associate_status === 10 ? "green" : "red"} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag-check" viewBox="0 0 16 16">
                          <path id={item.id} fill-rule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                          <path id={item.id} d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                        </svg>
                      </a>
                    </div>
                  )}
                  <ModalUser field={item} data={item} handleCloseModal={handleCloseModal} patientsData={patientsData} handleShowModal={handleShowModal} updateTable={updateTable} showModal={showModal} />
                </div>
              )}

              {fields.map((field, idx) => (
                <td>
                  <td>
                    {typeof item[field] === "string" && item[field].includes("[{") ? (
                      JSON.parse(item[field]).map((item) => (
                        <div key={item.cod}>
                          {item.description} x{item.quantity}
                        </div>
                      ))
                    ) : (
                      <p>{item[field]}</p>
                    )}
                  </td>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
