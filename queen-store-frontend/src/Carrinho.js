import React from 'react';
import { useLocation } from 'react-router-dom';

function Carrinho() {
  const location = useLocation();
  const carrinho = location.state?.carrinho || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-neutral">
      <h2 className="text-3xl font-bold font-helo text-center mb-8 text-primary">Seu Carrinho</h2>
      {carrinho.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Carrinho vazio</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {carrinho.map((produto, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
              <div
                className="h-48 flex items-center justify-center bg-gradient-to-br"
                style={{
                  background: `linear-gradient(135deg, ${
                    produto.categoria === 'Sabonete' ? '#e9d5ff, #f3e8ff' :
                    produto.categoria === 'Esfoliante' ? '#fefcbf, #fed7aa' :
                    produto.categoria === 'Hidratante' ? '#d1fae5, #99f6e4' :
                    produto.categoria === 'Óleo' ? '#fecdd3, #fee2e2' :
                    produto.categoria === 'Kit' ? '#fef9c3, #fef08a' : '#e0f2fe, #bae6fd'
                  })`,
                }}
              >
                <div className="text-6xl">{produto.categoria === 'Sabonete' ? '🧼' : produto.categoria === 'Esfoliante' ? '🍯' : produto.categoria === 'Hidratante' ? '🌺' : produto.categoria === 'Óleo' ? '🌹' : '☀️'}</div>
              </div>
              <div className="p-4">
                {produto.badge && <span className="inline-block bg-accent text-white text-xs px-2 py-1 rounded-full font-semibold mb-2">{produto.badge}</span>}
                <h3 className="text-lg font-semibold text-primary mb-2">{produto.nome}</h3>
                <p className="text-gray-600 text-sm mb-3">R$ {produto.preco.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="text-center">
        <p className="text-lg font-bold text-primary mb-4">Total: R$ {carrinho.reduce((total, p) => total + p.preco, 0).toFixed(2)}</p>
        <button className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-secondary transition-all">
          Finalizar Compra
        </button>
      </div>
    </div>
  );
}

export default Carrinho;