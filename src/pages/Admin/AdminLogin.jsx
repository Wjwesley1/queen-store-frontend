// src/pages/Admin/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // SENHA TEMPORÁRIA (troca depois)
    if (senha === 'queen2025') {
      localStorage.setItem('admin-logado', 'true');
      navigate('/admin/dashboard');
    } else {
      alert('Senha errada, rainha!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
      <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-5xl font-bold text-[#0F1B3F] mb-4">Queen Admin</h1>
        <p className="text-gray-600 mb-8">Painel da Rainha</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite a senha mágica"
            className="w-full px-6 py-4 rounded-full border-2 border-[#0F1B3F] text-center text-xl focus:outline-none focus:border-pink-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#0F1B3F] text-white py-4 rounded-full font-bold text-xl hover:bg-pink-600 transition"
          >
            Entrar no Reino
          </button>
        </form>
      </div>
    </div>
  );
}