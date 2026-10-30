import React from 'react';
import { Link } from 'react-router-dom';
import { useFavoritos } from '../../context/FavoritosContext';
import { useCarrinho } from '../../context/CarrinhoContext';

export default function ProductCard({ produto }) {
  const { toggleFavorito, isFavorito } = useFavoritos();
  const { addToCart } = useCarrinho();

  const foto = produto.imagens?.[0] || produto.imagem || 'https://i.ibb.co/0s0qQ6Q/placeholder-queen.jpg';

  return (
    <div className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <Link to={`/produto/${produto.id}`} className="block relative overflow-hidden">
        <div
          className="aspect-square bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${foto})` }}
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {produto.badge && (
            <span className="bg-[#0F1B3F] text-white px-3 py-1 rounded-full text-xs font-bold shadow">
              {produto.badge}
            </span>
          )}
          {produto.estoque <= 5 && produto.estoque > 0 && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
              Últimas unidades
            </span>
          )}
        </div>
        {produto.estoque === 0 && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-white font-black text-lg tracking-widest">ESGOTADO</span>
          </div>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toggleFavorito(produto); }}
          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorito(produto.id) ? '#ef4444' : 'none'} stroke={isFavorito(produto.id) ? '#ef4444' : '#374151'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </Link>
      <div className="p-4">
        <h3 className="font-bold text-sm text-gray-800 line-clamp-2 mb-1">{produto.nome}</h3>
        <p className="text-[#0F1B3F] font-black text-lg mb-3">R$ {parseFloat(produto.preco).toFixed(2)}</p>
        <button
          onClick={() => produto.estoque > 0 && addToCart(produto, 1)}
          disabled={produto.estoque === 0}
          className={`w-full py-2.5 rounded-full font-bold text-sm transition-all ${
            produto.estoque === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#0F1B3F] text-white hover:bg-pink-600 shadow-sm hover:shadow-md'
          }`}
        >
          {produto.estoque === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
        </button>
      </div>
    </div>
  );
}
