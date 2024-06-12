import React, { useState } from 'react';
import dinheiroIcon from './icon/dinheiro.png';
import belezaIcon from './icon/beleza.png';
import transporteIcon from './icon/transporte.png';
import comidaiIcon from './icon/comidai.png';
import './TransactionList.css';

const iconMap = {
  'dinheiro.png': dinheiroIcon,
  'beleza.png': belezaIcon,
  'transporte.png': transporteIcon,
  'comidai.png': comidaiIcon,
};

const defaultIcon = './icon/default.png';

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
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const getCategoriaNome = (categoriaId) => {
    const categoria = categorias.find(cat => cat.id === categoriaId);
    return categoria ? categoria.nome : 'Desconhecido';
  };

  const getCategoriaIcone = (categoriaId) => {
    const categoria = categorias.find(cat => cat.id === categoriaId);
    return categoria ? categoria.icon : 'unknown.png';
  };

  const handleItemClick = (transacao) => {
    setSelectedTransaction(transacao);
  };

  const handleModalClose = () => {
    setSelectedTransaction(null);
  };

  const handleConfirmDelete = () => {
    onRemove(selectedTransaction.id);
    handleModalClose();
  };

  return (
    <div className="custom-transaction-list">
      <ul>
        {transacoes.map(transacao => (
          <li
            key={transacao.id}
            className="custom-transaction-item"
            onClick={() => handleItemClick(transacao)}
          >
            <div className={`custom-transaction-icon ${getTransactionClass(getCategoriaNome(transacao.categoria_id))}`}>
              <img src={iconMap[getCategoriaIcone(transacao.categoria_id)] || defaultIcon} alt="icon" />
            </div>
            <div className="custom-transaction-info">
              <div className="custom-transaction-details">
                <span className="custom-transaction-category">
                  {getCategoriaNome(transacao.categoria_id)}
                </span>
                <span className="custom-transaction-description">{transacao.descricao}</span>
              </div>
              <div className="custom-transaction-value-container">
                <span className="custom-transaction-value">{transacao.valor}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {selectedTransaction && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>Você tem certeza que deseja excluir esta transação?</p>
            <button onClick={handleConfirmDelete}>Confirmar</button>
            <button onClick={handleModalClose}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
