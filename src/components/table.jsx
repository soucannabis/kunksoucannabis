import React, { useState, useEffect } from "react";
import ModalUser from "./modals/UserModal";

const Table = ({ dataTable, headers, fields, updateTable, OrderModal, TrackingCodeModal }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = dataTable.filter((item) => {
    return fields.some((field) => {
      const value = item[field].toString().toLowerCase();
      return value.includes(searchTerm.toLowerCase());
    });
  });

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
                  <ModalUser field={item} data={item} handleCloseModal={handleCloseModal} handleShowModal={handleShowModal} updateTable={updateTable} showModal={showModal} />
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
