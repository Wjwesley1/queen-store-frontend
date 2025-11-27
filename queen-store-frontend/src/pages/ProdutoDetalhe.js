// src/pages/ProdutoDetalhe.js — GALERIA PROFISSIONAL + VÁRIAS FOTOS
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCarrinho } from '../App';

const API_URL = 'https://queen-store-api.onrender.com';

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  );
  const [loading, setLoading] = useState(true);
  const [fotoAtiva, setFotoAtiva] = useState(0); // ← NOVA: controla a foto grande
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

  // PEGA AS FOTOS — SUPORTA: imagens (array JSON) OU imagem (string antiga)
  const fotos = produto.imagens && produto.imagens.length > 0
    ? produto.imagens
    : [produto.imagem || 'https://i.ibb.co/0s0qQ6Q/placeholder-queen.jpg'];

  const estoqueEsgotado = produto.estoque <= 0;

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6 max-w-7xl">

        <Link to="/" className="inline-flex items-center text-[#0F1B3F] font-bold text-lg hover:underline mb-10">
          ← Voltar para loja
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* === GALERIA DE FOTOS === */}
          <div className="order-2 lg:order-1">
            {/* Foto principal */}
            <div className="relative">
              <img
                src={fotos[fotoAtiva]}
                alt={produto.nome}
                className="w-full h-96 lg:h-full object-cover rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none shadow-2xl"
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

            {/* Miniaturas */}
            {fotos.length > 1 && (
              <div className="grid grid-cols-5 gap-3 p-6 bg-gray-50">
                {fotos.map((foto, index) => (
                  <button
                    key={index}
                    onClick={() => setFotoAtiva(index)}
                    className={`rounded-xl overflow-hidden border-4 transition-all duration-300 ${
                      fotoAtiva === index ? 'border-[#0F1B3F] shadow-lg scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={foto} alt={`Miniatura ${index + 1}`} className="w-full h-24 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* === INFORMAÇÕES DO PRODUTO === */}
          <div className="order-1 lg:order-2 p-10 flex flex-col justify-center">
            <h1 className="text-5xl font-bold text-[#0F1B3F] mb-6">{produto.nome}</h1>

            <div className="flex flex-col gap-4 mb-8">
              <div className="text-5xl font-bold text-[#0F1B3F]">
                R$ {parseFloat(produto.preco).toFixed(2)}
              </div>
              <div className={`text-2xl font-bold ${estoqueEsgotado ? 'text-red-600' : 'text-green-600'}`}>
                {estoqueEsgotado ? 'Esgotado' : `${produto.estoque} unidades em estoque`}
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {produto.descricao || "Sabonete artesanal premium feito com ingredientes 100% naturais e amor. Perfeito para cuidar da sua pele como uma rainha merece."}
            </p>

            {produto.ingredientes && (
              <div className="mb-8 bg-gray-50 p-6 rounded-2xl">
                <h3 className="font-bold text-lg mb-3 text-[#0F1B3F]">Ingredientes principais:</h3>
                <p className="text-gray-700 italic">{produto.ingredientes}</p>
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