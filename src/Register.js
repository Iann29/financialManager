import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    telefone: ''
  });

  const { nome, email, senha, cpf, telefone } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/register', formData);
      console.log(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="nome" value={nome} onChange={onChange} placeholder="Nome" required />
      <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
      <input type="password" name="senha" value={senha} onChange={onChange} placeholder="Senha" required />
      <input type="text" name="cpf" value={cpf} onChange={onChange} placeholder="CPF" required />
      <input type="text" name="telefone" value={telefone} onChange={onChange} placeholder="Telefone" required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
