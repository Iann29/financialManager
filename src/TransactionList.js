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
      return 'transaction-transporte';
    case 'Comida':
      return 'transaction-comida';
    case 'Hobby':
      return 'transaction-hobby';
    case 'Roupas':
      return 'transaction-roupas';
    case 'Beleza':
      return 'transaction-beleza';
    case 'Social':
      return 'transaction-social';
    case 'Salário':
      return 'transaction-salario';
    case 'Bônus':
      return 'transaction-bonus';
    case 'Investimentos':
      return 'transaction-investimentos';
    default:
      return 'transaction-default';
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
    <div className="transaction-list">
      <ul>
        {transacoes.map(transacao => (
          <li key={transacao.id} className="transaction-item">
            <div className={`transaction-icon ${getTransactionClass(getCategoriaNome(transacao.categoria_id))}`}>
              <img src={iconMap[getCategoriaIcone(transacao.categoria_id)] || defaultIcon} alt="icon" />
            </div>
            <div className="transaction-info">
              <span className="transaction-category">
                {getCategoriaNome(transacao.categoria_id)}
              </span>
              <span className="transaction-description">{transacao.descricao}</span>
              <span className="transaction-value-custom">{transacao.valor}</span>
              <button onClick={() => onRemove(transacao.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
