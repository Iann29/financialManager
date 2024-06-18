import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import HTMLWrapper from './HTMLWrapper';
import OTPModal from './OTPModal'; // Importe o componente do modal OTP

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const [message, setMessage] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpData, setOtpData] = useState({
    email: '',
    otp: ''
  });

  const navigate = useNavigate();
  const { login } = useAuth();  

  const { email, senha } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', formData);
      if (res.data.otpRequired) {
        setOtpData({ email: formData.email, otp: '' });
        setShowOTPModal(true);
      } else {
        setMessage('Login bem-sucedido');
        login(res.data); 
        navigate('/dashboard');  
      }
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setMessage('Erro ao fazer login. Verifique seus dados.');
    }
  };

  const handleOTPSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/verify-otp', otpData);
      if (res.data.success) {
        setMessage('Login bem-sucedido');
        login(res.data.user);
        navigate('/dashboard');
        setShowOTPModal(false);
      } else {
        setMessage('Código OTP incorreto');
      }
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setMessage('Erro ao verificar o código OTP.');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); 
  };

  return (
    <HTMLWrapper>
      <div className="login-page">
        <div className="illumination top-left"></div>
        <div className="illumination bottom-right"></div>
        <div className="page-container">
          <div className="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="61" viewBox="0 0 60 61" fill="none">
              <circle cx="30" cy="30.9854" r="30" fill="#26273B"/>
            </svg>
            <FontAwesomeIcon icon={faUser} className="icon" />
          </div>
          <div className="login-container">
            <div className="background-rectangle">
              <form onSubmit={onSubmit} className="login-form">
                <h2 className="login-title">INICIAR SESSÃO</h2>
                <div className="input-group" style={{ '--x': '-26px', '--y': '4px' }}>
                  <span className="input-icon email"></span>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="E-mail"
                    required
                    className="login-input"
                  />
                </div>
                <div className="input-group" style={{ '--x': '-26px', '--y': '4px' }}>
                  <span className="input-icon senha"></span>
                  <input
                    type="password"
                    name="senha"
                    value={senha}
                    onChange={onChange}
                    placeholder="Senha"
                    required
                    className="login-input"
                  />
                </div>
                <button type="submit" className="login-button">Entrar</button>
              </form>
              <div className="need-account">
                Não possui uma conta? <button onClick={handleRegisterRedirect} className="need-account-button">Registrar</button>
              </div>
            </div>
          </div>
          {message && <p className={`message ${message === 'Login bem-sucedido' ? 'success-message' : 'error-message'}`}>{message}</p>}
        </div>
      </div>
      {showOTPModal && (
        <OTPModal
          show={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          otpData={otpData}
          setOtpData={setOtpData}
          onSubmit={handleOTPSubmit}
        />
      )}
    </HTMLWrapper>
  );
};

export default Login;
