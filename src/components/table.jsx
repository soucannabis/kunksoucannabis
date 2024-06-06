import React, { useState, useEffect } from "react";
import ModalUser from "./modals/UserModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "../modules/apiRequest";

import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Checkbox from "@mui/joy/Checkbox";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import Tooltip from "@mui/joy/Tooltip";
import { TableCell, styled } from '@mui/material';
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AwaitingData from "@mui/icons-material/PendingActions";
import EditNote from "@mui/icons-material/EditNote";
import Verified from "@mui/icons-material/Verified";
import BlockIcon from "@mui/icons-material/Block";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

const TableData = ({ data, headers, fields, updateTable, OrderModal, TrackingCodeModal }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  useEffect(() => {
    if (data.length > 1) {
      const formattedData = data.map((item) => {
        return {
          ...item,
          mobile_number: formatPhoneNumber(item.mobile_number),
        };
      });
      setDataTable(formattedData);
    } else {
      const formattedData = data[0].usersData.map((item) => {
        return {
          ...item,
          mobile_number: formatPhoneNumber(item.mobile_number),
        };
      });
      setDataTable(formattedData);
      setPatientsData(data[0].patientsData);
    }
  }, [data]);

  const StyledTableCell = styled(TableCell)({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    maxWidth: '200px'
  });

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const getStatusIcon = (status) => {
    const icons = {
      "Ainda não preencheu os dados": <AwaitingData />,
      "Apenas preencheu os dados": <EditNote />,
      Associado: <Verified />,
      "Problema ao preencher os dados": <BlockIcon />,
    };
    return icons[status] || null;
  };

  const getStatus = (status) => {
    const colors = {
      "Ainda não preencheu os dados": {color:"primary", message:"Colocou o e-mail de cadastro mas não preencheu seus dados pessoais."},
      "Apenas preencheu os dados": {color:"primary", message:"Preencheu seus dados mas não seguiu com o cadastro"},
      "Associado": {color:"success", message:"Se tornou associado"},
      "Problema ao preencher os dados": {color:"danger", message:"Houve algum campo que a pessoa não preencheu."}
    };
    return colors[status] || "default";
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    const cleaned = phoneNumber.toString().replace(/\D/g, ""); // Remove non-numeric characters
    const match = cleaned.match(/^55(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  const filteredData = dataTable.filter((item) => {
    return fields.some((field) => {
      const value = item[field] ? item[field].toString().toLowerCase() : "";
      return value.includes(searchTerm.toLowerCase());
    });
  });

  const sortedData = filteredData.sort((a, b) => {
    if (sortConfig !== null) {
      const { key, direction } = sortConfig;
      const aValue = a[key] ? a[key].toString().toLowerCase() : "";
      const bValue = b[key] ? b[key].toString().toLowerCase() : "";
      if (aValue < bValue) {
        return direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Texto copiado para a área de transferência!");
      })
      .catch(() => {
        toast.error("Falha ao copiar o texto.");
      });
  };

  async function validateShop(e) {
    const user = dataTable.find((user) => user.id == e.target.id);

    if (!user.products || user.products == "[]") {
      toast.error("Associado sem produtos habilitados");
    }

    if (!user.date_prescription || user.date_prescription == "") {
      toast.error("A prescrição do associado não contém nenhuma data de validade");
    }

    if (user.date_prescription && user.date_prescription != "" && user.products && user.products != "[]") {
      toast.success("Associado habilitado para a loja");
      document.getElementById(user.id).style.color = "green";
      await apiRequest("/api/directus/update", { userId: user.id, formData: { associate_status: 10 } }, "POST");
    }
  }

  return (
    <div className="container-fluid">
      <Input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={handleSearch} startDecorator={<SearchIcon />} sx={{ marginBottom: "16px" }} />

      <Table
        aria-labelledby="tableTitle"
        stickyHeader
        hoverRow
        sx={{
          "--TableCell-headBackground": "var(--joy-palette-background-level1)",
          "--Table-headerUnderlineThickness": "1px",
          "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
          "--TableCell-paddingY": "4px",
          "--TableCell-paddingX": "8px",
        }}
      >
        <thead>
          <tr>
            <th style={{ width: "40px" }}></th>
            {headers.map((item, index) => (
              <th key={index} scope="row" onClick={() => requestSort(fields[index])} style={{ cursor: "pointer" }}>
                {item}
                {sortConfig && sortConfig.key === fields[index] ? (sortConfig.direction === "ascending" ? " 🔼" : " 🔽") : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={index}>
              {OrderModal ? (
                <td>
                  <OrderModal handleCloseModal={handleCloseModal} handleShowModal={handleShowModal} data={item} updateTable={updateTable} />
                  <TrackingCodeModal handleCloseModal={handleCloseModal} handleShowModal={handleShowModal} data={item} updateTable={updateTable} />
                </td>
              ) : (
                <td>
                  {item.associate_status >= 4 && (
                    <a id={item.id} style={{ cursor: "pointer" }} onClick={validateShop}>
                      <svg id={item.id} color={item.date_prescription && item.date_prescription !== "" && item.products && item.products !== "[]" && item.associate_status !== 10 ? "blue" : item.associate_status === 10 ? "green" : "red"} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-check" viewBox="0 0 16 16">
                        <path id={item.id} fillRule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                        <path id={item.id} d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                      </svg>
                    </a>
                  )}
                  <ModalUser field={item} data={item} handleCloseModal={handleCloseModal} patientsData={patientsData} handleShowModal={handleShowModal} updateTable={updateTable} showModal={showModal} />
                </td>
              )}
              {fields.map((field, idx) => (
                <td key={idx} onClick={() => handleCopy(item[field])} style={{ cursor: "copy" }}>
                  {typeof item[field] === "string" && item[field].includes("[{") ? (
                    JSON.parse(item[field]).map((subItem) => <div key={subItem.cod}>{subItem.description}</div>)
                  ) : (
                    <Typography variant="body1" gutterBottom>
                      {field == "status" ? (
                        <Tooltip title={getStatus(item[field]).message} size="sm">
                          <Chip
                            key={`${item.id}-${field}`}
                            variant="soft"
                            size="sm"
                            startDecorator={getStatusIcon(item[field])}
                            color={getStatus(item[field]).color}
                          >
                            {item[field]}
                          </Chip>
                        </Tooltip>
                      ) : (
                        <StyledTableCell>{item[field]}</StyledTableCell>
                        
                      )}
                    </Typography>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <ToastContainer />
    </div>
  );
};

export default TableData;
