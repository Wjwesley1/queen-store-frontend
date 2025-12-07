// src/pages/Carrinho.js — VERSÃO FINAL, PERFEITA E IMORTAL
import React from 'react';
import { Link } from 'react-router-dom';
import { useCarrinho } from '../App';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://queen-store-api.onrender.com',
  headers: { 'x-session-id': localStorage.getItem('queen_session') || '' }
});

const API_URL = 'https://queen-store-api.onrender.com';

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

  const total = carrinho.reduce((sum, item) => sum + (parseFloat(item.preco) || 0) * item.quantidade, 0).toFixed(2);

  const mensagem = carrinho
    .map(p => `${p.nome} × ${p.quantidade} - R$ ${(parseFloat(p.preco) * p.quantidade).toFixed(2)}`)
    .join('\n');

  const whatsappLink = `https://wa.me/5531972552077?text=${encodeURIComponent(
    `Olá, Rainha! Quero finalizar meu pedido:\n\n${mensagem}\n\nTotal: R$ ${total}\n\nObrigada!`
  )}`;

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-[#0F1B3F] mb-8">Seu Carrinho</h1>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {carrinho.map(item => (
            <div key={item.produto_id} className="flex flex-col md:flex-row items-center gap-4 p-6 border-b last:border-0 hover:bg-pink-50 transition">
              {/* IMAGEM */}
              <div className="w-28 h-28 bg-cover bg-center rounded-2xl shadow-lg flex-shrink-0" 
                   style={{ backgroundImage: `url(${item.imagem || 'https://i.ibb.co/0jG4vK8/geleia-maracuja.jpg'})` }}>
              </div>

              {/* INFO */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">{item.nome}</h3>
                <p className="text-[#0F1B3F] font-bold text-lg mt-1">
                  R$ {parseFloat(item.preco).toFixed(2)} cada
                </p>
              </div>

              {/* CONTROLE QUANTIDADE */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantidade(item.produto_id, item.quantidade - 1)}
                  className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-2xl font-bold text-gray-700 transition"
                >−</button>
                <span className="w-16 text-center text-2xl font-bold text-[#0F1B3F]">{item.quantidade}</span>
                <button
                  onClick={() => updateQuantidade(item.produto_id, item.quantidade + 1)}
                  className="w-12 h-12 rounded-full bg-[#0F1B3F] text-white hover:bg-[#1a2d5e] text-2xl font-bold transition shadow-lg"
                >+</button>
              </div>

              {/* TOTAL DO ITEM */}
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-[#0F1B3F]">
                  R$ {(parseFloat(item.preco) * item.quantidade).toFixed(2)}
                </p>
              </div>

              {/* REMOVER */}
              <button
                onClick={() => updateQuantidade(item.produto_id, 0)}
                className="text-red-600 hover:text-red-800 font-bold transition"
              >
                Remover
              </button>
            </div>
          ))}

          {/* RESUMO FINAL */}
          <div className="bg-gradient-to-r from-[#0F1B3F] to-[#1a2d5e] text-white p-8 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <p className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Total do Pedido</p>
              <p className="text-4xl md:text-5xl font-bold">R$ {total}</p>
            </div>

            <div className="text-center">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 hover:bg-green-600 text-white px-12 py-6 rounded-full text-xl md:text-2xl font-bold transition transform hover:scale-105 shadow-2xl"
                onClick={async () => {
                  try {
                    await axios.post(`${API_URL}/api/pedidos`, {
                      cliente_nome: "Cliente via WhatsApp",
                      cliente_whatsapp: "cliente",
                      itens: carrinho.map(i => ({
                        nome: i.nome,
                        quantidade: i.quantidade,
                        preco: parseFloat(i.preco)
                      })),
                      valor_total: total,
                      endereco: "Endereço via WhatsApp",
                      cidade: "Cidade",
                      estado: "ST",
                      cep: "00000000"
                    });
                    alert('Pedido registrado com sucesso! Em breve entraremos em contato.');
                  } catch (err) {
                    console.log("Erro ao salvar pedido, mas WhatsApp abre mesmo assim");
                  }
                }}
              >
                FINALIZAR NO WHATSAPP
              </a>
            </div>

            <p className="text-center text-white/80 mt-6 text-sm md:text-base">
              Frete grátis acima de R$ 150 • Entrega em todo Brasil
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="text-[#0F1B3F] hover:underline font-bold text-lg md:text-xl">
            ← Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}