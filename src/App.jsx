import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dash from "./components/master/dash";
import Orders from "./components/master/orders";
import Partners from "./components/master/partners";
import Login from "./components/master/login";
import CreatePartner from './components/forms/partnerForm'

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/acolhimento" element={<Dash />} />
          <Route path="/pedidos" element={<Orders />} />
          <Route path="/parceiros/:code" element={<Partners />} />
          <Route path="/parceiros/cadastro" element={<CreatePartner />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
