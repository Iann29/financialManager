import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const { email, senha } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', formData);
      console.log(res.data);  // Adicione mais ações aqui, como redirecionamento ou armazenamento de token
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
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
  );
};

export default Login;
