import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import './AnimatedBackground.css'; // Import the animated background CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { email, senha } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', formData);
      console.log(res.data);
      setMessage('Login bem-sucedido');
      // Redirecionar para outra página, como o dashboard, por exemplo
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setMessage('Erro ao fazer login. Verifique seus dados.');
    }
  };

  return (
    <>
      <div className="stars">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="star"></div>
        ))}
      </div>
      <div className="login-container">
        <div className="icon-container-login">
          <FontAwesomeIcon icon={faUser} className="icon" />
        </div>
        <form onSubmit={onSubmit} className="login-form">
          <h2 className="login-title">INICIAR SESSÃO</h2>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Endereço de e-mail"
            required
            className="login-input"
          />
          <input
            type="password"
            name="senha"
            value={senha}
            onChange={onChange}
            placeholder="Senha"
            required
            className="login-input"
          />
          <button type="submit" className="login-button">Entrar</button>
        </form>
        {message && <p className="success-message">{message}</p>}
      </div>
    </>
  );
};

export default Login;
