import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function MinhaConta() {
  const { cliente, loading } = useAuth();
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    if (cliente) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/cliente/pedidos`)
        .then(res => setPedidos(res.data));
    }
  }, [cliente]);

  if (loading) return <p>Carregando...</p>;
  if (!cliente) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6 max-w-5xl">
        <h1 className="text-5xl font-bold text-[#0F1B3F] text-center mb-12">
          Minha Conta
        </h1>

        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-12">
          <h2 className="text-3xl font-bold text-[#0F1B3F] mb-6">Olá, {cliente.nome}!</h2>
          <p className="text-xl text-gray-700">Email: {cliente.email}</p>
        </div>

        <h2 className="text-4xl font-bold text-[#0F1B3F] mb-8">Meus Pedidos</h2>

        {pedidos.length === 0 ? (
          <p className="text-center text-2xl text-gray-600">Nenhum pedido ainda, rainha!</p>
        ) : (
          <div className="space-y-8">
            {pedidos.map(pedido => (
              <div key={pedido.id} className="bg-gradient-to-r from-pink-50 to-purple-50 p-8 rounded-3xl shadow-xl">
                <h3 className="text-3xl font-bold text-[#0F1B3F]">Pedido #{pedido.id}</h3>
                <p>Data: {new Date(pedido.criado_em).toLocaleDateString('pt-BR')}</p>
                <p>Status: {pedido.status?.toUpperCase() || 'PENDENTE'}</p>
                <p>Total: R$ {parseFloat(pedido.valor_total).toFixed(2)}</p>
                {/* botão recomprar aqui depois */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}