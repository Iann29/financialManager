import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard'; // Exemplo de outra página para redirecionar após login

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Exemplo de outra rota */}
        <Route path="/" element={<Register />} /> {/* Redirecionar para Register por padrão */}
      </Routes>
    </Router>
  );
};

export default App;
