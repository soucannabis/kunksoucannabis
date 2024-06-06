import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/master/login';
import Orders from './components/master/orders';
import Partners from './components/master/partners';
import CreatePartner from './components/forms/partnerForm';
import Reception from './components/master/reception';
import ReceptionForm from './components/externalPages/receptionForm';
import Theme from './components/master/theme/theme';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/parceiros/login" element={<Login />} />
          <Route path="/acolhimento/*" element={<Theme />} />
          <Route path="/pedidos" element={<Orders />} />
          <Route path="/triagem" element={<Reception />} />
          <Route path="/parceiros/:code" element={<Partners />} />
          <Route path="/parceiros/cadastro" element={<CreatePartner />} />
          <Route path="/triagem/cadastro" element={<ReceptionForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
