import React, { useEffect, useState } from "react";
import Table from "../table";
import apiRequest from "../../modules/apiRequest";

function Dash() {
  const [usersData, setUsersData] = useState([]);
  const [tableUpload, setTableUpload] = useState();

  useEffect(() => {
    async function usersData() {
      usersData = await apiRequest("/api/directus/all-users", "", "GET");
      setUsersData(usersData);
    }
    usersData();
  }, []);

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
        <Table dataTable={usersData} headers={["Nome", "E-mail", "Status"]} fields={["name_associate", "email_account", "status"]} updateTable={updateTable} />
      </div>
    </div>
  );
}

export default Dash;
