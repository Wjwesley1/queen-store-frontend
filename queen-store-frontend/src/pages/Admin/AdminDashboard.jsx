// src/pages/Admin/AdminDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const logout = () => {
    localStorage.removeItem('admin-logado');
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0F1B3F] text-white p-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">Queen Admin</h1>
          <button onClick={logout} className="bg-red-600 px-6 py-3 rounded-full hover:bg-red-700">
            Sair
          </button>
        </div>
      </header>

      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold text-[#0F1B3F] mb-8">Bem-vinda, Rainha!</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Link to="/admin/pedidos" className="bg-white p-10 rounded-3xl shadow-xl text-center hover:scale-105 transition">
            <h3 className="text-5xl font-bold text-pink-600">12</h3>
            <p className="text-xl mt-4">Pedidos Hoje</p>
          </Link>
          
          <Link to="/admin/estoque" className="bg-white p-10 rounded-3xl shadow-xl text-center hover:scale-105 transition">
            <h3 className="text-5xl font-bold text-yellow-600">3</h3>
            <p className="text-xl mt-4">Produtos com Estoque Baixo</p>
          </Link>

          <Link 
  to="/admin/cadastrar" 
  className="bg-gradient-to-r from-[#0F1B3F] to-pink-600 text-white p-10 rounded-3xl shadow-xl text-center hover:scale-105 transition"
>
  <h3 className="text-5xl font-bold">+</h3>
  <p className="text-xl mt-4">Cadastrar Novo Produto</p>
</Link>
          
          <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
            <h3 className="text-5xl font-bold text-green-600">R$ 2.847,00</h3>
            <p className="text-xl mt-4">Faturamento Hoje</p>
          </div>
        </div>
      </div>
    </div>
  );
}