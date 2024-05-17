import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import './AnimatedBackground.css'; // Import the animated background CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Import the faUser icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    telefone: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const { nome, email, senha, cpf, telefone } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/register', formData);
      console.log(res.data);
      setMessage('Registro concluído com sucesso!');
      
      setTimeout(() => {
        navigate('/login'); // Use navigate for redirection
      }, 1000); // Espera 2 segundos antes de redirecionar

    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setMessage('Erro ao registrar. Verifique seus dados.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/Login'); // Redirect to login page
  };

  return (
    <>
      <div className="stars">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="star"></div>
        ))}
      </div>
      <div className="register-container">
        <div className="icon-container-register">
          <FontAwesomeIcon icon={faUser} className="icon" />
        </div>
        <form onSubmit={onSubmit} className="register-form">
          <h2 className="register-title">CRIAR CONTA</h2>
          <input
            type="text"
            name="nome"
            value={nome}
            onChange={onChange}
            placeholder="Nome"
            required
            className="register-input"
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Endereço de e-mail"
            required
            className="register-input"
          />
          <input
            type="password"
            name="senha"
            value={senha}
            onChange={onChange}
            placeholder="Senha"
            required
            className="register-input"
          />
          <input
            type="text"
            name="cpf"
            value={cpf}
            onChange={onChange}
            placeholder="CPF"
            required
            className="register-input"
          />
          <input
            type="text"
            name="telefone"
            value={telefone}
            onChange={onChange}
            placeholder="Telefone"
            required
            className="register-input"
          />
          <button type="submit" className="register-button">Criar Conta</button>
          <h2 className="have-account">Ja tem uma conta?</h2>
          <button onClick={handleLoginRedirect} className="have-account-button">Entrar</button>
          {message && <p className="success-message">{message}</p>}
        </form>
      </div>
    </>
  );
};

export default Register;
