import React, { useState, useEffect } from "react";
import apiRequest from "../../modules/apiRequest";

function SelectProducts({ selectedProducts, userProducts }) {
  if (!userProducts) {
    userProducts = [];
  }

  const [productsData, setProductsData] = useState([]);
  const [selectedProductsUser, setSelectedProductsUser] = useState([]);
  const [productsUser, setProductsUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductsData, setSelectedProducts] = useState([]);

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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = productsData.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.cod.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container">
      <div className="table-body-scrollable">
        <input type="text" placeholder="Pesquisar produtos" value={searchQuery} onChange={handleSearchChange} />
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Produto</th>
              <th scope="col">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {filteredProducts.map((item, index) => (
                  <tr>
                    <input type="checkbox" value={item.cod} name={item.cod} id={"itemCheck-" + index} onClick={handleChangeProducts} /> {item.cod} - {item.name}
                    <input style={{ float: "right" }} type="number" name={"productValue-" + item.cod} onChange={handleChangeProducts} id={"productValue-" + index} min={1} max={10} />
                  </tr>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SelectProducts;
