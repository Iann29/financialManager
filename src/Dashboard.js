import React, { useState, useEffect, useCallback } from 'react';
import AddCategory from './AddCategory';
import CategoryList from './CategoryList';
import AddTransaction from './AddTransaction';
import TransactionList from './TransactionList';
import PieChartComponent from './PieChartComponent';
import { useAuth } from './AuthContext';
import Modal from './Modal';
import customerIcon from './icon/Person_ico.png';
import addIcon from './icon/add.png';
import './Dashboard.css';
import QRCode from 'qrcode.react';

const getMonthName = (monthIndex) => {
  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  return months[monthIndex];
};

const Dashboard = () => {
  const [categorias, setCategorias] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [saldoMensal, setSaldoMensal] = useState({ receita: 0, despesa: 0 });
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [otpSecret, setOtpSecret] = useState('');
  const { user, logout } = useAuth();

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

  const handleGenerateOTP = async () => {
    try {
      const response = await fetch(`http://localhost:5000/generate-otp/${user.id}`);
      const result = await response.json();
      setOtpSecret(result.otpSecret);
    } catch (err) {
      console.error('Erro ao gerar OTP:', err);
    }
  };

  const handleRemoveOTP = async () => {
    try {
      const response = await fetch(`http://localhost:5000/remove-otp/${user.id}`, {
        method: 'POST',
      });
      if (response.ok) {
        setOtpSecret('');
        alert('Autenticador OTP removido com sucesso.');
      } else {
        alert('Erro ao remover o autenticador OTP.');
      }
    } catch (err) {
      console.error('Erro ao remover OTP:', err);
    }
  };

  const formatDate = (date) => {
    const daysOfWeek = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];

    return `${day} de ${month} (${dayOfWeek})`;
  };

  return (
    <div className="dashboard-container">
      <button onClick={() => setShowModal(true)} className="add-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="111" height="112" viewBox="0 0 111 112" fill="none">
          <circle cx="55.5694" cy="55.9517" r="55.4297" fill="#FFA800" />
        </svg>
        <img src={addIcon} alt="Adicionar" className="add-icon-mais" />
      </button>
      <button onClick={() => setShowProfileModal(true)} className="profile-button">
        <img src={customerIcon} alt="Profile Icon" className="profile-icon" />
      </button>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <AddCategory onAdd={handleAddCategory} userId={user.id} />
        <AddTransaction onAdd={handleAddTransaction} categorias={categorias} userId={user.id} />
      </Modal>
      <Modal show={showProfileModal} onClose={() => setShowProfileModal(false)}>
        <div className="profile-modal-content">
          <h2>Perfil</h2>
          <button onClick={handleDeleteAccount} className="delete-account-button">Excluir conta</button>
          <button onClick={logout} className="logout-button">Sair</button>
          <button onClick={handleGenerateOTP} className="generate-otp-button">Gerar OTP</button>
          {otpSecret && (
            <>
              <div className="otp-qr-code">
                <QRCode value={`otpauth://totp/FinancialManager:${user.email}?secret=${otpSecret}&issuer=FinancialManager`} />
                <p>Escaneie o QR Code com seu aplicativo autenticador.</p>
              </div>
              <button onClick={handleRemoveOTP} className="remove-otp-button">Remover OTP</button>
            </>
          )}
        </div>
      </Modal>
      <div className="chart-container">
        <div className="saldo-mes">
          Saldo de {getMonthName(new Date().getMonth())}
        </div>
        <div className="chart-line"></div>
        <div className="chart-wrapper">
          <PieChartComponent transacoes={transacoes} categorias={categorias} />
        </div>
        <div className="chart-right">
          <div className="saldo-container">
            <div className="saldo-info">
              <span className="label">Ganhos</span>
              <span className="value" style={{ color: saldoMensal.receita > 0 ? 'green' : 'white' }}>
                {saldoMensal.receita}
              </span>
            </div>
            <div className="saldo-info">
              <span className="label">Gastos</span>
              <span className="value" style={{ color: saldoMensal.despesa > 0 ? 'red' : 'white' }}>
                {saldoMensal.despesa}
              </span>
            </div>
            <div className="separator-line"></div>
            <div className="saldo-total">
              <span className="label">Total</span>
              <span className="value">
                {saldoMensal.despesa > saldoMensal.receita ? `-${(saldoMensal.despesa - saldoMensal.receita).toFixed(2)}` : (saldoMensal.receita - saldoMensal.despesa).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="saldo-transacoes-container">
        <div className="saldo-mensal">
          <div className="data-transacao-day">
            {formatDate(new Date())}
          </div>
          <div className="saldo-gastos-ganhos">
            {saldoMensal.receita > 0 && (
              <div className="saldo-ganhos">
                <span className="ganhos-label">Ganhos: </span>
                <span className="ganhos-value">{saldoMensal.receita}</span>
              </div>
            )}
            {saldoMensal.despesa > 0 && (
              <div className="saldo-gastos">
                <span className="gastos-label">Gastos: </span>
                <span className="gastos-value">{saldoMensal.despesa}</span>
              </div>
            )}
          </div>
        </div>
        <div className="saldo-line"></div>
        <TransactionList transacoes={transacoes} categorias={categorias} onRemove={handleRemoveTransaction} />
      </div>
      <CategoryList categorias={categorias} onRemove={handleRemoveCategory} />
    </div>
  );
};

export default Dashboard;
