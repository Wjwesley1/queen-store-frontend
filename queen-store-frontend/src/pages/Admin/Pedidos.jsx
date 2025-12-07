// src/pages/Admin/Pedidos.jsx — PÁGINA DE PEDIDOS COMPLETA
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
    } catch (err) {
      alert('Erro ao atualizar status');
    }
  };

  const abrirWhatsApp = (whatsapp) => {
    window.open(`https://wa.me/55${whatsapp.replace(/\D/g, '')}`, '_blank');
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-4xl text-[#0F1B3F]">Carregando pedidos...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-5xl font-bold text-[#0F1B3F]">Pedidos ({pedidos.length})</h1>
            <Link to="/admin/dashboard" className="bg-[#0F1B3F] text-white px-8 py-4 rounded-full hover:bg-pink-600 transition text-xl font-bold">
              Voltar ao Dashboard 
            </Link>
          </div>

          {pedidos.length === 0 ? (
            <p className="text-center text-3xl text-gray-600 py-20">Nenhum pedido ainda, rainha!</p>
          ) : (
            <div className="space-y-8">
              {pedidos.map(pedido => (
                <div key={pedido.id} className="bg-gradient-to-r from-pink-50 to-purple-50 p-8 rounded-3xl shadow-xl border-l-8 border-[#0F1B3F]">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-2xl font-bold text-[#0F1B3F">Pedido #{pedido.id}</p>
                      <p className="text-lg text-gray-600">{new Date(pedido.criado_em).toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-green-600">R$ {parseFloat(pedido.valor_total).toFixed(2)}</p>
                      <span className={`inline-block mt-3 px-6 py-3 rounded-full text-white font-bold text-xl ${
                        pedido.status === 'pago' ? 'bg-green-600' :
                        pedido.status === 'enviado' ? 'bg-blue-600' :
                        pedido.status === 'entregue' ? 'bg-purple-600' :
                        'bg-yellow-600'
                      }`}>
                        {pedido.status?.toUpperCase() || 'PENDENTE'}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-6">
                    <div>
                      <p className="font-bold text-xl">Cliente:</p>
                      <p className="text-lg">{pedido.cliente_nome}</p>
                      <button
                        onClick={() => abrirWhatsApp(pedido.cliente_whatsapp)}
                        className="mt-2 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition font-bold"
                      >
                        WhatsApp: {pedido.cliente_whatsapp}
                      </button>
                    </div>
                    <div>
                      <p className="font-bold text-xl">Endereço:</p>
                      <p className="text-lg">
                        {pedido.endereco}, {pedido.cidade} - {pedido.estado}<br />
                        CEP: {pedido.cep}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="font-bold text-xl mb-3">Itens do pedido:</p>
                    <div className="bg-white p-6 rounded-2xl">
                      {JSON.parse(pedido.itens || '[]').map((item, i) => (
                        <div key={i} className="flex justify-between py-2 border-b last:border-0">
                          <span>{item.quantidade}x {item.nome}</span>
                          <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* BOTÕES DE AÇÃO */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    {pedido.status !== 'pago' && (
                      <button onClick={() => atualizarStatus(pedido.id, 'pago')} className="bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 text-xl font-bold">
                        Marcar como PAGO
                      </button>
                    )}
                    {pedido.status !== 'enviado' && pedido.status === 'pago' && (
                      <button onClick={() => atualizarStatus(pedido.id, 'enviado')} className="bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 text-xl font-bold">
                        Marcar como ENVIADO
                      </button>
                    )}
                    {pedido.status !== 'entregue' && pedido.status === 'enviado' && (
                      <button onClick={() => atualizarStatus(pedido.id, 'entregue')} className="bg-purple-600 text-white px-8 py-4 rounded-full hover:bg-purple-700 text-xl font-bold">
                        Marcar como ENTREGUE
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}