import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  if (isAdminRoute) return null;

  return (
    <footer className="bg-[#0F1B3F] text-white py-12 sm:py-16 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 mb-10 sm:mb-12">
          {/* SOBRE A MARCA */}
          <div>
            <div className="mb-4">
              <span className="text-2xl font-black tracking-tight">QUEEN</span>
              <span className="block text-xs font-bold text-pink-400 tracking-[0.3em] uppercase">
                Store
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Produtos artesanais de beleza, feitos com amor e ingredientes
              naturais selecionados para a rainha que você é.
            </p>
          </div>

          {/* LINKS RÁPIDOS */}
          <div>
            <p className="font-bold text-xs uppercase tracking-widest mb-4 text-white/50">
              Navegação
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href="/#produtos"
                className="text-white/70 hover:text-white text-sm transition"
              >
                Produtos
              </a>
              <a
                href="/#avaliacoes"
                className="text-white/70 hover:text-white text-sm transition"
              >
                Depoimentos
              </a>
              <a
                href="/#contato"
                className="text-white/70 hover:text-white text-sm transition"
              >
                Fale Conosco
              </a>
              <Link
                to="/privacidade"
                className="text-white/70 hover:text-white text-sm transition"
              >
                Política de Privacidade
              </Link>
              <Link
                to="/termos"
                className="text-white/70 hover:text-white text-sm transition"
              >
                Termos de Uso
              </Link>
            </div>
          </div>

          {/* CONTATO & WHATSAPP */}
          <div>
            <p className="font-bold text-xs uppercase tracking-widest mb-4 text-white/50">
              Atendimento
            </p>
            <div className="flex flex-col gap-2.5 text-sm text-white/70">
              <p>Segunda a Sábado: 09h às 18h</p>
              <a
                href="mailto:contato@queenstore.store"
                className="hover:text-white transition"
              >
                contato@queenstore.store
              </a>
              <a
                href="https://wa.me/5531972552077"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-pink-400 hover:text-pink-300 font-semibold transition"
              >
                (31) 97255-2077 (WhatsApp) →
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <p className="text-white/40 text-xs">
            © 2026 Queen Store. Todos os direitos reservados.
          </p>
          <p className="text-white/40 text-xs">
            Feito com 💜 para todas as rainhas
          </p>
        </div>
      </div>
    </footer>
  );
}
