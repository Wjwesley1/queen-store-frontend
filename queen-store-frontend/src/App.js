// src/App.js — QUEEN STORE FRONTEND 100% COMPLETO, RESPONSIVO E IMORTAL

import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import { SpeedInsights } from "@vercel/speed-insights/react";
import LoadingQueen from './components/LoadingQueen'; 
import AdminLogin from './pages/Admin/AdminLogin.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import CadastrarProduto from './pages/Admin/CadastrarProduto.jsx';
import ControleEstoque from './pages/Admin/ControleEstoque.jsx';
import Pedidos from './pages/Admin/Pedidos.jsx';

import Carrinho from './pages/Carrinho';
import ProdutoDetalhe from './pages/ProdutoDetalhe';

// ==================== CONTEXTS ====================
const CarrinhoContext = createContext();
const FavoritosContext = createContext();

export const useCarrinho = () => useContext(CarrinhoContext);
export const useFavoritos = () => useContext(FavoritosContext);

// ==================== API CONFIG ====================
const API_URL = 'https://queen-store-api.onrender.com';

const getSessionId = () => {
  let sessionId = localStorage.getItem('queen_session');
  if (!sessionId) {
    sessionId = 'web_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('queen_session', sessionId);
  }
  return sessionId;
};

const api = axios.create({
  baseURL: API_URL,
  headers: { 'x-session-id': getSessionId() }
});

// ==================== COMPONENTE PRINCIPAL ====================
function AppContent() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [categoria, setCategoria] = useState('all');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [categorias, setCategorias] = useState([]);

  // CARREGA PRODUTOS
  useEffect(() => {
    api.get('/api/produtos')
      .then(res => {
        setProdutos(res.data.map(p => ({
          ...p,
          estoque: parseInt(p.estoque) || 0
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // CARREGA CARRINHO
  const carregarCarrinho = () => {
    api.get('/api/carrinho')
      .then(res => setCarrinho(res.data))
      .catch(() => setCarrinho([]));
  };

  useEffect(() => { carregarCarrinho(); }, []);

  // SCROLL AUTOMÁTICO QUANDO TEM # NA URL (ex: /#produtos, /#contato)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1); // remove o #
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, [location]);

  // CARREGA CATEGORIAS DO BANCO
// CARREGA CATEGORIAS DO BANCO (AGORA IGNORA MAIÚSCULA/MINÚSCULA)
useEffect(() => {
  api.get('/api/categorias')
    .then(res => {
      // Transforma tudo pra título bonito (primeira letra maiúscula)
      const formatadas = res.data.map(cat => 
        cat.trim().toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
      );
      setCategorias(formatadas);
    })
    .catch(() => {
      setCategorias(['Geleia De Banho', 'Sabonete']);
    });
}, []);

const addToCart = async (produto, quantidade = 1) => {
  if (produto.estoque < quantidade) {
    showNotification("Estoque insuficiente! 😔");
    return;
  }

  try {
    await api.post('/api/carrinho', {
      produto_id: produto.id,
      quantidade
    });
    carregarCarrinho();
    showNotification(`${quantidade} × ${produto.nome} adicionado(s) ao carrinho! 🛒✨`);
  } catch (err) {
    console.error(err);
    showNotification("Erro ao adicionar ao carrinho 😢");
  }
};

  // REMOVER DO CARRINHO
  const removeFromCart = async (produto_id) => {
    try {
      await api.delete(`/api/carrinho/${produto_id}`);
      carregarCarrinho();
      showNotification("Removido do carrinho!");
    } catch (err) {
      showNotification("Erro ao remover");
    }
  };

  // FAVORITOS
  const toggleFavorito = (produto) => {
    setFavoritos(prev =>
      prev.find(p => p.id === produto.id)
        ? prev.filter(p => p.id !== produto.id)
        : [...prev, produto]
    );
  };

  const isFavorito = (id) => favoritos.some(p => p.id === id);

  // FILTROS E CÁLCULOS
 const filtered = categoria === 'all'
  ? produtos
  : produtos.filter(p => 
      p.categoria?.trim().toLowerCase() === categoria.toLowerCase()
    );
  const totalItens = carrinho.reduce((sum, i) => sum + i.quantidade, 0);
  const totalValor = carrinho.reduce((sum, i) => sum + (i.preco * i.quantidade), 0).toFixed(2);

  // NOTIFICAÇÃO
  const showNotification = (msg) => {
    const notif = document.createElement('div');
    notif.className = 'fixed top-4 right-4 bg-primary text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-pulse font-bold text-2xl';
    notif.textContent = msg;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
  };

  const HeartIcon = ({ filled }) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"}
         stroke={filled ? "#ef4444" : "#6b7280"} strokeWidth="2"
         className="transition-all hover:scale-110 cursor-pointer">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );

if (loading) {
  return <LoadingQueen />;
}

  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavorito, isFavorito }}>
      <CarrinhoContext.Provider value={{ carrinho, addToCart, removeFromCart, carregarCarrinho }}>
        <div className="min-h-screen bg-white font-sans">

          {/* HEADER FIXADO — FUNCIONA EM TODAS AS PÁGINAS */}
          <header className="sticky top-0 z-50 bg-white shadow-lg border-b">
            <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link to="/" className="text-center sm:text-left">
                <h1 className="text-4xl font-bold text-primary"> 🎄Queen Store</h1>
                {/*<p className="text-xs text-gray-500 uppercase tracking-widest">Se cuidar é reinar.</p>*/}
              </Link>

              <nav className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
                <Link to="/#produtos" className="font-medium hover:text-primary transition">Produtos</Link>
                <Link to="/#avaliacoes" className="font-medium hover:text-primary transition">Avaliações</Link>
                <Link to="/#contato" className="font-medium hover:text-primary transition">Contato</Link>

                <Link 
                  to="/carrinho" 
                  className="bg-primary text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition"
                >
                  Carrinho {totalItens} - R$ {totalValor}
                </Link>

                <Link to="/favoritos" className="relative">
                  <HeartIcon filled={favoritos.length > 0} />
                  {favoritos.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                      {favoritos.length}
                    </span>
                  )}
                </Link>
              </nav>
            </div>
          </header>

          <Routes>
            <Route path="/" element={
              <>
              {/* HERO COM VÍDEO DE FUNDO — A RAINHA NASCEU!!! */}
              <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* VÍDEO DE FUNDO */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute w-full h-full object-cover"
                >
                  <source src="/videos/fundo-hero.mp4" type="video/mp4" />
                  Seu navegador não suporta vídeo.
                </video>

                {/* OVERLAY ROXO/ROSA COM GRADIENTE */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-pink-900/70 to-transparent"></div>

                {/* CONTEÚDO DO HERO */}
                <div className="relative z-10 container mx-auto px-6 text-center text-white">
                  <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight animate-fade-in">
                    Cuidado Natural<br />para Sua Pele
                  </h2>
                  <p className="text-xl md:text-2xl mb-10 opacity-90">
                    Sabonetes artesanais • 100% naturais • Feitos com amor e poder
                  </p>
                  <Link
                    to="/#produtos"
                    className="inline-block bg-white text-primary px-12 py-6 rounded-full text-2xl font-bold hover:scale-110 transition shadow-2xl hover:shadow-purple-500/50"
                  >
                    Conheça a Coleção
                  </Link>
                </div>

                {/* SCROLL INDICATOR */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                  <svg className="w-10 h-10 text-white opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </section>

              {/* FILTROS DINÂMICOS — VEM DO BANCO! */}
              <section className="py-8 bg-gray-100 border-b">
                <div className="container mx-auto px-6">
                  <div className="flex justify-center gap-4 flex-wrap">
                    {/* BOTÃO TODOS */}
                    <button
                      onClick={() => setCategoria('all')}
                      className={`px-8 py-3 rounded-full font-bold transition ${categoria === 'all' ? 'bg-[#0F1B3F] text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
                    >
                      Todos
                    </button>

                    {/* CATEGORIAS DO BANCO */}
                    {categorias.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategoria(cat)}
                        className={`px-8 py-3 rounded-full font-bold transition ${
                          categoria === cat ? 'bg-[#0F1B3F] text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* PRODUTOS — AGORA MOSTRA A PRIMEIRA FOTO DO ARRAY NA HOME */}
              <section id="produtos" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                  <h2 className="text-5xl font-bold text-center mb-16 text-[#0F1B3F]">
                    Nossa Coleção Premium
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filtered.map(produto => {
        // PEGA A PRIMEIRA FOTO DO ARRAY OU A ANTIGA
        const fotoPrincipal = 
          produto.imagens && produto.imagens.length > 0 
            ? produto.imagens[0] 
            : produto.imagem || 'https://i.ibb.co/0s0qQ6Q/placeholder-queen.jpg';

        return (
          <div 
            key={produto.id} 
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-all duration-300"
          >
            <Link to={`/produto/${produto.id}`}>
              <div 
                className="aspect-square bg-cover bg-center relative"
                style={{ backgroundImage: `url(${fotoPrincipal})` }}
              >
                {/* BADGE */}
                {produto.badge && (
                  <span className="absolute top-3 left-3 bg-[#0F1B3F] text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    {produto.badge}
                  </span>
                )}

                {/* POUCAS UNIDADES */}
                {produto.estoque <= 5 && produto.estoque > 0 && (
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full animate-pulse font-bold shadow-lg">
                    Poucas unidades!
                  </span>
                )}

                {/* ESGOTADO */}
                {produto.estoque === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl tracking-wider">
                      ESGOTADO
                    </span>
                  </div>
                )}
              </div>
            </Link>

            <div className="p-4">
              <h3 className="font-bold text-sm line-clamp-2 mb-2 text-gray-800">
                {produto.nome}
              </h3>
              <p className="text-[#0F1B3F] font-bold text-xl mb-4">
                R$ {parseFloat(produto.preco).toFixed(2)}
              </p>

              <button
                onClick={() => produto.estoque > 0 && addToCart(produto, 1)}
                disabled={produto.estoque === 0}
                className={`w-full py-3 rounded-full font-bold transition-all ${
                  produto.estoque === 0
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-[#0F1B3F] text-white hover:bg-[#1a2d5e] hover:shadow-xl'
                }`}
              >
                {produto.estoque === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

{/* AVALIAÇÕES — AGORA COM DEPOIMENTOS REAIS DAS CLIENTES */}

<section id="avaliacoes" className="py-20 bg-gradient-to-b from-white to-pink-50">
  <div className="container mx-auto px-6 text-center">
    <h2 className="text-5xl lg:text-6xl font-bold text-[#0F1B3F] mb-4">
      O Que Nossas Rainhas Dizem
    </h2>

    <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
      {/* Avaliação 1 - Nayara */}
      <div className="bg-white p-10 rounded-3xl shadow-2xl hover:shadow-pink-200 transition-all hover:scale-105">
        <div className="text-yellow-500 text-3xl mb-6">★★★★★</div>
        <p className="text-gray-700 text-lg italic leading-relaxed mb-8">
          “As geleias de banho são simplesmente maravilhosas! Além de terem fragrâncias deliciosas, elas realmente fixam na pele e deixam uma hidratação incrível.”
        </p>
        <p className="flex justify-center gap-1 mb-4">
          <span className="text-4xl">🜲</span>
        </p>
        <p className="font-bold text-[#0F1B3F] text-xl">— Nayara Estefany</p>
      </div>

      {/* Avaliação 2 - Lorrany */}
      <div className="bg-white p-10 rounded-3xl shadow-2xl hover:shadow-pink-200 transition-all hover:scale-105 border-4 border-pink-200">
        <div className="text-yellow-500 text-3xl mb-6">★★★★★</div>
        <p className="text-gray-700 text-lg italic leading-relaxed mb-8">
          “O sabonete em barra de camomila e erva-doce é um sensorial completo. Ele acalma a pele e a mente. Ótimo para dias de TPM”
        </p>
        <p className="flex justify-center gap-1 mb-4">
          <span className="text-4xl">🜲</span>
        </p>
        <p className="font-bold text-[#0F1B3F] text-xl">— Lorrany Vitória</p>
      </div>

      {/* Avaliação 3 - Camila */}
      <div className="bg-white p-10 rounded-3xl shadow-2xl hover:shadow-pink-200 transition-all hover:scale-105">
        <div className="text-yellow-500 text-3xl mb-6">★★★★★</div>
        <p className="text-gray-700 text-lg italic leading-relaxed mb-8">
          “Eu amei as geleias de banho. Comprei o de limão siciliano e o de maracujá azedo — são muito gostosos.”
        </p>
        <p className="flex justify-center gap-1 mb-4">
          <span className="text-4xl">🜲</span>
        </p>
        <p className="font-bold text-[#0F1B3F] text-xl">— Camila Schirmer</p>
      </div>
    </div>
  </div>
</section>

                {/* CONTATO */}
                <section id="contato" className="py-20 bg-white">
                  <div className="container mx-auto px-6 text-center">
                    <h2 className="text-5xl font-bold mb-8">Fale com a Rainha</h2>
                    <p className="text-xl text-gray-600 mb-12">Dúvidas? Pedidos personalizados? Estamos aqui pra te atender como você merece.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-8 max-w-2xl mx-auto">
                      <a href="https://wa.me/5531972552077" className="bg-green-500 text-white px-10 py-6 rounded-2xl font-bold text-xl hover:scale-110 transition shadow-2xl">
                        WhatsApp
                      </a>
                      <a href="mailto:contato@queenstore.store" className="bg-primary text-white px-10 py-6 rounded-2xl font-bold text-xl hover:scale-110 transition shadow-2xl">
                        Email
                      </a>
                    </div>
                  </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-gray-900 text-white py-12">
                  <div className="container mx-auto px-6 text-center">
                    <h3 className="text-4xl font-bold mb-4">🎄Queen Store</h3>
                    <p className="text-gray-400 mb-6">Se cuidar é reinar.</p>
                    <p className="text-sm">© 2025 Queen Store • Todos os direitos reservados • Feito com amor no Brasil</p>
                  </div>
                </footer>
              </>
            } />

            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/produto/:id" element={<ProdutoDetalhe />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              localStorage.getItem('admin-logado') ? <AdminDashboard /> : <Navigate to="/admin" />
            } />
            <Route path="/admin/cadastrar" element={
              localStorage.getItem('admin-logado') ? <CadastrarProduto /> : <Navigate to="/admin" />
            } />
            <Route path="/admin/estoque" element={
              localStorage.getItem('admin-logado') ? <ControleEstoque /> : <Navigate to="/admin" />
            } />

            <Route path="/favoritos" element={
              <div className="min-h-screen bg-gray-50 py-20">
                <div className="container mx-auto px-6">
                  <h1 className="text-5xl font-bold text-primary text-center mb-16">Seus Favoritos</h1>
                  {favoritos.length === 0 ? (
                    <p className="text-center text-2xl text-gray-600">Você ainda não salvou nenhum favorito</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {favoritos.map(p => (
                        <div key={p.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition">
                          <Link to={`/produto/${p.id}`}>
                            <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${p.imagem})` }} />
                          </Link>
                          <div className="p-4">
                            <h3 className="font-bold">{p.nome}</h3>
                            <p className="text-primary font-bold text-xl">R$ {p.preco}</p>
                            <button onClick={() => addToCart(p)} className="w-full mt-3 bg-primary text-white py-3 rounded-full font-bold">
                              Adicionar ao carrinho
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            } />

            <Route 
              path="/admin/pedidos" 
              element={
                localStorage.getItem('admin-logado') === 'true' 
            ? <Pedidos /> 
            : <Navigate to="/admin" />
        } 
      />

          </Routes>
        </div>
      </CarrinhoContext.Provider>
    </FavoritosContext.Provider>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
      <SpeedInsights apiKey="vck_3jIZl0d8gS3CGvUi1rDhQ2ifKf0AH5b3rOO7e7MuOjLiUTcBEH1Z2hWlERE" />
    </Router>
  );
}