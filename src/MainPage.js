import React from 'react';
import './MainPage.css'; 
import { Link } from 'react-router-dom';

function MainPage() {
  return (
    <div className="main-container">
      <Link to="/login">Login</Link>
      <Link to="/register">Registrar</Link>
      {}
    </div>
  );
}

export default MainPage;