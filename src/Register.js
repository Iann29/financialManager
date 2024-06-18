import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faUser } from '@fortawesome/free-solid-svg-icons'; 
import { useNavigate } from 'react-router-dom';
import HTMLWrapper from './HTMLWrapper';

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    telefone: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const { nome, email, senha, cpf, telefone } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
  };

  const validateCPF = (cpf) => {
    const regex = /^\d{11}$/;
    return regex.test(cpf);
  };

  const onSubmit = async e => {
    e.preventDefault();

    if (!validatePassword(senha)) {
      setMessage('A senha deve ter no mínimo 8 dígitos e pelo menos uma letra maiúscula.');
      return;
    }

    if (!validateCPF(cpf)) {
      setMessage('O CPF deve ter exatamente 11 números.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/register', formData);
      console.log(res.data);
      setMessage('Registro concluído com sucesso!');
      
      setTimeout(() => {
        navigate('/login'); 
      }, 2000);

    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setMessage('Erro ao registrar. Verifique seus dados.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login'); 
  };

  return (
    <HTMLWrapper>
      <div className="register-page">
        <div className="illumination top-left"></div>
        <div className="illumination bottom-right"></div>
        <div className="page-container">
          <div className="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="61" viewBox="0 0 60 61" fill="none">
              <circle cx="30" cy="30.9854" r="30" fill="#26273B"/>
            </svg>
            <FontAwesomeIcon icon={faUser} className="icon" />
          </div>
          <div className="register-container">
            <div className="background-rectangle">
              <form onSubmit={onSubmit} className="register-form">
                <h2 className="register-title">CRIAR CONTA</h2>
                <div className="input-group" style={{ '--x': '-0px', '--y': '4px' }}>
                  <span className="input-icon nome"></span>
                  <input
                    type="text"
                    name="nome"
                    value={nome}
                    onChange={onChange}
                    placeholder="Nome"
                    required
                    className="register-input"
                  />
                </div>
                <div className="input-group" style={{ '--x': '-0px', '--y': '4px' }}>
                  <span className="input-icon email"></span>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="E-mail"
                    required
                    className="register-input"
                  />
                </div>
                <div className="input-group" style={{ '--x': '0px', '--y': '4px' }}>
                  <span className="input-icon senha"></span>
                  <input
                    type="password"
                    name="senha"
                    value={senha}
                    onChange={onChange}
                    placeholder="Senha"
                    required
                    className="register-input"
                  />
                </div>
                <div className="input-group" style={{ '--x': '0px', '--y': '4px' }}>
                  <span className="input-icon cpf"></span>
                  <input
                    type="text"
                    name="cpf"
                    value={cpf}
                    onChange={onChange}
                    placeholder="CPF"
                    required
                    className="register-input"
                  />
                </div>
                <div className="input-group" style={{ '--x': '0px', '--y': '4px' }}>
                  <span className="input-icon telefone"></span>
                  <input
                    type="text"
                    name="telefone"
                    value={telefone}
                    onChange={onChange}
                    placeholder="Telefone"
                    required
                    className="register-input"
                  />
                </div>
                <button type="submit" className="register-button">Criar conta</button>
              </form>
              <div className="have-account">
                Já possui uma conta? <button onClick={handleLoginRedirect} className="have-account-button">Entrar</button>
              </div>
            </div>
          </div>
          {message && <p className="success-message">{message}</p>}
        </div>
      </div>
    </HTMLWrapper>
  );
};

export default Register;
