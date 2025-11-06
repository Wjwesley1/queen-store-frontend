// src/Carrinho.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Carrinho() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    axios.get(`${API_URL}/api/carrinho`)
      .then(res => {
        setItens(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const total = itens.reduce((sum, item) => sum + (item.preco * item.quantidade), 0).toFixed(2);

  if (loading) return <div className="text-center py-20">Carregando carrinho...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-primary text-center mb-4">Seu Carrinho</h1>
        <p className="text-center text-gray-600 mb-12">Revise seus itens antes de finalizar</p>

        {itens.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 mb-6">Seu carrinho está vazio</p>
            <Link to="/" className="btn-primary">Continuar Comprando</Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {itens.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">Soap</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-dark">{item.nome}</h3>
                    <p className="text-sm text-gray-600">R$ {item.preco} × {item.quantidade}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md ml-auto">
              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total:</span>
                <span className="text-primary">R$ {total}</span>
              </div>
              <button className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-secondary transition shadow-button">
                Finalizar Compra
              </button>
              <Link to="/" className="block text-center mt-4 text-primary hover:underline">
                ← Continuar Comprando
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}