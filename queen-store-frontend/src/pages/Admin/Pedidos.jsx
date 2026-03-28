// src/pages/Admin/Pedidos.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'https://queen-store-api.onrender.com';

const STATUS_CONFIG = {
  pendente:  { label: 'PENDENTE',  bg: 'bg-yellow-500',  text: 'text-yellow-700',  light: 'bg-yellow-50'  },
  pago:      { label: 'PAGO',      bg: 'bg-green-500',   text: 'text-green-700',   light: 'bg-green-50'   },
  enviado:   { label: 'ENVIADO',   bg: 'bg-blue-500',    text: 'text-blue-700',    light: 'bg-blue-50'    },
  entregue:  { label: 'ENTREGUE', bg: 'bg-purple-500',  text: 'text-purple-700',  light: 'bg-purple-50'  },
  concluido: { label: 'CONCLUÍDO', bg: 'bg-gray-500',    text: 'text-gray-700',    light: 'bg-gray-50'    },
};

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});
  const [confirmando, setConfirmando] = useState(null); // id do pedido aguardando confirmação de conclusão

  useEffect(() => { carregarPedidos(); }, []);

  const carregarPedidos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/pedidos`);
      setPedidos(res.data);
    } catch (err) {
      alert('Erro ao carregar pedidos');
    } finally {
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
    } catch (err) {
      alert('Erro ao salvar edição');
    }
  };

  const atualizarStatus = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/api/pedidos/${id}`, { status });
      setConfirmando(null);
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

  const inputClass = "w-full px-5 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#0F1B3F] focus:outline-none text-base bg-white transition-colors";
  const labelClass = "block text-xs font-bold text-[#0F1B3F] uppercase tracking-widest mb-1";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-2xl font-bold text-[#0F1B3F]">Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm font-bold text-pink-500 uppercase tracking-widest mb-1">Painel Admin</p>
            <h1 className="text-4xl font-bold text-[#0F1B3F]">Pedidos <span className="text-gray-400">({pedidos.length})</span></h1>
          </div>
          <Link
            to="/admin/dashboard"
            title="Voltar ao Painel"
            className="bg-[#0F1B3F] text-white p-4 rounded-full hover:bg-pink-600 transition flex items-center justify-center shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>

        {/* LISTA DE PEDIDOS */}
        <div className="space-y-5">
          {pedidos.length === 0 && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
              <p className="text-2xl font-bold text-gray-400">Nenhum pedido ainda</p>
            </div>
          )}

          {pedidos.map(pedido => {
            const itens = parseItens(pedido.itens);
            const isConcluido = pedido.status === 'concluido';
            const statusCfg = STATUS_CONFIG[pedido.status] || STATUS_CONFIG.pendente;

            return (
              <div
                key={pedido.id}
                className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden ${isConcluido ? 'opacity-70' : ''}`}
              >
                {/* FAIXA COLORIDA DO STATUS */}
                <div className={`h-1.5 w-full ${statusCfg.bg}`} />

                <div className="p-8">
                  {/* CABEÇALHO DO CARD */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-bold text-[#0F1B3F]">Pedido #{pedido.id}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${statusCfg.bg}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {new Date(pedido.criado_em).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <p className="text-3xl font-bold text-green-600">
                      R$ {parseFloat(pedido.valor_total).toFixed(2)}
                    </p>
                  </div>

                  {/* MODO EDIÇÃO */}
                  {editando === pedido.id ? (
                    <div className="space-y-4 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Nome do Cliente</label>
                          <input value={form.cliente_nome} onChange={e => setForm({...form, cliente_nome: e.target.value})} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>WhatsApp</label>
                          <input value={form.cliente_whatsapp} onChange={e => setForm({...form, cliente_whatsapp: e.target.value})} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Valor Total (R$)</label>
                          <input type="number" step="0.01" value={form.valor_total} onChange={e => setForm({...form, valor_total: e.target.value})} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Status</label>
                          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className={inputClass}>
                            <option value="pendente">Pendente</option>
                            <option value="pago">Pago</option>
                            <option value="enviado">Enviado</option>
                            <option value="entregue">Entregue</option>
                            <option value="concluido">Concluído</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Itens (JSON)</label>
                        <textarea value={form.itens} onChange={e => setForm({...form, itens: e.target.value})} rows="6" className={`${inputClass} font-mono text-xs`} />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button onClick={() => salvarEdicao(pedido.id)} className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 font-bold text-sm">
                          SALVAR
                        </button>
                        <button onClick={() => setEditando(null)} className="bg-gray-400 text-white px-8 py-3 rounded-full hover:bg-gray-500 font-bold text-sm">
                          CANCELAR
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* CLIENTE E ENDEREÇO */}
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className={`${statusCfg.light} rounded-2xl p-5`}>
                          <p className="text-xs font-bold text-[#0F1B3F] uppercase tracking-widest mb-2">Cliente</p>
                          <p className="font-bold text-lg text-[#0F1B3F]">{pedido.cliente_nome}</p>
                          <p className="text-sm text-gray-500 mb-4">{pedido.cliente_email || 'Email não informado'}</p>
                          <button
                            onClick={() => abrirWhatsApp(pedido.cliente_whatsapp)}
                            className="bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 font-bold text-sm flex items-center gap-2 w-fit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            {pedido.cliente_whatsapp}
                          </button>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-5">
                          <p className="text-xs font-bold text-[#0F1B3F] uppercase tracking-widest mb-2">Endereço</p>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {pedido.endereco || 'Via WhatsApp'}<br />
                            {pedido.cidade || 'Cidade não informada'} — {pedido.estado || 'NA'}<br />
                            CEP: {pedido.cep || 'Não informado'}
                          </p>
                        </div>
                      </div>

                      {/* ITENS */}
                      <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                        <p className="text-xs font-bold text-[#0F1B3F] uppercase tracking-widest mb-3">Itens do Pedido</p>
                        <div className="space-y-2">
                          {itens.map((item, i) => (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0 text-sm">
                              <span className="text-gray-700">{item.quantidade}× {item.nome}</span>
                              <span className="font-bold text-[#0F1B3F]">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AÇÕES */}
                      {isConcluido ? (
                        <div className="flex items-center gap-2 text-gray-400 py-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="font-bold text-sm">Pedido concluído — bloqueado para edição</span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3 items-center">
                          {/* Próximo status */}
                          {pedido.status === 'pendente' && (
                            <button onClick={() => atualizarStatus(pedido.id, 'pago')} className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 font-bold text-sm">
                              Marcar como PAGO
                            </button>
                          )}
                          {pedido.status === 'pago' && (
                            <button onClick={() => atualizarStatus(pedido.id, 'enviado')} className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 font-bold text-sm">
                              Marcar como ENVIADO
                            </button>
                          )}
                          {pedido.status === 'enviado' && (
                            <button onClick={() => atualizarStatus(pedido.id, 'entregue')} className="bg-purple-500 text-white px-6 py-3 rounded-full hover:bg-purple-600 font-bold text-sm">
                              Marcar como ENTREGUE
                            </button>
                          )}

                          {/* Concluir com confirmação inline */}
                          {confirmando === pedido.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-600">Confirmar conclusão?</span>
                              <button onClick={() => atualizarStatus(pedido.id, 'concluido')} className="bg-gray-700 text-white px-5 py-2 rounded-full hover:bg-gray-800 font-bold text-sm">SIM</button>
                              <button onClick={() => setConfirmando(null)} className="bg-gray-300 text-gray-700 px-5 py-2 rounded-full hover:bg-gray-400 font-bold text-sm">NÃO</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmando(pedido.id)} className="bg-gray-700 text-white px-6 py-3 rounded-full hover:bg-gray-800 font-bold text-sm">
                              Concluir Pedido
                            </button>
                          )}

                          {/* Editar */}
                          <button
                            onClick={() => iniciarEdicao(pedido)}
                            title="Editar pedido"
                            className="ml-auto text-gray-400 hover:text-[#0F1B3F] transition p-2 rounded-full hover:bg-gray-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2.414a2 2 0 01.586-1.414z" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}