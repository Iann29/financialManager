import React, { useState, useEffect } from 'react';
import AddCategory from './AddCategory';
import CategoryList from './CategoryList';
import AddTransaction from './AddTransaction';
import TransactionList from './TransactionList';
import PieChartComponent from './PieChartComponent'; // Importando o componente do gráfico
import { useAuth } from './AuthContext';
import Modal from './Modal';
import styles from './Dashboard.module.css'; // Importando o arquivo CSS module

const Dashboard = () => {
  const [categorias, setCategorias] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`http://localhost:5000/categorias/${user.id}`);
        const result = await response.json();
        setCategorias(result);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
      }
    };

    const fetchTransacoes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/lancamentos/${user.id}`);
        const result = await response.json();
        setTransacoes(result);
      } catch (err) {
        console.error('Erro ao buscar transações:', err);
      }
    };

    if (user.id) {
      fetchCategorias();
      fetchTransacoes();
    }
  }, [user.id]);

  const handleAddCategory = (novaCategoria) => {
    setCategorias([...categorias, novaCategoria]);
  };

  const handleRemoveCategory = (id) => {
    setCategorias(categorias.filter((categoria) => categoria.id !== id));
  };

  const handleAddTransaction = (novaTransacao) => {
    setTransacoes([novaTransacao, ...transacoes]);
  };

  const handleRemoveTransaction = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/lancamentos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTransacoes(transacoes.filter((transacao) => transacao.id !== id));
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
    <div className={styles.dashboardContainer}>
      <h1>Dashboard</h1>
      <button onClick={() => setShowModal(true)} className={styles.addButton}>+</button> {/* Botão para abrir o modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}> {/* Modal */}
        <AddCategory onAdd={handleAddCategory} userId={user.id} />
        <AddTransaction onAdd={handleAddTransaction} categorias={categorias} userId={user.id} />
      </Modal>
      <AddCategory onAdd={handleAddCategory} userId={user.id} />
      <CategoryList categorias={categorias} onRemove={handleRemoveCategory} />
      <AddTransaction onAdd={handleAddTransaction} categorias={categorias} userId={user.id} />
      <PieChartComponent transacoes={transacoes} categorias={categorias} /> {/* Adicionando o componente do gráfico */}
      <TransactionList transacoes={transacoes} categorias={categorias} onRemove={handleRemoveTransaction} />
      <button onClick={handleDeleteAccount}>Excluir conta</button>
    </div>
  );
};

export default Dashboard;
