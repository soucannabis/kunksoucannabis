import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "../../modules/apiRequest";

function Dash() {
  const [loginData, setLoginData] = useState({
    email: null,
    pass: null,
  });
  const [loginSucess, setLoginSucess] = useState(false);
  const [loginErrorPass, setLoginErrorPass] = useState(false);
  const [loginEmailError, setLoginEmailError] = useState(false);
  const [logged, setLogged] = useState(false);

  function decrypt(decrypt, secretKey) {
    const bytes = CryptoJS.AES.decrypt(decrypt, secretKey);
    decrypt = bytes.toString(CryptoJS.enc.Utf8);
    return decrypt;
  }

  const formHandleChange = (event) => {
    const { id, value } = event.target;
    setLoginData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const userLogin = async (event) => {
    event.preventDefault();

    if (!loginData.email || !loginData.pass) {
      toast.error("Preencha todos os dados de login");
    } else {
      var response = await apiRequest("/api/directus/login", { email: loginData.email, pass: loginData.pass }, "POST");

      if (response.pass_account) {
        var userPass = decrypt(response.pass_account, import.meta.env.VITE_APP_PASS_ENCRYPT);

      } else {
        toast.error("Login Pass Acoount");
        setLogged(false);
        userPass = "";
      }

      if (!response) {
        toast.error("Sem Resposta");
        setLogged(false);
      } else {

        if (userPass == loginData.pass) {
          localStorage.setItem("user_code", await response.user_code);
          setLogged(true);
          toast.success("Login");
          window.location.assign("/parceiros/"+response.user_code)
        } else {
          toast.error("Login");
        }
      }
    }
  };


  return (
    <div style={{ padding: "50px 400px" }}>
      <ToastContainer />
      <form class="form-signin" onSubmit={userLogin}>
        <div class="text-center mb-4">
          <h1 class="h3 mb-3 font-weight-normal">Floating labels</h1>
          <p>
            Build form controls with floating labels via the <code>:placeholder-shown</code> pseudo-element. <a href="https://caniuse.com/#feat=css-placeholder-shown">Works in latest Chrome, Safari, and Firefox.</a>
          </p>
        </div>

        <div class="form-label-group">
          <input type="email" id="email" onChange={formHandleChange} class="form-control" placeholder="Email address" required="" autofocus="" />
        </div>

        <div class="form-label-group">
          <input type="password" id="pass" onChange={formHandleChange} class="form-control" placeholder="Password" required="" />
        </div>

        <div class="checkbox mb-3"></div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
}

export default Dash;
