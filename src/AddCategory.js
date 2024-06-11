import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faUtensils, faGamepad, faTshirt, faSpa, faUsers, faMoneyBillWave, faGift, faChartLine } from '@fortawesome/free-solid-svg-icons';

const iconOptions = {
    'car': faCar,
    'utensils': faUtensils,
    'gamepad': faGamepad,
    'tshirt': faTshirt,
    'spa': faSpa,
    'users': faUsers,
    'money-bill-wave': faMoneyBillWave,
    'gift': faGift,
    'chart-line': faChartLine,
};

const AddCategory = ({ onAdd, userId }) => {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('Despesa');
  const [icon, setIcon] = useState('car');

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
      setTipo('Despesa'); // Reset tipo selection
      setIcon('car'); // Reset icon selection
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
      <select value={icon} onChange={(e) => setIcon(e.target.value)}>
        {Object.keys(iconOptions).map(key => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>
      <button type="submit">Adicionar Categoria</button>
    </form>
  );
};

export default AddCategory;
