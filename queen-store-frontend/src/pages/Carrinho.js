// src/pages/Carrinho.js — VERSÃO 100% CORRIGIDA E FUNCIONANDO COM TEU BACKEND ATUAL
import React from 'react';
import { Link } from 'react-router-dom';
import { useCarrinho } from '../App';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://queen-store-api.onrender.com',
  headers: { 'session': localStorage.getItem('queen_session') || '' }
});

export default function Carrinho() {
  const { carrinho, carregarCarrinho } = useCarrinho();

  const updateQuantidade = async (produto_id, novaQuantidade) => {
    if (novaQuantidade < 1) {
      await api.delete(`/api/carrinho/${produto_id}`);
    } else {
      await api.put(`/api/carrinho/${produto_id}`, { quantidade: novaQuantidade });
    }
    carregarCarrinho();
  };

  // CORRIGIDO: usa "preco" (não preco_unitario)
  const total = carrinho.reduce((sum, item) => sum + (parseFloat(item.preco) || 0) * item.quantidade, 0).toFixed(2);

  const mensagem = carrinho
    .map(p => `\( {p.nome} × \){p.quantidade} - R$ ${(parseFloat(p.preco) * p.quantidade).toFixed(2)}`)
    .join('\n');

  const whatsappLink = `https://wa.me/5531972552077?text=${encodeURIComponent(
    `Olá, Rainha! Quero finalizar meu pedido:\n\n\( {mensagem}\n\nTotal: R \) ${total}\n\nObrigada!`
  )}`;

  if (carrinho.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 text-center">
        <h1 className="text-5xl font-bold text-[#0F1B3F] mb-8">Seu carrinho está vazio</h1>
        <Link to="/" className="bg-[#0F1B3F] text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-[#1a2d5e] transition shadow-xl">
          Continuar Comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold text-center text-[#0F1B3F] mb-12">Seu Carrinho</h1>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {carrinho.map(item => (
            <div key={item.produto_id} className="flex items-center gap-6 p-8 border-b last:border-0 hover:bg-gray-50 transition">
              <div className="w-28 h-28 bg-cover bg-center rounded-2xl shadow-lg" style={{ backgroundImage: `url(${item.imagem || '/placeholder.jpg'})` }}></div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">{item.nome}</h3>
                <p className="text-[#0F1B3F] font-bold">R$ {parseFloat(item.preco).toFixed(2)} cada</p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => updateQuantidade(item.produto_id, item.quantidade - 1)}
                  className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-2xl font-bold text-gray-700"
                >−</button>
                <span className="w-16 text-center text-2xl font-bold text-[#0F1B3F]">{item.quantidade}</span>
                <button
                  onClick={() => updateQuantidade(item.produto_id, item.quantidade + 1)}
                  className="w-12 h-12 rounded-full bg-[#0F1B3F] text-white hover:bg-[#1a2d5e] text-2xl font-bold shadow-lg"
                >+</button>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-[#0F1B3F]">
                  R$ {(parseFloat(item.preco) * item.quantidade).toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => updateQuantidade(item.produto_id, 0)}
                className="text-red-600 hover:text-red-800 font-bold text-lg"
              >
                Remover
              </button>
            </div>
          ))}

          <div className="bg-gradient-to-r from-[#0F1B3F] to-[#1a2d5e] text-white p-10">
            <div className="flex justify-between items-center mb-6">
              <p className="text-3xl font-bold">Total do Pedido</p>
              <p className="text-4xl font-bold">R$ {total}</p>
            </div>

            <div className="text-center">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 hover:bg-green-600 text-white px-12 py-6 rounded-full text-2xl font-bold transition transform hover:scale-105 shadow-2xl"
              >
                Finalizar no WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link to="/" className="text-[#0F1B3F] hover:underline font-bold text-lg">
            ← Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}