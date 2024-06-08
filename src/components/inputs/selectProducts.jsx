import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, TextField, Box, Typography } from "@mui/material";
import apiRequest from "../../modules/apiRequest";
import Input from "@mui/joy/Input";
import SearchIcon from "@mui/icons-material/Search";
function SelectProducts({ selectedProducts, userProducts }) {
  if (!userProducts) {
    userProducts = [];
  }

  const [productsData, setProductsData] = useState([]);
  const [selectedProductsUser, setSelectedProductsUser] = useState([]);
  const [productsUser, setProductsUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductsData, setSelectedProducts] = useState([]);
  const [productCategories, setProductsCategories] = useState([
    { cod: "A", color: "Azul", rgb: "blue" },
    { cod: "B", color: "Branco", rgb: "" },
    { cod: "L", color: "Lilás", rgb: "#B666D2" },
    { cod: "I", color: "Laranja", rgb: "orange" },
    { cod: "E", color: "Extrato", rgb: "brown" },
    { cod: "F", color: "Fórmula Base", rgb: "gray" },
    { cod: "LUB", color: "Lubrificante", rgb: "green" },
    { cod: "P", color: "Pomada", rgb: "#76317b" },
    { cod: "S", color: "Spray", rgb: "#9d4929" },
  ]);

  useEffect(() => {
    async function products() {
      const products = await apiRequest("/api/directus/products", "", "GET");
      setProductsData(products);
      setSelectedProducts(selectedProducts);
    }
    products();

    if (typeof userProducts == "string") {
      setProductsUser(JSON.parse(userProducts));
    } else {
      setProductsUser(userProducts);
    }
  }, []);

  useEffect(() => {
    if (productsUser.length !== 0) {
      var products = productsUser;

      if (typeof products == "string") {
        products = JSON.parse(productsUser);
      }

      products.forEach((product) => {
        const isProductInList = products.some((item) => item.product === product.product);
        if (isProductInList) {
          const checkProduct = document.getElementsByName(product.product);
          if (checkProduct[0] !== undefined) {
            checkProduct[0].checked = true;
            const inputQnt = document.getElementsByName("productValue-" + product.product);
            inputQnt[0].value = product.qnt;
          }
        }
      });
    }
  }, [selectedProductsData]);

  function handleChangeProducts(event) {
    var id = event.target.id;
    var name = event.target.name;

    id = id.split("-");
    id = parseInt(id[1]);

    const qntProduct = document.getElementById("productValue-" + id);
    const productCheck = document.getElementById("itemCheck-" + id);

    if (qntProduct.value == "") {
      qntProduct.value = 1;
    }

    if (event.target.checked || name.includes("productValue")) {
      if (name.includes("productValue")) {
        name = name.split("productValue-");
        name = name[1];
      }

      setSelectedProductsUser((prevProducts) => {
        const existingProductIndex = prevProducts.findIndex((item) => item.product === name);

        if (existingProductIndex !== -1) {
          const updatedProducts = [...prevProducts];
          updatedProducts[existingProductIndex].qnt = qntProduct.value;
          return updatedProducts;
        } else {
          return [...prevProducts, { product: name, qnt: qntProduct.value }];
        }
      });
    } else {
      var products = selectedProductsUser.filter((item) => item.product !== name);
      userProducts = productsUser.filter((item, index, self) => {
        return index === self.findIndex((t) => t.product === name);
      });

      qntProduct.value = null;
      setProductsUser(userProducts);
      setSelectedProductsUser(products);
    }
  }

  useEffect(() => {
    selectedProducts(productsUser.concat(selectedProductsUser));
  }, [selectedProductsUser]);

  const filteredProducts = productsData.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.cod.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
        Selecione os Produtos
      </Typography>
      <Input type="text" placeholder="Pesquisar..." label="Pesquisar Produtos" variant="outlined" fullWidth margin="normal" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} startDecorator={<SearchIcon />} sx={{ marginBottom: "16px" }} />

      <Table
        aria-labelledby="tableTitle"
        stickyHeader
        sx={{
          "--TableCell-headBackground": "var(--joy-palette-background-level1)",
          "--Table-headerUnderlineThickness": "1px",
          "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
          "--TableCell-paddingY": "4px",
          "--TableCell-paddingX": "8px",
          padding: "0 120px",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Produtos</TableCell>
            <TableCell>Quantidade</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProducts.map((product, index) => (
            <TableRow key={index}>
              <TableCell size="small">
                <input type="checkbox" size="medium" value={product.cod} name={product.cod} id={"itemCheck-" + index} onClick={handleChangeProducts} />
                <span style={{fontSize:"18px"}}>
                  {product.cod} - {product.name}
                </span>
              </TableCell>
              <TableCell size="small">
                <TextField size="small" type="number" name={"productValue-" + product.cod} onChange={handleChangeProducts} id={"productValue-" + index} inputProps={{ min: 1, max: 10 }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default SelectProducts;
