/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0f2c59', // Azul escuro original
        secondary: '#4a6fa5', // Azul médio
        accent: '#f5a623', // Amarelo mostarda
        neutral: '#f5f5f4', // Bege claro (fundo suave)
        white: '#ffffff',
      },
      fontFamily: {
        helo: ['"Playfair Display"', 'serif'], // Fallback para Helo Paris
        roboto: ['Roboto', 'sans-serif'], // Para textos gerais
      },
      animation: {
        floating: 'floating 3s ease-in-out infinite',
      },
      keyframes: {
        floating: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};