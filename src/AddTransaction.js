import React, { useState } from 'react';

const AddTransaction = ({ categorias, userId, onAdd }) => {
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
        // Resetar os campos do formulário
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
    <form onSubmit={handleSubmit}>
      <h2>Adicionar Lançamento</h2>
      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        required
      />
      <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
        <option value="Despesa">Despesa</option>
        <option value="Receita">Receita</option>
      </select>
      <input
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        required
      />
      <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nome}
          </option>
        ))}
      </select>
      <button type="submit">Adicionar</button>
    </form>
  );
};

export default AddTransaction;
