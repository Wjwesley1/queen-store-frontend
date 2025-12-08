// src/pages/Admin/Pedidos.jsx — CONCLUÍDO + BLOQUEIO TOTAL + EDIÇÃO SEGURA
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'https://queen-store-api.onrender.com';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/pedidos`);
      setPedidos(res.data);
      setLoading(false);
    } catch (err) {
      alert('Erro ao carregar pedidos');
      setLoading(false);
    }
  };

  const iniciarEdicao = (pedido) => {
    if (pedido.status === 'concluido') {
      alert('Pedido concluído não pode ser editado!');
      return;
    }
    setEditando(pedido.id);
    setForm({
      cliente_nome: pedido.cliente_nome,
      cliente_whatsapp: pedido.cliente_whatsapp,
      itens: JSON.stringify(pedido.itens || [], null, 2),
      valor_total: pedido.valor_total,
      status: pedido.status || 'pendente'
    });
  };

  const salvarEdicao = async (id) => {
    try {
      const itensArray = JSON.parse(form.itens || '[]');
      await axios.patch(`${API_URL}/api/pedidos/${id}`, {
        cliente_nome: form.cliente_nome,
        cliente_whatsapp: form.cliente_whatsapp,
        itens: itensArray,
        valor_total: parseFloat(form.valor_total),
        status: form.status
      });
      carregarPedidos();
      setEditando(null);
      alert('Pedido editado com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar edição');
    }
  };

  const cancelarEdicao = () => {
    setEditando(null);
    setForm({});
  };

  const atualizarStatus = async (id, status) => {
    if (status === 'concluido') {
      if (!confirm('Tem certeza que quer marcar como CONCLUÍDO? Não poderá mais editar depois!')) {
        return;
      }
    }
    try {
      await axios.patch(`${API_URL}/api/pedidos/${id}`, { status });
      carregarPedidos();
    } catch (err) {
      alert('Erro ao atualizar status');
    }
  };

  const abrirWhatsApp = (whatsapp) => {
    const numero = whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/55${numero}`, '_blank');
  };

  const parseItens = (itens) => {
    if (!itens) return [];
    if (Array.isArray(itens)) return itens;
    try { return JSON.parse(itens); } catch { return []; }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluido': return 'bg-gradient-to-r from-gray-600 to-gray-800';
      case 'entregue': return 'bg-purple-600';
      case 'enviado': return 'bg-blue-600';
      case 'pago': return 'bg-green-600';
      default: return 'bg-yellow-600';
    }
  };

  const getStatusTexto = (status) => {
    return status === 'concluido' ? 'CONCLUÍDO' : status?.toUpperCase() || 'PENDENTE';
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-5xl text-[#0F1B3F] font-bold">Carregando pedidos...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-6xl font-bold text-[#0F1B3F]">Pedidos ({pedidos.length})</h1>
            <Link to="/admin/dashboard" className="bg-[#0F1B3F] text-white px-8 py-4 rounded-full hover:bg-pink-600 text-xl font-bold">
              Voltar ao Painel
            </Link>
          </div>

          <div className="space-y-10">
            {pedidos.map(pedido => {
              const itens = parseItens(pedido.itens);
              const isConcluido = pedido.status === 'concluido';

              return (
                <div key={pedido.id} className={`p-10 rounded-3xl shadow-2xl border-l-8 border-[#0F1B3F] transition-all ${
                  isConcluido ? 'bg-gray-100 opacity-80' : 'bg-gradient-to-r from-pink-50 to-purple-50'
                }`}>
                  {/* CABEÇALHO */}
                  <div className="flex flex-col md:flex-row justify-between items-start mb-8">
                    <div>
                      <h2 className="text-4xl font-bold text-[#0F1B3F]">Pedido #{pedido.id}</h2>
                      <p className="text-xl text-gray-600">
                        {new Date(pedido.criado_em).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                      <p className="text-5xl font-bold text-green-600">
                        R$ {parseFloat(pedido.valor_total).toFixed(2)}
                      </p>
                      <span className={`inline-block mt-4 px-8 py-4 rounded-full text-white font-bold text-2xl ${getStatusColor(pedido.status)}`}>
                        {getStatusTexto(pedido.status)}
                      </span>
                    </div>
                  </div>

                  {/* MODO EDIÇÃO */}
                  {editando === pedido.id ? (
                    <div className="space-y-6 p-8 bg-white/80 rounded-2xl">
                      <input value={form.cliente_nome} onChange={e => setForm({...form, cliente_nome: e.target.value})} className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] text-xl" placeholder="Nome" />
                      <input value={form.cliente_whatsapp} onChange={e => setForm({...form, cliente_whatsapp: e.target.value})} className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] text-xl" placeholder="WhatsApp" />
                      <textarea value={form.itens} onChange={e => setForm({...form, itens: e.target.value})} rows="8" className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] font-mono text-sm bg-gray-100" />
                      <input type="number" step="0.01" value={form.valor_total} onChange={e => setForm({...form, valor_total: e.target.value})} className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] text-xl" />
                      <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] text-xl">
                        <option value="pendente">Pendente</option>
                        <option value="pago">Pago</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregue">Entregue</option>
                        <option value="concluido">Concluído</option>
                      </select>
                      <div className="flex gap-4">
                        <button onClick={() => salvarEdicao(pedido.id)} className="bg-green-600 text-white px-10 py-5 rounded-full hover:bg-green-700 text-2xl font-bold">SALVAR</button>
                        <button onClick={cancelarEdicao} className="bg-gray-600 text-white px-10 py-5 rounded-full hover:bg-gray-700 text-2xl font-bold">CANCELAR</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* VISUALIZAÇÃO NORMAL */}
                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <p className="text-2xl font-bold text-[#0F1B3F]">Cliente</p>
                          <p className="text-xl">{pedido.cliente_nome}</p>
                          <button onClick={() => abrirWhatsApp(pedido.cliente_whatsapp)} className="mt-4 bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 font-bold text-xl flex items-center gap-3">
                            WhatsApp Falar com cliente
                          </button>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-[#0F1B3F]">Endereço</p>
                          <p className="text-xl">
                            {pedido.endereco || 'Via WhatsApp'}<br />
                            {pedido.cidade || 'Não informado'} - {pedido.estado || 'NA'}<br />
                            CEP: {pedido.cep || '00000-000'}
                          </p>
                        </div>
                      </div>

                      <div className="mb-8">
                        <p className="text-2xl font-bold text-[#0F1B3F] mb-4">Itens:</p>
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                          {itens.map((item, i) => (
                            <div key={i} className="flex justify-between py-3 border-b last:border-0 text-lg">
                              <span>{item.quantidade}x {item.nome}</span>
                              <span className="font-bold">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* BOTÕES DE AÇÃO */}
                      <div className="flex flex-wrap gap-6 justify-center">
                        {!isConcluido && pedido.status !== 'pago' && (
                          <button onClick={() => atualizarStatus(pedido.id, 'pago')} className="bg-green-600 text-white px-10 py-5 rounded-full hover:bg-green-700 text-2xl font-bold">
                            Marcar como PAGO
                          </button>
                        )}
                        {!isConcluido && pedido.status === 'pago' && pedido.status !== 'enviado' && (
                          <button onClick={() => atualizarStatus(pedido.id, 'enviado')} className="bg-blue-600 text-white px-10 py-5 rounded-full hover:bg-blue-700 text-2xl font-bold">
                            Marcar como ENVIADO
                          </button>
                        )}
                        {!isConcluido && pedido.status === 'enviado' && (
                          <button onClick={() => atualizarStatus(pedido.id, 'entregue')} className="bg-purple-600 text-white px-10 py-5 rounded-full hover:bg-purple-700 text-2xl font-bold">
                            Marcar como ENTREGUE
                          </button>
                        )}
                        {!isConcluido && (
                          <button onClick={() => atualizarStatus(pedido.id, 'concluido')} className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-10 py-5 rounded-full hover:opacity-90 text-2xl font-bold">
                            MARCAR COMO CONCLUÍDO
                          </button>
                        )}
                        {isConcluido && (
                          <div className="text-center py-8">
                            <p className="text-4xl font-bold text-gray-700 animate-pulse">
                              PEDIDO CONCLUÍDO
                            </p>
                            <p className="text-xl text-gray-600 mt-4">Bloqueado para edição</p>
                          </div>
                        )}
                      </div>

                      {/* BOTÃO EDITAR (só aparece se não for concluído) */}
                      {!isConcluido && (
                        <button
                          onClick={() => iniciarEdicao(pedido)}
                          className="mt-8 bg-[#0F1B3F] text-white px-10 py-5 rounded-full hover:bg-pink-600 text-2xl font-bold"
                        >
                          EDITAR PEDIDO
                        </button>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}