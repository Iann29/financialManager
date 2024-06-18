import React, { useState } from 'react';
import './AddTransaction.css';

const AddTransaction = ({ categorias, userId, onAdd, onCreateCategory }) => {
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('Despesa');
  const [data, setData] = useState('');
  const [valor, setValor] = useState('');
  const [categoriaId, setCategoriaId] = useState(categorias.length > 0 ? categorias[0].id : '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novaTransacao = {
      descricao,
      tipo,
      data,
      valor,
      categoria_id: categoriaId,
      usuario_id: userId
    };

    try {
      const response = await fetch('http://localhost:5000/lancamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaTransacao)
      });

      if (response.ok) {
        const result = await response.json();
        onAdd(result);
        alert('Lançamento adicionado com sucesso');
        setDescricao('');
        setTipo('Despesa');
        setData('');
        setValor('');
        setCategoriaId(categorias.length > 0 ? categorias[0].id : '');
      } else {
        alert('Erro ao adicionar lançamento');
      }
    } catch (err) {
      console.error('Erro ao adicionar lançamento:', err);
      alert('Erro ao adicionar lançamento');
    }
  };

  return (
    <div className="add-transaction-container">
      <h2 className="add-transaction-title">CRIAR LANÇAMENTO</h2>
      <form onSubmit={handleSubmit} className="add-transaction-form">
        <div className="input-group">
          <span className="input-icon valor"></span>
          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
            className="add-transaction-input"
          />
        </div>
        <div className="input-group">
          <span className="input-icon descricao"></span>
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            className="add-transaction-input"
          />
        </div>
        <div className="input-group">
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
            className="add-transaction-select"
          >
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
          </select>
        </div>
        <div className="input-group">
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
            className="add-transaction-date"
          />
        </div>
        <div className="input-group">
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
            className="add-transaction-select"
          >
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="add-transaction-button">Adicionar Lançamento</button>
      </form>
      <button type="button" onClick={onCreateCategory} className="create-category-button">
        Criar Categoria
      </button>
    </div>
  );
};

export default AddTransaction;
