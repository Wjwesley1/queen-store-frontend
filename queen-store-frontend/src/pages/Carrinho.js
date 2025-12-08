// src/pages/Carrinho.js — VERSÃO FINAL COM MODAL + ZERA CARRINHO + NOVA SESSÃO
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrinho } from '../App';
import axios from 'axios';

const API_URL = 'https://queen-store-api.onrender.com';

// VALIDADOR DE EMAIL
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default function Carrinho() {
  const { carrinho, carregarCarrinho } = useCarrinho();

  const [modalAberto, setModalAberto] = useState(false);
  const [dadosCliente, setDadosCliente] = useState({
    nome: '',
    email: '',
    whatsapp: ''
  });

  const updateQuantidade = async (produto_id, novaQuantidade) => {
    const sessionId = localStorage.getItem('queen_session') || '';
    if (novaQuantidade < 1) {
      await axios.delete(`${API_URL}/api/carrinho/${produto_id}`, {
        headers: { 'x-session-id': sessionId }
      });
    } else {
      await axios.put(`${API_URL}/api/carrinho/${produto_id}`, { quantidade: novaQuantidade }, {
        headers: { 'x-session-id': sessionId }
      });
    }
    carregarCarrinho();
  };

  const total = carrinho.reduce((sum, item) => sum + (parseFloat(item.preco) || 0) * item.quantidade, 0).toFixed(2);

  const mensagem = carrinho
    .map(p => `${p.nome} × ${p.quantidade} - R$ ${(parseFloat(p.preco) * p.quantidade).toFixed(2)}`)
    .join('\n');

  const salvarPedidoEFinalizar = async () => {
    if (!dadosCliente.nome || !dadosCliente.whatsapp) {
      alert('Preencha nome e WhatsApp, rainha!');
      return;
    }

    if (dadosCliente.email && !isValidEmail(dadosCliente.email)) {
      alert('Digite um e-mail válido!');
      return;
    }

    const sessionId = localStorage.getItem('queen_session') || '';

    try {
      // 1. SALVA O PEDIDO NO BANCO
      await axios.post(`${API_URL}/api/pedidos`, {
        cliente_nome: dadosCliente.nome,
        cliente_whatsapp: dadosCliente.whatsapp.replace(/\D/g, ''),
        cliente_email: dadosCliente.email || 'Não informado',
        itens: carrinho.map(i => ({
          nome: i.nome,
          quantidade: i.quantidade,
          preco: parseFloat(i.preco)
        })),
        valor_total: parseFloat(total)
      });

      // 2. ZERA O CARRINHO NO BACKEND
      await Promise.all(
        carrinho.map(item =>
          axios.delete(`${API_URL}/api/carrinho/${item.produto_id}`, {
            headers: { 'x-session-id': sessionId }
          })
        )
      );

      // 3. GERA NOVA SESSÃO PRA EVITAR CONFLITO
      const novaSessao = 'web_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('queen_session', novaSessao);

      // 4. RECARREGA O CARRINHO (vai ficar vazio)
      carregarCarrinho();

      // 5. ALERTA DE SUCESSO
      const alert = document.createElement('div');
      alert.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-600 text-white px-12 py-6 rounded-full shadow-2xl z-50 text-3xl font-bold animate-pulse';
      alert.textContent = 'PEDIDO ENVIADO COM SUCESSO!';
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 5000);

      // 6. ABRE WHATSAPP PERSONALIZADO
      const mensagemFinal = encodeURIComponent(
        `Olá, Rainha! Aqui é ${dadosCliente.nome}\n\nMeu pedido:\n\n${mensagem}\n\nTotal: R$ ${total}\n\nObrigada!`
      );
      window.open(`https://wa.me/5531972552077?text=${mensagemFinal}`, '_blank');

      setModalAberto(false);

    } catch (err) {
      console.error('Erro ao finalizar:', err);
      alert('Erro ao salvar, mas WhatsApp vai abrir');
      window.open(`https://wa.me/5531972552077?text=${encodeURIComponent(mensagem)}`, '_blank');
    }
  };

  if (carrinho.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 text-center">
        <h1 className="text-5xl font-bold text-[#0F1B3F] mb-8">Seu carrinho está vazio</h1>
        <Link to="/" className="bg-[#0F1B3F] text-white px-12 py-6 rounded-full text-2xl font-bold hover:bg-[#1a2d5e] transition shadow-2xl">
          Continuar Comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-[#0F1B3F] mb-10 md:mb-12">Seu Carrinho</h1>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {carrinho.map(item => (
            <div key={item.produto_id} className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 border-b last:border-0 hover:bg-pink-50 transition">
              <div className="w-28 h-28 md:w-36 md:h-36 bg-cover bg-center rounded-2xl shadow-lg flex-shrink-0" 
                   style={{ backgroundImage: `url(${item.imagem || 'https://i.ibb.co/0jG4vK8/geleia-maracuja.jpg'})` }}></div>

              <div className="flex-1 text-center md:text-left px-2 md:px-4">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{item.nome}</h3>
                <p className="text-[#0F1B3F] font-bold text-lg md:text-xl mt-1">
                  R$ {parseFloat(item.preco).toFixed(2)} cada
                </p>
              </div>

              <div className="flex items-center gap-4 md:gap-6">
                <button onClick={() => updateQuantidade(item.produto_id, item.quantidade - 1)}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-200 hover:bg-gray-300 text-2xl md:text-3xl font-bold text-gray-700 transition">−</button>
                <span className="w-16 text-center text-2xl md:text-3xl font-bold text-[#0F1B3F]">{item.quantidade}</span>
                <button onClick={() => updateQuantidade(item.produto_id, item.quantidade + 1)}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0F1B3F] text-white hover:bg-[#1a2d5e] text-2xl md:text-3xl font-bold transition shadow-lg">+</button>
              </div>

              <div className="text-center px-4">
                <p className="text-2xl md:text-3xl font-bold text-[#0F1B3F]">
                  R$ {(parseFloat(item.preco) * item.quantidade).toFixed(2)}
                </p>
              </div>

              <button onClick={() => updateQuantidade(item.produto_id, 0)}
                className="text-red-600 hover:text-red-800 font-bold transition mt-2 md:mt-0">
                Remover
              </button>
            </div>
          ))}

          <div className="bg-gradient-to-r from-[#0F1B3F] to-[#1a2d5e] text-white p-10 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-10">
              <p className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Total do Pedido</p>
              <p className="text-4xl md:text-5xl font-bold">R$ {total}</p>
            </div>

            <div className="text-center">
              <button
                onClick={() => setModalAberto(true)}
                className="inline-block bg-gradient-to-r from-[#0F1B3F] to-[#1a2d5e] hover:from-[#1a2d5e] hover:to-[#0F1B3F] text-white px-12 md:px-16 py-6 md:py-8 rounded-full text-2xl md:text-3xl font-bold transition transform hover:scale-105 shadow-2xl"
              >
                FINALIZAR PEDIDO
              </button>
            </div>

            <p className="text-center text-white/80 mt-6 text-sm md:text-base">
              Frete grátis acima de R$ 150 • Entrega em todo Brasil
            </p>
          </div>
        </div>

        <div className="text-center mt-8 md:mt-10">
          <Link to="/" className="text-[#0F1B3F] hover:underline font-bold text-lg md:text-xl">
            ← Continuar Comprando
          </Link>
        </div>
      </div>

      {/* MODAL DE DADOS DO CLIENTE */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 max-w-xl w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1B3F] text-center mb-6 md:mb-8">
              Quase lá, rainha!
            </h2>
            <p className="text-center text-lg md:text-xl text-gray-700 mb-6 md:mb-8">
              Só falta seus dados pra gente te chamar pelo nome
            </p>

            <div className="space-y-4 md:space-y-6">
              <input
                type="text"
                placeholder="Seu nome completo"
                value={dadosCliente.nome}
                onChange={e => setDadosCliente({...dadosCliente, nome: e.target.value})}
                className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl border-4 border-[#0F1B3F] text-lg md:text-xl focus:outline-none focus:border-pink-500"
                required
              />

              <div className="relative">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={dadosCliente.email}
                  onChange={e => setDadosCliente({...dadosCliente, email: e.target.value})}
                  className={`w-full px-6 md:px-8 py-4 md:py-5 rounded-xl border-4 text-lg md:text-xl focus:outline-none transition-all ${
                    dadosCliente.email && !isValidEmail(dadosCliente.email)
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-[#0F1B3F] focus:border-pink-500'
                  }`}
                />
                {dadosCliente.email && !isValidEmail(dadosCliente.email) && (
                  <p className="text-red-600 text-sm mt-2">
                    Digite um e-mail válido
                  </p>
                )}
              </div>

              <input
                type="tel"
                placeholder="WhatsApp com DDD (ex: 31988887777)"
                value={dadosCliente.whatsapp}
                onChange={e => setDadosCliente({...dadosCliente, whatsapp: e.target.value})}
                className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl border-4 border-[#0F1B3F] text-lg md:text-xl focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <div className="flex gap-4 md:gap-6 mt-8 md:mt-10">
              <button
                onClick={salvarPedidoEFinalizar}
                disabled={!dadosCliente.nome || !dadosCliente.whatsapp || (dadosCliente.email && !isValidEmail(dadosCliente.email))}
                className={`flex-1 py-4 md:py-5 rounded-full text-lg md:text-2xl font-bold transition-all ${
                  !dadosCliente.nome || !dadosCliente.whatsapp || (dadosCliente.email && !isValidEmail(dadosCliente.email))
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#0F1B3F] to-[#1a2d5e] text-white hover:scale-105 shadow-xl'
                }`}
              >
                ENVIAR PEDIDO
              </button>
              <button
                onClick={() => setModalAberto(false)}
                className="flex-1 bg-gray-400 text-white py-4 md:py-5 rounded-full text-lg md:text-2xl font-bold hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}