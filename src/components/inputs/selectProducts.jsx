import React, { useState, useEffect } from "react";
import apiRequest from "../../modules/apiRequest";

function SelectProducts({ selectedProducts, userProducts }) {
  if (!userProducts) {
    userProducts = [];
  }

  const [productsData, setProductsData] = useState([]);
  const [productsUser, setProductsUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function products() {
      const products = await apiRequest("/api/directus/products", "", "GET");
      setProductsData(products);
    }
    products();
  }, []);

  if (userProducts != [] && userProducts.length != 0) {
    var products = userProducts;

    if (typeof products == "string") {
      products = JSON.parse(userProducts);
    }

    products.forEach((product) => {
      const isProductInList = products.some((item) => item.product === product.product);
      if (isProductInList) {
        const checkProduct = document.getElementsByName(product.product);
        if (checkProduct[0] !== undefined) {
          checkProduct[0].checked = true;
          const inputQnt = document.getElementsByName("productValue-" + product.product);
          const inputSelected = document.getElementById("select-" + product.product);
          inputSelected.style.display = "inline";
          inputQnt[0].value = product.qnt;
        }
      }
    });
  }

  function handleChangeProducts(event) {
    var id = event.target.id;
    const name = event.target.name;

    id = id.split("-");
    id = parseInt(id[1]);

    const qntProduct = document.getElementById("productValue-" + id);
    const productCheck = document.getElementById("itemCheck-" + id);

    if (qntProduct.value == "") {
      qntProduct.value = 1;
    }

    if (!name.includes("productValue")) {
      if (event.target.checked) {
        setProductsUser((prevProducts) => [...prevProducts, { product: event.target.name, qnt: qntProduct.value }]);
      } else {
        setProductsUser((prevProducts) => prevProducts.filter((i) => i.product !== event.target.name));
      }
    } else {
      productCheck.click();
      if (event.target.checked) {
        productCheck.click();
      } else {
        productCheck.click();
      }
    }
  }

  if (typeof userProducts == "string") {
    userProducts = JSON.parse(userProducts);
    var arrayProducts = userProducts.concat(productsUser);
    selectedProducts(arrayProducts);
  } else {
    var arrayProducts = userProducts.concat(productsUser);
    selectedProducts(arrayProducts);
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  function unselectProduct(event) {
    var id = event.target.id;

    id = id.split("-");

    if (id.length < 3) {
      id = id[1];
    } else {
      id = id.slice(1).join("-");
    }

    const select = document.getElementsByName(id);
    select[0].checked = false;

    userProducts = userProducts.filter((item) => item.product !== id);
    userProducts = userProducts.filter((item, index, self) => {
      return index === self.findIndex((t) => t.product === item.product);
    });

    var arrayProducts = userProducts.concat(productsUser);
    selectedProducts(arrayProducts);
  }

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
                    <span className="deleteSelected" onClick={unselectProduct} id={"select-" + item.cod} style={{ color: "red", fontSize: "15px", fontWight: "bold", marginRight: "10px", cursor: "pointer" }}>
                      X
                    </span>
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
