// src/components/LoadingQueen.jsx — COROA OFICIAL DA RAINHA
import React from 'react';

export default function LoadingQueen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="text-center">
        {/* COROA OFICIAL EM AZUL ROYAL #0F1B3F */}
        <svg
          className="w-32 h-32 mx-auto animate-spin-slow drop-shadow-2xl"
          viewBox="0 0 100 100"
          fill="none"
          stroke="#0F1B3F"
          strokeWidth="6"
        >
          <path d="M50 10 L62 38 L92 42 L68 62 L74 90 L50 75 L26 90 L32 62 L8 42 L38 38 Z" />
          <circle cx="50" cy="30" r="6" fill="#0F1B3F" />
          <circle cx="35" cy="45" r="5" fill="#0F1B3F" />
          <circle cx="65" cy="45" r="5" fill="#0F1B3F" />
        </svg>

        {/* BRILHO DISCRETO */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full border-4 border-[#0F1B3F]/20 animate-ping"></div>
        </div>

        {/* TEXTO COM A COR OFICIAL */}
        <p className="mt-10 text-3xl font-bold text-[#0F1B3F] animate-fade-in-up tracking-wider">
          Bem vindo à Queen Store ...
        </p>
      </div>
    </div>
  );
}