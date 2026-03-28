// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://queen-store-api.onrender.com';

export default function AdminDashboard() {
  const [pedidosPendentes, setPedidosPendentes] = useState(0);
  const [estoqueBaixo, setEstoqueBaixo] = useState(0);
  const [faturamentoHoje, setFaturamentoHoje] = useState(0);
  const [carregando, setCarregando] = useState(true);
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
        console.error('Erro ao carregar alertas');
      } finally {
        setCarregando(false);
      }
    };

    carregarAlertas();
    const interval = setInterval(carregarAlertas, 30000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ value, label, sublabel, to, linkLabel, accent, pulse }) => (
    <div className={`bg-white rounded-3xl shadow-sm border-2 p-8 flex flex-col gap-4 ${accent} ${pulse ? 'animate-pulse' : ''}`}>
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className={`text-5xl font-bold ${pulse ? 'text-red-500' : 'text-[#0F1B3F]'}`}>
        {carregando ? '—' : value}
      </p>
      {sublabel && <p className="text-sm text-gray-400">{sublabel}</p>}
      {to && (
        <Link to={to} className="mt-auto bg-[#0F1B3F] text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-pink-600 transition text-center">
          {linkLabel}
        </Link>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-[#0F1B3F] text-white px-8 py-6 shadow-lg">
        <div className="container mx-auto max-w-5xl flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-1">Painel Admin</p>
            <h1 className="text-3xl font-bold">Queen Store</h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-white/10 hover:bg-red-600 px-5 py-3 rounded-full text-sm font-bold transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            Sair
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10 max-w-5xl">

        <div className="mb-8">
          <h2 className="text-4xl font-bold text-[#0F1B3F]">Bem-vinda, Rainha 👑</h2>
          <p className="text-gray-400 mt-1">Aqui está o resumo do seu reino hoje</p>
        </div>

        {/* CARDS DE ALERTA */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <StatCard
            label="Pedidos pendentes"
            value={pedidosPendentes}
            sublabel="Aguardando envio"
            to="/admin/pedidos"
            linkLabel="Ver pedidos"
            accent={pedidosPendentes > 0 ? 'border-red-300' : 'border-gray-100'}
            pulse={pedidosPendentes > 0}
          />
          <StatCard
            label="Estoque baixo"
            value={estoqueBaixo}
            sublabel="Produtos com ≤ 5 unidades"
            to="/admin/estoque"
            linkLabel="Repor estoque"
            accent={estoqueBaixo > 0 ? 'border-yellow-300' : 'border-gray-100'}
            pulse={false}
          />
          <StatCard
            label="Faturamento hoje"
            value={`R$ ${faturamentoHoje.toFixed(2)}`}
            sublabel="Pedidos pagos/enviados/entregues"
            accent="border-green-200"
            pulse={false}
          />
        </div>

        {/* AÇÕES RÁPIDAS */}
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Ações rápidas</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <Link
            to="/admin/pedidos"
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:border-[#0F1B3F] hover:shadow-md transition group"
          >
            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#0F1B3F] transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-pink-600 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#0F1B3F] mb-1">Gerenciar Pedidos</h3>
            <p className="text-sm text-gray-400">Visualize e atualize o status dos pedidos</p>
          </Link>

          <Link
            to="/admin/estoque"
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:border-[#0F1B3F] hover:shadow-md transition group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#0F1B3F] transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#0F1B3F] mb-1">Controle de Estoque</h3>
            <p className="text-sm text-gray-400">Edite produtos e atualize quantidades</p>
          </Link>

          <Link
            to="/admin/cadastrar"
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:border-[#0F1B3F] hover:shadow-md transition group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#0F1B3F] transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#0F1B3F] mb-1">Cadastrar Produto</h3>
            <p className="text-sm text-gray-400">Adicione novos produtos com fotos</p>
          </Link>
        </div>

      </div>
    </div>
  );
}