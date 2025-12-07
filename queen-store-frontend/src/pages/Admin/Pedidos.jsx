// src/pages/Admin/Pedidos.jsx — 100% FUNCIONAL E LINDO
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'https://queen-store-api.onrender.com';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await axios.patch(`${API_URL}/api/pedidos/${id}`, { status: novoStatus });
      carregarPedidos();
      alert(`Pedido #${id} marcado como ${novoStatus.toUpperCase()}!`);
    } catch (err) {
      alert('Erro ao atualizar status');
    }
  };

  const abrirWhatsApp = (whatsapp) => {
    const numero = whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/55${numero}`, '_blank');
  };

  // FUNÇÃO SEGURA PRA LER ITENS (NUNCA MAIS VAI DAR ERRO)
  const parseItens = (itens) => {
    if (!itens) return [];
    if (Array.isArray(itens)) return itens;
    if (typeof itens === 'string') {
      try {
        return JSON.parse(itens);
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-4xl text-[#0F1B3F] font-bold">
        Carregando pedidos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-5xl font-bold text-[#0F1B3F]">
              Pedidos ({pedidos.length})
            </h1>
            <Link
              to="/admin/dashboard"
              className="bg-[#0F1B3F] text-white px-8 py-4 rounded-full hover:bg-pink-600 transition text-xl font-bold"
            >
              Voltar ao Painel
            </Link>
          </div>

          {pedidos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl text-gray-600">Nenhum pedido ainda, rainha!</p>
            </div>
          ) : (
            <div className="space-y-10">
              {pedidos.map(pedido => {
                const itens = parseItens(pedido.itens);

                return (
                  <div key={pedido.id} className="bg-gradient-to-r from-pink-50 to-purple-50 p-10 rounded-3xl shadow-2xl border-l-8 border-[#0F1B3F]">
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
                        <span className={`inline-block mt-4 px-8 py-4 rounded-full text-white font-bold text-2xl ${
                          pedido.status === 'pago' ? 'bg-green-600' :
                          pedido.status === 'enviado' ? 'bg-blue-600' :
                          pedido.status === 'entregue' ? 'bg-purple-600' :
                          'bg-yellow-600'
                        }`}>
                          {pedido.status?.toUpperCase() || 'PENDENTE'}
                        </span>
                      </div>
                    </div>

                    {/* CLIENTE */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <p className="text-2xl font-bold text-[#0F1B3F]">Cliente</p>
                        <p className="text-xl">{pedido.cliente_nome}</p>
                        <button
                          onClick={() => abrirWhatsApp(pedido.cliente_whatsapp)}
                          className="mt-4 bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 transition font-bold text-xl flex items-center gap-3"
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

                    {/* ITENS DO PEDIDO */}
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

                    {/* BOTÕES DE STATUS */}
                    <div className="flex flex-wrap gap-6 justify-center">
                      {pedido.status !== 'pago' && (
                        <button onClick={() => atualizarStatus(pedido.id, 'pago')} className="bg-green-600 text-white px-10 py-5 rounded-full hover:bg-green-700 text-2xl font-bold transition">
                          Marcar como PAGO
                        </button>
                      )}
                      {pedido.status === 'pago' && pedido.status !== 'enviado' && (
                        <button onClick={() => atualizarStatus(pedido.id, 'enviado')} className="bg-blue-600 text-white px-10 py-5 rounded-full hover:bg-blue-700 text-2xl font-bold transition">
                          Marcar como ENVIADO
                        </button>
                      )}
                      {pedido.status === 'enviado' && (
                        <button onClick={() => atualizarStatus(pedido.id, 'entregue')} className="bg-purple-600 text-white px-10 py-5 rounded-full hover:bg-purple-700 text-2xl font-bold transition">
                          Marcar como ENTREGUE
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}