// src/pages/ProdutoDetalhe.js — RESPONSIVO PERFEITO: IMAGEM EM CIMA NO CELULAR
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCarrinho } from '../App';

const API_URL = 'https://queen-store-api.onrender.com';

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fotoAtiva, setFotoAtiva] = useState(0);
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
        <div className="text-4xl font-bold text-[#0F1B3F] animate-pulse">Carregando rainha...</div>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 text-center">
        <h2 className="text-5xl font-bold text-red-600 mb-8">Produto não encontrado</h2>
        <Link to="/" className="text-[#0F1B3F] text-xl hover:underline font-bold">← Voltar para loja</Link>
      </div>
    );
  }

  const fotos = produto.imagens && produto.imagens.length > 0
    ? produto.imagens
    : [produto.imagem || 'https://i.ibb.co/0jG4vK8/geleia-maracuja.jpg'];

  const estoqueEsgotado = produto.estoque <= 0;

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6 max-w-7xl">

        <Link to="/" className="inline-flex items-center text-[#0F1B3F] font-bold text-lg hover:underline mb-8 block">
          ← Voltar para loja
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* GALERIA SEMPRE EM CIMA NO MOBILE */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img
                src={fotos[fotoAtiva]}
                alt={produto.nome}
                className="w-full h-96 object-cover"
              />

              {produto.badge && (
                <div className="absolute top-6 left-6 bg-[#0F1B3F] text-white px-6 py-3 rounded-full font-bold shadow-lg">
                  {produto.badge}
                </div>
              )}

              {estoqueEsgotado && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <span className="text-white text-5xl font-bold bg-red-600 px-10 py-6 rounded-full animate-pulse">
                    ESGOTADO
                  </span>
                </div>
              )}
            </div>

            {/* MINIATURAS */}
            {fotos.length > 1 && (
              <div className="grid grid-cols-5 gap-3 p-6 bg-gray-50">
                {fotos.map((foto, index) => (
                  <button
                    key={index}
                    onClick={() => setFotoAtiva(index)}
                    className={`rounded-xl overflow-hidden border-4 transition-all duration-300 ${
                      fotoAtiva === index 
                        ? 'border-[#0F1B3F] shadow-lg scale-105' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={foto} alt={`Foto ${index + 1}`} className="w-full h-24 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* FIM GALERIA */}

          {/* INFORMAÇÕES — EMBAIXO NO MOBILE, LADO NO DESKTOP */}
          <div className="order-2 lg:order-1 p-8 lg:p-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#0F1B3F] mb-6">
              {produto.nome}
            </h1>

            <div className="flex flex-col gap-4 mb-8">
              <div className="text-4xl lg:text-5xl font-bold text-[#0F1B3F]">
                R$ {parseFloat(produto.preco).toFixed(2)}
              </div>
              <div className={`text-xl lg:text-2xl font-bold ${estoqueEsgotado ? 'text-red-600' : 'text-green-600'}`}>
                {estoqueEsgotado ? 'Esgotado' : `${produto.estoque} unidades em estoque`}
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {produto.descricao || "Sabonete artesanal premium feito com ingredientes 100% naturais e amor."}
            </p>

            {/* FRASE PROMOCIONAL */}
            {produto.frase_promocional && (
              <div className="bg-gradient-to-r from-[#0F1B3F] to-[#1a2d5e] text-white p-8 rounded-2xl text-center shadow-2xl mb-8">
                <p className="text-xl lg:text-2xl font-bold italic">
                  "{produto.frase_promocional}"
                </p>
              </div>
            )}

            <button
              onClick={() => !estoqueEsgotado && addToCart(produto)}
              disabled={estoqueEsgotado}
              className={`w-full py-6 rounded-2xl text-2xl font-bold transition-all transform hover:scale-105 shadow-2xl ${
                estoqueEsgotado
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-[#0F1B3F] text-white hover:bg-[#1a2d5e]'
              }`}
            >
              {estoqueEsgotado ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
            </button>

            <p className="text-center text-gray-600 mt-8 text-lg">
              Frete grátis acima de R$ 150 • Entrega em todo Brasil
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}