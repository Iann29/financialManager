import React from 'react';
import dinheiroIcon from './icon/dinheiro.png';
import belezaIcon from './icon/beleza.png';
// ... importar outros ícones conforme necessário

const iconMap = {
  'dinheiro.png': dinheiroIcon,
  'beleza.png': belezaIcon,
  // ... mapear outros ícones conforme necessário
};

const defaultIcon = './icon/default.png'; // Ícone padrão

const getCategoriaClass = (categoriaNome) => {
  switch (categoriaNome) {
    case 'Transporte':
      return 'categoria-transporte';
    case 'Comida':
      return 'categoria-comida';
    case 'Hobby':
      return 'categoria-hobby';
    case 'Roupas':
      return 'categoria-roupas';
    case 'Beleza':
      return 'categoria-beleza';
    case 'Social':
      return 'categoria-social';
    case 'Salário':
      return 'categoria-salario';
    case 'Bônus':
      return 'categoria-bonus';
    case 'Investimentos':
      return 'categoria-investimentos';
    default:
      return 'categoria-default';
  }
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

  const getCategoriaIcone = (icon) => {
    return iconMap[icon] || defaultIcon;
  };

  return (
    <ul>
      {categorias.map((categoria) => (
        <li key={categoria.id}>
          <span className={`transaction-category ${getCategoriaClass(categoria.nome)}`}>
            <img src={getCategoriaIcone(categoria.icon)} alt="icon" className="transaction-icon" />
          </span>
          {categoria.nome} ({categoria.tipo})
          <button onClick={() => handleRemove(categoria.id)}>Remover</button>
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
