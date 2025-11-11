// src/pages/Carrinho.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useCarrinho } from '../App';

export default function Carrinho() {
  const { carrinho, removeFromCart } = useCarrinho();

  const total = carrinho.reduce((sum, item) => sum + parseFloat(item.preco) * item.quantidade, 0).toFixed(2);

  const mensagem = carrinho.map(p => `${p.nome} × ${p.quantidade}`).join('\n');
  const whatsappLink = `https://wa.me/5511999999999?text=${encodeURIComponent(
    `Olá! Quero finalizar meu pedido:\n\n${mensagem}\n\nTotal: R$ ${total}`
  )}`;

  if (carrinho.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 text-center">
        <h1 className="text-4xl font-bold text-primary mb-8">Seu carrinho está vazio</h1>
        <Link to="/" className="btn-primary text-lg px-8 py-4">Continuar Comprando</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-primary text-center mb-12">Seu Carrinho</h1>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {carrinho.map(item => (
            <div key={item.id} className="flex items-center gap-6 py-6 border-b last:border-0">
              <div className="w-24 h-24 bg-cover rounded-xl" style={{ backgroundImage: `url(${item.imagem})` }}></div>
              <div className="flex-1">
                <h3 className="font-bold text-xl">{item.nome}</h3>
                <p className="text-gray-600">R$ {item.preco} × {item.quantidade}</p>
              </div>
              <div className="text-xl font-bold text-primary">
                R$ {(item.preco * item.quantidade).toFixed(2)}
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="w-12 h-12 bg-red-500 text-white rounded-full hover:bg-red-600 transition text-2xl font-bold"
              >
                X
              </button>
            </div>
          ))}

          <div className="mt-10 text-right">
            <div className="text-3xl font-bold text-primary mb-6">Total: R$ {total}</div>
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-green-600 transition inline-block"
            >
              Finalizar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}