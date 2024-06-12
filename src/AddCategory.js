import React, { useState } from 'react';

const AddCategory = ({ onAdd, userId }) => {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('Despesa');
  const [icon, setIcon] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/categorias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, tipo, icon, user_id: userId }),
      });
      const result = await response.json();
      onAdd(result);
      setNome('');
      setTipo('Despesa');
      setIcon('');
    } catch (err) {
      console.error('Erro ao adicionar categoria:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome da Categoria"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="Despesa">Despesa</option>
        <option value="Receita">Receita</option>
      </select>
      <input
        type="text"
        placeholder="Nome do ícone (ex: dinheiro.png)"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
        required
      />
      <button type="submit">Adicionar Categoria</button>
    </form>
  );
};

export default AddCategory;
