// src/components/LoadingQueen.jsx
import React from 'react';

export default function LoadingQueen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="relative">
        {/* COROA GRANDE GIRANDO */}
        <svg
          className="w-32 h-32 animate-spin-slow"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d946ef"
          strokeWidth="1.5"
        >
          <path d="M12 2L14.09 8.26L20.18 8.27L15.54 11.97L17.45 18.02L12 15.27L6.55 18.02L8.46 11.97L3.82 8.27L9.91 8.26L12 2Z" />
        </svg>

        {/* PARTÍCULAS DE BRILHO AO REDOR */}
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <div className="w-40 h-40 rounded-full border-4 border-pink-300 opacity-30 animate-ping"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-4 border-purple-400 opacity-20 animate-ping delay-300"></div>
        </div>

        {/* TEXTO "A RAINHA ESTÁ CHEGANDO" */}
        <div className="mt-10 text-center">
          <p className="text-2xl font-bold text-primary animate-fade-in-up">
            A Rainha está chegando...
          </p>
        </div>
      </div>
    </div>
  );
}