import React from 'react';
import dinheiroIcon from './icon/dinheiro.png';
import belezaIcon from './icon/beleza.png';
import transporteIcon from './icon/transporte.png';
import comidaiIcon from './icon/comidai.png';
import hobbyIcon from './icon/hobby.png';
import roupasIcon from './icon/roupas.png';
import socialIcon from './icon/social.png';
import bonusIcon from './icon/bonus.png';
import investimentoIcon from './icon/investimento.png';
import './CategoryList.css'; 

const iconMap = {
  'dinheiro.png': dinheiroIcon,
  'beleza.png': belezaIcon,
  'transporte.png': transporteIcon,
  'comidai.png': comidaiIcon,
  'hobby.png': hobbyIcon,
  'roupas.png': roupasIcon,
  'social.png': socialIcon,
  'bonus.png': bonusIcon,
  'investimento.png': investimentoIcon,
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
            {categoria.nome}
            <button onClick={() => handleRemove(categoria.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
