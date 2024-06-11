import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faUtensils, faGamepad, faTshirt, faSpa, faUsers, faMoneyBillWave, faGift, faChartLine } from '@fortawesome/free-solid-svg-icons';

const iconMap = {
  car: faCar,
  utensils: faUtensils,
  gamepad: faGamepad,
  tshirt: faTshirt,
  spa: faSpa,
  users: faUsers,
  'money-bill-wave': faMoneyBillWave,
  gift: faGift,
  'chart-line': faChartLine
};

const TransactionList = ({ transacoes, categorias, onRemove }) => {
  const getCategoriaNome = (categoriaId) => {
    const categoria = categorias.find(cat => cat.id === categoriaId);
    return categoria ? categoria.nome : 'Desconhecido';
  };

  const getCategoriaIcone = (categoriaId) => {
    const categoria = categorias.find(cat => cat.id === categoriaId);
    return categoria ? categoria.icon : 'unknown';
  };

  return (
    <div>
      <h2>Transações</h2>
      <ul>
        {transacoes.map(transacao => (
          <li key={transacao.id}>
            <div>
              <span>{new Date(transacao.data).toLocaleDateString()}</span>
              <span>{transacao.tipo}</span>
              <span>{transacao.valor}</span>
              <button onClick={() => onRemove(transacao.id)}>Excluir</button>
            </div>
            <div>
              <span>{getCategoriaNome(transacao.categoria_id)} <FontAwesomeIcon icon={iconMap[getCategoriaIcone(transacao.categoria_id)]} /></span> {/* Adicionando o ícone da categoria */}
              <span>{transacao.descricao}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
