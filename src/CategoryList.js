import React from 'react';
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

const CategoryList = ({ categorias, onRemove }) => {
  const handleRemove = async (id) => {
    try {
      await fetch(`http://localhost:5000/categorias/${id}`, {
        method: 'DELETE',
      });
      onRemove(id);
    } catch (err) {
      console.error('Erro ao remover categoria:', err);
    }
  };

  return (
    <ul>
      {categorias.map((categoria) => (
        <li key={categoria.id}>
          <FontAwesomeIcon icon={iconOptions[categoria.icon]} />
          {categoria.nome} ({categoria.tipo})
          <button onClick={() => handleRemove(categoria.id)}>Remover</button>
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
