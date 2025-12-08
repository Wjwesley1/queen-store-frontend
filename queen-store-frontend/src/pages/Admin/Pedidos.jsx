// src/pages/Admin/Pedidos.jsx — EDIÇÃO COMPLETA + LISTA DE PEDIDOS
import React, {useEffect, useState } from 'react';
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
    if (typeof itens === 'string') {
      try { return JSON.parse(itens); } catch { return []; }
    }
    return [];
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-5xl text-[#0F1B3F] font-bold">Carregando pedidos...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-5xl font-bold text-[#0F1B3F]">Pedidos ({pedidos.length})</h1>
            <Link to="/admin/dashboard" className="bg-[#0F1B3F] text-white px-8 py-4 rounded-full hover:bg-pink-600 text-xl font-bold">
              Voltar ao Painel
            </Link>
          </div>

          <div className="space-y-10">
            {pedidos.map(pedido => {
              const itens = parseItens(pedido.itens);

              return (
                <div key={pedido.id} className="bg-gradient-to-r from-pink-50 to-purple-50 p-10 rounded-3xl shadow-2xl border-l-8 border-[#0F1B3F]">
                  {/* MODO EDIÇÃO */}
                  {editando === pedido.id ? (
                    <div className="space-y-8">
                      <input
                        value={form.cliente_nome}
                        onChange={e => setForm({...form, cliente_nome: e.target.value})}
                        className="w-full px-6 py-4 rounded-xl border-2 border-[#0F1B3F] text-xl"
                        placeholder="Nome do cliente"
                      />
                      <input
                        value={form.cliente_whatsapp}
                        onChange={e => setForm({...form, cliente_whatsapp: e.target.value})}
                        className="w-full px-6 py-4 rounded-xl border-2 border-[#0F1B3F] text-xl"
                        placeholder="WhatsApp"
                      />
                      <textarea
                        value={form.itens}
                        onChange={e => setForm({...form, itens: e.target.value})}
                        rows="10"
                        className="w-full px-6 py-4 rounded-xl border-2 border-[#0F1B3F] text-lg font-mono bg-gray-100"
                        placeholder='[{"nome": "Geleia Melancia", "quantidade": 2, "preco": 29.90}]'
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={form.valor_total}
                        onChange={e => setForm({...form, valor_total: e.target.value})}
                        className="w-full px-6 py-4 rounded-xl border-2 border-[#0F1B3F] text-xl"
                        placeholder="Valor total"
                      />
                      <select
                        value={form.status}
                        onChange={e => setForm({...form, status: e.target.value})}
                        className="w-full px-6 py-4 rounded-xl border-2 border-[#0F1B3F] text-xl"
                      >
                        <option value="pendente">Pendente</option>
                        <option value="pago">Pago</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregue">Entregue</option>
                      </select>

                      <div className="flex gap-4">
                        <button onClick={() => salvarEdicao(pedido.id)} className="bg-green-600 text-white px-10 py-5 rounded-full hover:bg-green-700 text-2xl font-bold">
                          SALVAR
                        </button>
                        <button onClick={cancelarEdicao} className="bg-gray-600 text-white px-10 py-5 rounded-full hover:bg-gray-700 text-2xl font-bold">
                          CANCELAR
                        </button>
                      </div>
                    </div>
                  ) : (
                    // MODO VISUALIZAÇÃO NORMAL
                    <>
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h2 className="text-4xl font-bold text-[#0F1B3F]">Pedido #{pedido.id}</h2>
                          <p className="text-xl text-gray-600">
                            {new Date(pedido.criado_em).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <button
                          onClick={() => iniciarEdicao(pedido)}
                          className="bg-[#0F1B3F] text-white px-8 py-4 rounded-full hover:bg-pink-600 text-xl font-bold"
                        >
                          EDITAR PEDIDO
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <p className="text-2xl font-bold text-[#0F1B3F]">Cliente</p>
                          <p className="text-xl">{pedido.cliente_nome}</p>
                          <button
                            onClick={() => abrirWhatsApp(pedido.cliente_whatsapp)}
                            className="mt-4 bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 font-bold text-xl flex items-center gap-3"
                          >
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
                        <p className="text-2xl font-bold text-[#0F1B3F] mb-4">Itens do pedido:</p>
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                          {itens.length === 0 ? (
                            <p className="text-gray-600">Nenhum item</p>
                          ) : (
                            itens.map((item, i) => (
                              <div key={i} className="flex justify-between py-3 border-b last:border-0 text-lg">
                                <span>{item.quantidade || 1}x {item.nome}</span>
                                <span className="font-bold">
                                  R$ {(parseFloat(item.preco || 0) * (item.quantidade || 1)).toFixed(2)}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-6 justify-center">
                        {pedido.status !== 'pago' && (
                          <button onClick={() => atualizarStatus(pedido.id, 'pago')} className="bg-green-600 text-white px-10 py-5 rounded-full hover:bg-green-700 text-2xl font-bold">
                            Marcar como PAGO
                          </button>
                        )}
                        {pedido.status === 'pago' && pedido.status !== 'enviado' && (
                          <button onClick={() => atualizarStatus(pedido.id, 'enviado')} className="bg-blue-600 text-white px-10 py-5 rounded-full hover:bg-blue-700 text-2xl font-bold">
                            Marcar como ENVIADO
                          </button>
                        )}
                        {pedido.status === 'enviado' && (
                          <button onClick={() => atualizarStatus(pedido.id, 'entregue')} className="bg-purple-600 text-white px-10 py-5 rounded-full hover:bg-purple-700 text-2xl font-bold">
                            Marcar como ENTREGUE
                          </button>
                        )}
                      </div>
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