import React from 'react';
import './AddTransactionModal.css';
import AddTransaction from './AddTransaction'; // Import AddTransaction component

const AddTransactionModal = ({ show, onClose, categorias, userId, onAdd, onCreateCategory }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="add-transaction-modal-overlay">
      <div className="add-transaction-modal-content">
        <button className="add-transaction-modal-close" onClick={onClose}>
          &times;
        </button>
        <AddTransaction
          categorias={categorias}
          userId={userId}
          onAdd={onAdd}
          onCreateCategory={onCreateCategory}
        />
      </div>
    </div>
  );
};

export default AddTransactionModal;
