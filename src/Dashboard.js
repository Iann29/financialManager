import React, { useState, useEffect, useCallback } from 'react';
import AddCategory from './AddCategory';
import CategoryList from './CategoryList';
import AddTransaction from './AddTransaction';
import TransactionList from './TransactionList';
import PieChartComponent from './PieChartComponent';
import { useAuth } from './AuthContext';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

const Dashboard = () => {
  const [categorias, setCategorias] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [saldoMensal, setSaldoMensal] = useState({ receita: 0, despesa: 0 });
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const fetchCategorias = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/categorias/${user.id}`);
      const result = await response.json();
      setCategorias(result);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
    }
  }, [user.id]);

  const fetchTransacoes = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/lancamentos/${user.id}`);
      const result = await response.json();
      setTransacoes(result);
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
    }
  }, [user.id]);

  const fetchSaldoMensal = useCallback(async () => {
    const mes = new Date().getMonth() + 1;
    const ano = new Date().getFullYear();
    try {
      const response = await fetch(`http://localhost:5000/saldo-mensal/${user.id}/${mes}/${ano}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      let receita = 0, despesa = 0;
      result.forEach(item => {
        if (item.tipo === 'Receita') receita = parseFloat(item.total);
        else if (item.tipo === 'Despesa') despesa = parseFloat(item.total);
      });
      setSaldoMensal({ receita, despesa });
    } catch (err) {
      console.error('Erro ao buscar saldo mensal:', err.message);
    }
  }, [user.id]);

  useEffect(() => {
    if (user.id) {
      fetchCategorias();
      fetchTransacoes();
      fetchSaldoMensal();
    }
  }, [user.id, fetchCategorias, fetchTransacoes, fetchSaldoMensal]);

  const handleAddCategory = (novaCategoria) => {
    setCategorias([...categorias, novaCategoria]);
  };

  const handleRemoveCategory = (id) => {
    setCategorias(categorias.filter((categoria) => categoria.id !== id));
  };

  const handleAddTransaction = (novaTransacao) => {
    setTransacoes([novaTransacao, ...transacoes]);
    fetchSaldoMensal();
  };

  const handleRemoveTransaction = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/lancamentos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTransacoes(transacoes.filter((transacao) => transacao.id !== id));
        fetchSaldoMensal();
      } else {
        alert('Erro ao excluir a transação');
      }
    } catch (err) {
      console.error('Erro ao excluir a transação:', err);
      alert('Erro ao excluir a transação');
    }
  };

  const { logout } = useAuth();

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir sua conta?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/usuarios/${user.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Conta excluída com sucesso');
          logout();
        } else {
          alert('Erro ao excluir a conta');
        }
      } catch (err) {
        console.error('Erro ao excluir a conta:', err);
        alert('Erro ao excluir a conta');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <button onClick={() => setShowModal(true)} className="add-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="111" height="112" viewBox="0  111 112" fill="none">
          <circle cx="55.5694" cy="55.9517" r="55.4297" fill="#FFA800" />
        </svg>
        <FontAwesomeIcon icon={faPlus} className="add-icon-mais" />
      </button>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <AddCategory onAdd={handleAddCategory} userId={user.id} />
        <AddTransaction onAdd={handleAddTransaction} categorias={categorias} userId={user.id} />
      </Modal>
      <div className="saldo-mensal">
        <h2>Saldo Mensal</h2>
        <p>{saldoMensal.despesa > saldoMensal.receita ? `Gastos: -${(saldoMensal.despesa - saldoMensal.receita).toFixed(2)}` : `Ganhos: ${(saldoMensal.receita - saldoMensal.despesa).toFixed(2)}`}</p>
      </div>
      <CategoryList categorias={categorias} onRemove={handleRemoveCategory} />
      <PieChartComponent transacoes={transacoes} categorias={categorias} />
      <TransactionList transacoes={transacoes} categorias={categorias} onRemove={handleRemoveTransaction} />
      <button onClick={handleDeleteAccount}>Excluir conta</button>
    </div>
  );
};

export default Dashboard;
