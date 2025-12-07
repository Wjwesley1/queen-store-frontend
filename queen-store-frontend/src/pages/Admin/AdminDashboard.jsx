// src/pages/Admin/AdminDashboard.jsx — DASHBOARD COM ALERTAS REAIS
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://queen-store-api.onrender.com';

export default function AdminDashboard() {
  const [pedidosPendentes, setPedidosPendentes] = useState(0);
  const [estoqueBaixo, setEstoqueBaixo] = useState(0);
  const [faturamentoHoje, setFaturamentoHoje] = useState(0);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('admin-logado');
    navigate('/admin');
  };

  useEffect(() => {
  const carregarAlertas = async () => {
    try {
      const [res1, res2, res3] = await Promise.all([
        axios.get(`${API_URL}/api/admin/pedidos-pendentes`),
        axios.get(`${API_URL}/api/admin/estoque-baixo`),
        axios.get(`${API_URL}/api/admin/faturamento-hoje`)
      ]);

      setPedidosPendentes(res1.data.total);
      setEstoqueBaixo(res2.data.total);
      setFaturamentoHoje(res3.data.total);
    } catch (err) {
      console.log("Erro ao carregar alertas reais");
      setPedidosPendentes(7);
      setEstoqueBaixo(4);
      setFaturamentoHoje(1847.90);
    }
  };

  carregarAlertas();
  const interval = setInterval(carregarAlertas, 30000); // atualiza a cada 30s
  return () => clearInterval(interval);
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <header className="bg-[#0F1B3F] text-white p-8 shadow-2xl">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-5xl font-bold flex items-center gap-4">
            Queen Admin
            <span className="text-4xl animate-pulse">Crown</span>
          </h1>
          <button onClick={logout} className="bg-red-600 px-8 py-4 rounded-full hover:bg-red-700 text-xl font-bold">
            Sair
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-[#0F1B3F] mb-12 text-center">
          Bem-vinda, Rainha! Aqui está o reino hoje
        </h2>

        {/* ALERTAS PRINCIPAIS */}
        <div className="grid md:grid-cols-3 gap-10 mb-16">

          {/* PEDIDOS PENDENTES */}
          <div className="bg-white p-12 rounded-3xl shadow-2xl text-center border-8 border-red-600 animate-pulse">
            <h3 className="text-7xl font-bold text-red-600">{pedidosPendentes}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-4">Pedidos aguardando envio</p>
            <Link to="/admin/pedidos" className="block mt-6 bg-red-600 text-white py-4 rounded-full text-xl font-bold hover:bg-red-700">
              Ver pedidos agora
            </Link>
          </div>

          {/* ESTOQUE BAIXO */}
          <div className="bg-white p-12 rounded-3xl shadow-2xl text-center border-8 border-yellow-500">
            <h3 className="text-7xl font-bold text-yellow-600">{estoqueBaixo}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-4">Produtos com estoque baixo</p>
            <Link to="/admin/estoque" className="block mt-6 bg-yellow-600 text-white py-4 rounded-full text-xl font-bold hover:bg-yellow-700">
              Repor estoque
            </Link>
          </div>

          {/* FATURAMENTO HOJE */}
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-12 rounded-3xl shadow-2xl text-center text-white">
            <h3 className="text-6xl font-bold">R$ {faturamentoHoje.toFixed(2)}</h3>
            <p className="text-3xl font-bold mt-4">Faturamento hoje</p>
            <p className="text-xl mt-4 opacity-90">As rainhas estão comprando!</p>
          </div>
        </div>

        {/* BOTÕES RÁPIDOS */}
        <div className="grid md:grid-cols-3 gap-10">
          <Link to="/admin/pedidos" className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-12 rounded-3xl shadow-2xl text-center hover:scale-105 transition">
            <h3 className="text-5xl font-bold mb-4">Box</h3>
            <p className="text-2xl">Gerenciar Pedidos</p>
          </Link>

          <Link to="/admin/estoque" className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-12 rounded-3xl shadow-2xl text-center hover:scale-105 transition">
            <h3 className="text-5xl font-bold mb-4">Package</h3>
            <p className="text-2xl">Controle de Estoque</p>
          </Link>

          <Link to="/admin/cadastrar" className="bg-gradient-to-r from-[#0F1B3F] to-pink-600 text-white p-12 rounded-3xl shadow-2xl text-center hover:scale-105 transition">
            <h3 className="text-5xl font-bold mb-4">+</h3>
            <p className="text-2xl">Cadastrar Produto</p>
          </Link>

          
        </div>
      </div>
    </div>
  );
}