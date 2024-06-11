import React, { useState, useEffect } from 'react';
import AddCategory from './AddCategory';
import CategoryList from './CategoryList';
import { useAuth } from './AuthContext';

const Dashboard = ({ userId }) => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`http://localhost:5000/categorias/${userId}`);
        const result = await response.json();
        setCategorias(result);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
      }
    };

    if (userId) {
      fetchCategorias();
    }
  }, [userId]);

  const handleAddCategory = (novaCategoria) => {
    setCategorias([...categorias, novaCategoria]);
  };

  const handleRemoveCategory = (id) => {
    setCategorias(categorias.filter((categoria) => categoria.id !== id));
  };

  const { logout } = useAuth();  // Corrigindo a definição do logout

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir sua conta?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/usuarios/${userId}`, {
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
    <div>
      <h1>Dashboard</h1>
      <AddCategory onAdd={handleAddCategory} userId={userId} />
      <CategoryList categorias={categorias} onRemove={handleRemoveCategory} />
      {/* Outros componentes da Dashboard */}
      <button onClick={handleDeleteAccount}>Excluir conta</button> {/* Adicionando o botão */}
    </div>
  );
};

export default Dashboard;
