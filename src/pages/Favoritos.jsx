import React from 'react';
import { useFavoritos } from '../context/FavoritosContext';
import ProductCard from '../components/product/ProductCard';

export default function Favoritos() {
  const { favoritos } = useFavoritos();

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6 max-w-5xl">
        <h1 className="text-4xl font-bold text-[#0F1B3F] mb-10">Seus Favoritos</h1>
        {favoritos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">Você ainda não salvou nenhum produto como favorito.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {favoritos.map(produto => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
