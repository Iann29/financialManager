import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const offsetX = 0; // Deslocamento em pixels no eixo X
    const offsetY = 0; // Deslocamento em pixels no eixo Y
    const x = cx + (radius + offsetX) * Math.cos(-midAngle * RADIAN);
    const y = cy + (radius + offsetY) * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${data[index].name}: ${data[index].value}`}
      </text>
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={150}
            innerRadius={75} // Adicionando o innerRadius para criar um gráfico de rosca
            fill="#8884d8"
            dataKey="value"
            onClick={toggleType} // Aplicando o onClick no Pie
            animationDuration={300} // Definindo a duração da animação para 300ms
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        color: 'white',
        fontSize: '20px',
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        {showDespesas ? 'Despesas' : 'Receitas'}
      </div>
    </div>
  );
};

export default PieChartComponent;
