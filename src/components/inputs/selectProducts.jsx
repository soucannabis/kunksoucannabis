import React, { useState, useEffect } from "react";
import apiRequest from "../../modules/apiRequest";
import { Accordion } from "react-bootstrap";
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
    if (productsUser != [] && productsUser.length != 0) {
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
      var products = productsUser.filter((item) => item.product !== name);
      userProducts = productsUser.filter((item, index, self) => {
        return index === self.findIndex((t) => t.product === item.product);
      });

      qntProduct.value = null;

      setProductsUser(products);
    }
  }

  if (typeof userProducts == "string") {
    userProducts = JSON.parse(userProducts);
    var arrayProducts = productsUser.concat(selectedProductsUser);
    selectedProducts(arrayProducts);
  } else {
    var arrayProducts = productsUser.concat(selectedProductsUser);
    selectedProducts(arrayProducts);
  }

  const filteredProducts = productsData.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.cod.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container">
      <div class="row">
        <div class="col-md-6">
          <Accordion defaultActiveKey="0">
            {productCategories
            .filter((element, index) => index < 5)
            .map((item, i) => (
              <Accordion.Item eventKey={i}>
                <Accordion.Header>
                  <div style={{ backgroundColor: item.rgb, padding: "5px 30px", marginRight: "10px", border: "1px solid " + item.rgb || "1px solid #000", color: item.rgb && "#fff" }}>{item.color}</div>
                  {filteredProducts.filter((obj) => obj.cod && obj.cod.startsWith(item.cod)).length}
                </Accordion.Header>
                <Accordion.Body>
                  {filteredProducts
                    .filter((obj) => obj.cod && obj.cod.startsWith(item.cod))
                    .map((item, index) => (
                      <tr key={index}>
                        <td>
                          <input type="checkbox" value={item.cod} name={item.cod} id={"itemCheck-" + index} onClick={handleChangeProducts} />
                          {item.cod} - {item.name}
                        </td>
                        <td>
                          <input style={{ float: "right" }} type="number" name={"productValue-" + item.cod} onChange={handleChangeProducts} id={"productValue-" + index} min={1} max={10} />
                        </td>
                      </tr>
                    ))}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>

        <div class="col-md-6">
          <Accordion defaultActiveKey="0">
            {productCategories
            .filter((element, index) => index >= 5)
            .map((item, i) => (
              <Accordion.Item eventKey={i}>
                <Accordion.Header>
                  <div style={{ backgroundColor: item.rgb, padding: "5px 30px", marginRight: "10px", border: "1px solid " + item.rgb || "1px solid #000", color: item.rgb && "#fff" }}>{item.color}</div>
                  {filteredProducts.filter((obj) => obj.cod && obj.cod.startsWith(item.cod)).length}
                </Accordion.Header>
                <Accordion.Body>
                  {filteredProducts
                    .filter((obj) => obj.cod && obj.cod.startsWith(item.cod))
                    .map((item, index) => (
                      <tr key={index}>
                        <td>
                          <input type="checkbox" value={item.cod} name={item.cod} id={"itemCheck-" + index} onClick={handleChangeProducts} />
                          {item.cod} - {item.name}
                        </td>
                        <td>
                          <input style={{ float: "right" }} type="number" name={"productValue-" + item.cod} onChange={handleChangeProducts} id={"productValue-" + index} min={1} max={10} />
                        </td>
                      </tr>
                    ))}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default SelectProducts;
