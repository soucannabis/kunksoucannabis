import React, { useState } from 'react';
import InfoModal from "./modal"

const Table = ({ dataTable, headers, fields, updateTable }) => {

  return (
    <div className="container-fluid">     
      <table className="table">
        <thead>
          <tr>
            {headers.map((item) => (
              <th scope="row">{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataTable.map((item, index) => (            
            <tr key={index}>
              {fields.map((field) => (                
                <td><InfoModal field={item[field]} userData={item} updateTable={updateTable}/></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
