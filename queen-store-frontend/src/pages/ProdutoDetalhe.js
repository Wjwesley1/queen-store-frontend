// src/pages/ProdutoDetalhe.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCarrinho } from '../App';

// URL DO BACKEND NO RENDER (troca se mudar)
const API_URL = 'https://queen-store-api.onrender.com';

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCarrinho();

  useEffect(() => {
    axios.get(`${API_URL}/api/produtos`)
      .then(res => {
        const encontrado = res.data.find(p => p.id === parseInt(id));
        setProduto(encontrado || null);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar produto:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-3xl font-bold text-primary animate-pulse">Carregando produto...</div>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 text-center">
        <h2 className="text-4xl font-bold text-red-600 mb-6">Produto não encontrado</h2>
        <Link to="/" className="text-primary text-xl hover:underline">← Voltar para loja</Link>
      </div>
    );
  }

  const estoqueEsgotado = produto.estoque <= 0;

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Voltar */}
        <Link to="/" className="inline-flex items-center text-primary font-bold text-lg hover:underline mb-10">
          ← Voltar para loja
        </Link>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Imagem Grande */}
          <div className="relative">
            <div 
              className="h-96 md:h-full bg-cover bg-center"
              style={{ 
                backgroundImage: produto.imagem 
                  ? `url(${produto.imagem})` 
                  : 'linear-gradient(135deg, #e6e6fa, #dda0dd)'
              }}
            />
            {produto.badge && (
              <div className="absolute top-6 left-6 bg-primary text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg">
                {produto.badge}
              </div>
            )}
            {estoqueEsgotado && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white text-4xl font-bold bg-red-600 px-8 py-4 rounded-full animate-pulse">
                  ESGOTADO
                </span>
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="p-10 flex flex-col justify-center">
            <h1 className="text-5xl font-bold text-dark mb-4">{produto.nome}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl font-bold text-primary">R$ {produto.preco}</span>
              <span className={`text-2xl font-bold ${estoqueEsgotado ? 'text-red-600' : 'text-green-600'}`}>
                {estoqueEsgotado ? 'Esgotado' : `${produto.estoque} em estoque`}
              </span>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {produto.descricao || "Sabonete artesanal premium feito com ingredientes 100% naturais e amor. Perfeito para cuidar da sua pele como uma rainha merece."}
            </p>

            {produto.ingredientes && (
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-2">Ingredientes principais:</h3>
                <p className="text-gray-600 italic">{produto.ingredientes}</p>
              </div>
            )}

            {/* Botão Adicionar */}
            <button
              onClick={() => !estoqueEsgotado && addToCart(produto)}
              disabled={estoqueEsgotado}
              className={`text-xl font-bold py-5 rounded-full transition-all transform hover:scale-105 ${
                estoqueEsgotado
                  ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                  : 'bg-primary text-white shadow-xl hover:shadow-2xl'
              }`}
            >
              {estoqueEsgotado ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
            </button>

            <p className="text-sm text-gray-500 mt-6">
              Frete grátis acima de R$ 150 • Entrega em todo Brasil
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}