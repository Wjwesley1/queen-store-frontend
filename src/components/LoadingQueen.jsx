// src/components/LoadingScreen.jsx — BARRA FLUÍDA COM BRILHO INFINITO
import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#0F1B3F] via-[#1a2d5e] to-[#0F1B3F]">

      {/* TÍTULO */}
      <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-wider mb-16 animate-pulse">
        Bem vindo à Queen Store
      </h1>

      {/* BARRA ULTRA FLUÍDA COM BRILHO */}
      <div className="relative w-80 lg:w-96 max-w-full px-8">
        <div className="h-3 bg-white/10 rounded-full overflow-hidden shadow-2xl backdrop-blur-sm">
          
          {/* BARRA DE PROGRESSO INFINITA */}
          <div className="h-full w-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-shimmer"></div>
          
          {/* BRILHO POR CIMA (EFEITO LUXO) */}
          <div className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
        </div>
      </div>

      {/* PONTINHOS DISCRETOS */}
      <div className="flex gap-4 mt-12">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-4 h-4 bg-yellow-400/60 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <p className="text-white/60 text-lg mt-10 tracking-wide">
        Preparando sua experiência real
      </p>
    </div>
  );
}