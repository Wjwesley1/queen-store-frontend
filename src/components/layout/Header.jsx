import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCarrinho } from '../../context/CarrinhoContext';
import { useFavoritos } from '../../context/FavoritosContext';

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();
  const { cliente, logout } = useAuth();
  const { totalItens, totalValor } = useCarrinho();
  const { favoritos } = useFavoritos();

  const isAdminRoute = location.pathname.startsWith('/admin');
  if (isAdminRoute) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="flex flex-col leading-none">
          <span className="text-2xl font-black text-[#0F1B3F] tracking-tight">QUEEN</span>
          <span className="text-xs font-bold text-pink-500 tracking-[0.3em] uppercase">Store</span>
        </Link>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/#produtos" className="text-sm font-semibold text-gray-600 hover:text-[#0F1B3F] transition">Produtos</Link>
          <Link to="/#avaliacoes" className="text-sm font-semibold text-gray-600 hover:text-[#0F1B3F] transition">Avaliações</Link>
          <Link to="/#contato" className="text-sm font-semibold text-gray-600 hover:text-[#0F1B3F] transition">Contato</Link>
        </nav>

        {/* AÇÕES */}
        <div className="flex items-center gap-3">

          {/* FAVORITOS */}
          <Link to="/favoritos" className="relative p-2 text-gray-500 hover:text-red-500 transition">
            <svg width="22" height="22" viewBox="0 0 24 24" fill={favoritos.length > 0 ? '#ef4444' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {favoritos.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {favoritos.length}
              </span>
            )}
          </Link>

          {/* CARRINHO */}
          <Link to="/carrinho" className="flex items-center gap-2 bg-[#0F1B3F] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-pink-600 transition shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItens > 0 ? <span>{totalItens} · R$ {totalValor}</span> : <span>Carrinho</span>}
          </Link>

          {/* CLIENTE */}
          {cliente ? (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/minha-conta" className="text-sm font-bold text-[#0F1B3F] hover:text-pink-600 transition">
                Olá, {cliente.nome?.split(' ')[0]}!
              </Link>
              <button onClick={logout} className="text-xs text-gray-400 hover:text-gray-600 transition">Sair</button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block text-sm font-bold text-[#0F1B3F] hover:text-pink-600 transition">
              Entrar
            </Link>
          )}

          {/* MENU MOBILE BUTTON */}
          <button onClick={() => setMenuAberto(!menuAberto)} className="md:hidden p-2 text-[#0F1B3F]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuAberto
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* MENU MOBILE DROPDOWN */}
      {menuAberto && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          <Link to="/#produtos" onClick={() => setMenuAberto(false)} className="text-sm font-semibold text-gray-700">Produtos</Link>
          <Link to="/#avaliacoes" onClick={() => setMenuAberto(false)} className="text-sm font-semibold text-gray-700">Avaliações</Link>
          <Link to="/#contato" onClick={() => setMenuAberto(false)} className="text-sm font-semibold text-gray-700">Contato</Link>
          {cliente ? (
            <>
              <Link to="/minha-conta" onClick={() => setMenuAberto(false)} className="text-sm font-bold text-[#0F1B3F]">Minha Conta</Link>
              <button onClick={() => { logout(); setMenuAberto(false); }} className="text-sm text-gray-500 text-left">Sair</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuAberto(false)} className="text-sm font-bold text-[#0F1B3F]">Entrar</Link>
          )}
        </div>
      )}
    </header>
  );
}
