import React from 'react';
import dinheiroIcon from './icon/dinheiro.png';
import belezaIcon from './icon/beleza.png';
// Importar outros ícones conforme necessário
import './TransactionList.css'; // Adicionando o CSS

const iconMap = {
  'dinheiro.png': dinheiroIcon,
  'beleza.png': belezaIcon,
  // Mapear outros ícones conforme necessário
};

const getCategoryClass = (categoriaNome) => {
  switch (categoriaNome) {
    case 'Transporte':
      return 'category-transporte';
    case 'Comida':
      return 'category-comida';
    case 'Hobby':
      return 'category-hobby';
    case 'Roupas':
      return 'category-roupas';
    case 'Beleza':
      return 'category-beleza';
    case 'Social':
      return 'category-social';
    case 'Salário':
      return 'category-salario';
    case 'Bônus':
      return 'category-bonus';
    case 'Investimentos':
      return 'category-investimentos';
    default:
      return 'category-default';
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
    return iconMap[icon] || './icon/default.png';
  };

  return (
    <div className="category-list">
      <ul>
        {categorias.map((categoria) => (
          <li key={categoria.id} className="category-item">
            <div className={`category-icon ${getCategoryClass(categoria.nome)}`}>
              <img src={getCategoriaIcone(categoria.icon)} alt="icon" />
            </div>
            {categoria.nome} ({categoria.tipo})
            <button onClick={() => handleRemove(categoria.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
