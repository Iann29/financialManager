import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const [message, setMessage] = useState('');

  const { email, senha } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', formData);
      console.log(res.data);  // Certifique-se de que a resposta contém 'data'
      setMessage('Login bem-sucedido');
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setMessage('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="senha"
          value={senha}
          onChange={onChange}
          placeholder="Senha"
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
