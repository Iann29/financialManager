import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

const PieChartComponent = ({ transacoes, categorias }) => {
  const [showDespesas, setShowDespesas] = useState(true);

  useEffect(() => {
    console.log('Transações:', transacoes);
    console.log('Categorias:', categorias);
  }, [transacoes, categorias]);

  const data = categorias.map(categoria => {
    const total = transacoes
      .filter(transacao => transacao.categoria_id === categoria.id && transacao.tipo === (showDespesas ? 'Despesa' : 'Receita'))
      .reduce((sum, transacao) => sum + parseFloat(transacao.valor), 0);
    return { name: categoria.nome, value: total };
  }).filter(entry => entry.value > 0); // Remove categorias sem transações

  const toggleType = () => setShowDespesas(!showDespesas);

  return (
    <div onClick={toggleType}>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        {showDespesas ? 'Despesas' : 'Receitas'}
      </div>
    </div>
  );
};

export default PieChartComponent;
