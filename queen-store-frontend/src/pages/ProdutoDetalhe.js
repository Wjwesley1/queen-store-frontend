// src/pages/ProdutoDetalhe.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCarrinho } from '../App';

const API_URL = 'https://seasons-admissions-arctic-height.trycloudflare.com';

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCarrinho();

  useEffect(() => {
    axios.get(`${API_URL}/api/produtos/${id}`)
      .then(res => {
        setProduto(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20">Carregando...</div>;
  if (!produto) return <div className="text-center py-20">Produto não encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <Link to="/" className="text-primary hover:underline mb-8 inline-block">← Voltar</Link>
        
        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl p-10">
          <div className="product-image-large" style={{ backgroundImage: `url(${produto.imagem})` }}></div>
          
          <div className="flex flex-col justify-center">
            {produto.badge && <div className="product-badge mb-4 inline-block">{produto.badge}</div>}
            <h1 className="text-5xl font-bold text-primary mb-4">{produto.nome}</h1>
            <p className="text-2xl font-bold text-dark mb-6">R$ {produto.preco}</p>
            <p className="text-gray-700 mb-8 leading-relaxed">{produto.descricao || "Sabonete artesanal premium com ingredientes 100% naturais."}</p>
            
            <button 
              onClick={() => addToCart(produto)}
              className="btn-add-cart text-xl py-5"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}