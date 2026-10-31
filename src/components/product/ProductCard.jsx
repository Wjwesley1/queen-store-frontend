import React from "react";
import { Link } from "react-router-dom";
import { useFavoritos } from "../../context/FavoritosContext";
import { useCarrinho } from "../../context/CarrinhoContext";

export default function ProductCard({ produto }) {
  const { toggleFavorito, isFavorito } = useFavoritos();
  const { addToCart } = useCarrinho();

  const foto =
    produto.imagens?.[0] ||
    produto.imagem ||
    "https://i.ibb.co/0s0qQ6Q/placeholder-queen.jpg";
  const esgotado = produto.estoque === 0;

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <Link
        to={`/produto/${produto.id}`}
        className="block relative overflow-hidden bg-gray-50 aspect-square"
      >
        <img
          src={foto}
          alt={produto.nome}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* BADGES */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          {produto.badge && (
            <span className="bg-[#0F1B3F]/90 backdrop-blur-sm text-white px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow">
              {produto.badge}
            </span>
          )}
          {produto.estoque <= 5 && produto.estoque > 0 && (
            <span className="bg-red-500 text-white px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow">
              Últimas unidades
            </span>
          )}
        </div>

        {/* OVERLAY ESGOTADO */}
        {esgotado && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="text-white font-black text-xs sm:text-sm tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/20">
              ESGOTADO
            </span>
          </div>
        )}

        {/* BOTÃO FAVORITO */}
        <button
          type="button"
          aria-label="Favoritar produto"
          onClick={(e) => {
            e.preventDefault();
            toggleFavorito(produto);
          }}
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md text-gray-700 hover:text-red-500 transition-all z-10"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isFavorito(produto.id) ? "#ef4444" : "none"}
            stroke={isFavorito(produto.id) ? "#ef4444" : "currentColor"}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </Link>

      <div className="p-3.5 sm:p-5 flex flex-col flex-grow justify-between gap-3">
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-gray-800 line-clamp-2 leading-snug mb-1 group-hover:text-pink-600 transition-colors">
            {produto.nome}
          </h3>
          <p className="text-[#0F1B3F] font-black text-base sm:text-lg">
            R$ {parseFloat(produto.preco).toFixed(2)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => !esgotado && addToCart(produto, 1)}
          disabled={esgotado}
          className={`w-full py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 ${
            esgotado
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-[#0F1B3F] text-white hover:bg-pink-600 shadow-sm hover:shadow-md active:scale-95"
          }`}
        >
          {esgotado ? "Esgotado" : "Adicionar ao Carrinho"}
        </button>
      </div>
    </div>
  );
}
