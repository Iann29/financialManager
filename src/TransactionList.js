import React from 'react';
import dinheiroIcon from './icon/dinheiro.png';
import belezaIcon from './icon/beleza.png';
// Importar outros ícones conforme necessário
import './TransactionList.css';

const iconMap = {
  'dinheiro.png': dinheiroIcon,
  'beleza.png': belezaIcon,
  // Mapear outros ícones conforme necessário
};

const defaultIcon = './icon/default.png'; // Ícone padrão

const getTransactionClass = (categoriaNome) => {
  switch (categoriaNome) {
    case 'Transporte':
      return 'custom-transaction-transporte';
    case 'Comida':
      return 'custom-transaction-comida';
    case 'Hobby':
      return 'custom-transaction-hobby';
    case 'Roupas':
      return 'custom-transaction-roupas';
    case 'Beleza':
      return 'custom-transaction-beleza';
    case 'Social':
      return 'custom-transaction-social';
    case 'Salário':
      return 'custom-transaction-salario';
    case 'Bônus':
      return 'custom-transaction-bonus';
    case 'Investimentos':
      return 'custom-transaction-investimentos';
    default:
      return 'custom-transaction-default';
  }
};

const TransactionList = ({ transacoes, categorias, onRemove }) => {
  const getCategoriaNome = (categoriaId) => {
    const categoria = categorias.find(cat => cat.id === categoriaId);
    return categoria ? categoria.nome : 'Desconhecido';
  };

  const getCategoriaIcone = (categoriaId) => {
    const categoria = categorias.find(cat => cat.id === categoriaId);
    return categoria ? categoria.icon : 'unknown.png';
  };

  return (
    <div className="custom-transaction-list">
      <ul>
        {transacoes.map(transacao => (
          <li key={transacao.id} className="custom-transaction-item">
            <div className={`custom-transaction-icon ${getTransactionClass(getCategoriaNome(transacao.categoria_id))}`}>
              <img src={iconMap[getCategoriaIcone(transacao.categoria_id)] || defaultIcon} alt="icon" />
            </div>
            <div className="custom-transaction-info">
              <span className="custom-transaction-category">
                {getCategoriaNome(transacao.categoria_id)}
              </span>
              <span className="custom-transaction-description">{transacao.descricao}</span>
              <span className="custom-transaction-value">{transacao.valor}</span>
              <button className="custom-transaction-remove-button" onClick={() => onRemove(transacao.id)}>X</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
