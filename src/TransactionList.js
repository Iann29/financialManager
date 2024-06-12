import React from 'react';
import dinheiroIcon from './icon/dinheiro.png';
import belezaIcon from './icon/beleza.png';
// Importar outros ícones conforme necessário
import './TransactionList.css'; // Adicione esta linha para importar o CSS

const iconMap = {
  'dinheiro.png': dinheiroIcon,
  'beleza.png': belezaIcon,
  // Mapear outros ícones conforme necessário
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
            <div className="transaction-details">
              <span className="transaction-date">{new Date(transacao.data).toLocaleDateString()}</span>
              <span className="transaction-type">{transacao.tipo}</span>
              <span className="transaction-value">{transacao.valor}</span>
              <button onClick={() => onRemove(transacao.id)}>Excluir</button>
            </div>
            <div className="transaction-info">
              <span className={`transaction-category ${getCategoriaClass(getCategoriaNome(transacao.categoria_id))}`}>
                <div className="transaction-icon">
                  <img src={iconMap[getCategoriaIcone(transacao.categoria_id)] || defaultIcon} alt="icon" />
                </div>
                {getCategoriaNome(transacao.categoria_id)}
              </span>
              <span className="transaction-description">{transacao.descricao}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
