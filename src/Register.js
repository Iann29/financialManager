import React, { useState } from 'react';
import './Register.css';

function Register() {
  // Estados para cada campo do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui você implementaria a lógica de envio do formulário para o back-end
  };

  return (
    
      CRIAR CONTA
      {/* Retângulo do formulário */}
      
        Nome *
        
        Endereço de e-mail *
        
        Senha *
        
        CPF *
        
        Telefone *
        
        Criar Conta
      
    
  );
}

export default Register;