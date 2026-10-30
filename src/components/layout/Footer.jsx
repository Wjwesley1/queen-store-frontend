import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  if (isAdminRoute) return null;

  return (
    <footer className="bg-[#0F1B3F] text-white py-14">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="mb-4">
              <span className="text-2xl font-black tracking-tight">QUEEN</span>
              <span className="block text-xs font-bold text-pink-400 tracking-[0.3em] uppercase">Store</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Produtos artesanais de beleza, feitos com amor e ingredientes naturais para a rainha que você é.
            </p>
          </div>
          <div>
            <p className="font-bold text-sm uppercase tracking-widest mb-4 text-white/60">Links</p>
            <div className="flex flex-col gap-2">
              <Link to="/#produtos" className="text-white/70 hover:text-white text-sm transition">Produtos</Link>
              <Link to="/#avaliacoes" className="text-white/70 hover:text-white text-sm transition">Avaliações</Link>
              <Link to="/#contato" className="text-white/70 hover:text-white text-sm transition">Contato</Link>
              <Link to="/privacidade" className="text-white/70 hover:text-white text-sm transition">Privacidade</Link>
              <Link to="/termos" className="text-white/70 hover:text-white text-sm transition">Termos de Uso</Link>
            </div>
          </div>
          <div>
            <p className="font-bold text-sm uppercase tracking-widest mb-4 text-white/60">Contato</p>
            <div className="flex flex-col gap-2 text-sm text-white/70">
              <span>contato@queenstore.store</span>
              <span>(31) 97255-2077</span>
              <a href="https://wa.me/5531972552077" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">WhatsApp →</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-white/30 text-xs">© 2026 Queen Store. Todos os direitos reservados.</p>
          <p className="text-white/30 text-xs">Feito com 💜 para todas as rainhas</p>
        </div>
      </div>
    </footer>
  );
}
