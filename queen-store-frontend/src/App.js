// src/App.js — QUEEN STORE FRONTEND 100% COMPLETO

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
import Privacidade from './pages/Privacidade.js';
import Termos from './pages/Termos.js';
import MinhaConta from './pages/MinhaConta.jsx';
import { useAuth } from './context/AuthContext';
import Carrinho from './pages/Carrinho';
import ProdutoDetalhe from './pages/ProdutoDetalhe';
import { GoogleOAuthProvider } from '@react-oauth/google';
import VerifyAccount from './pages/VerifyAccount.jsx';
import useInactivityLogout from './hooks/useInactivityLogout';
import Login from './pages/Login.jsx';

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
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();
  const [categorias, setCategorias] = useState([]);
  const { cliente, logout } = useAuth();

  useInactivityLogout();

  useEffect(() => {
    api.get('/api/produtos')
      .then(res => {
        setProdutos(res.data.map(p => ({ ...p, estoque: parseInt(p.estoque) || 0 })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const carregarCarrinho = () => {
    api.get('/api/carrinho')
      .then(res => setCarrinho(res.data))
      .catch(() => setCarrinho([]));
  };

  useEffect(() => { carregarCarrinho(); }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [location]);

  useEffect(() => {
    api.get('/api/categorias')
      .then(res => {
        setCategorias(res.data.map(cat =>
          cat.trim().toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
        ));
      })
      .catch(() => setCategorias(['Geleia De Banho', 'Sabonete']));
  }, []);

  const showNotification = (msg) => {
    const notif = document.createElement('div');
    notif.className = 'fixed top-6 right-6 bg-[#0F1B3F] text-white px-6 py-4 rounded-2xl shadow-2xl z-[9999] font-bold text-base';
    notif.textContent = msg;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
  };

  const addToCart = async (produto, quantidade = 1) => {
    if (produto.estoque < quantidade) { showNotification('Estoque insuficiente! 😔'); return; }
    try {
      await api.post('/api/carrinho', { produto_id: produto.id, quantidade });
      carregarCarrinho();
      showNotification(`${quantidade} × ${produto.nome} adicionado! 🛒`);
    } catch { showNotification('Erro ao adicionar ao carrinho 😢'); }
  };

  const removeFromCart = async (produto_id) => {
    try {
      await api.delete(`/api/carrinho/${produto_id}`);
      carregarCarrinho();
    } catch {}
  };

  const toggleFavorito = (produto) => {
    setFavoritos(prev =>
      prev.find(p => p.id === produto.id) ? prev.filter(p => p.id !== produto.id) : [...prev, produto]
    );
  };

  const isFavorito = (id) => favoritos.some(p => p.id === id);

  const filtered = categoria === 'all'
    ? produtos
    : produtos.filter(p => p.categoria?.trim().toLowerCase() === categoria.toLowerCase());

  const totalItens = carrinho.reduce((sum, i) => sum + i.quantidade, 0);
  const totalValor = carrinho.reduce((sum, i) => sum + (i.preco * i.quantidade), 0).toFixed(2);

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (loading) return <LoadingQueen />;

  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavorito, isFavorito }}>
      <CarrinhoContext.Provider value={{ carrinho, addToCart, removeFromCart, carregarCarrinho }}>
        <div className="min-h-screen bg-white font-sans">

          {/* ==================== HEADER ==================== */}
          {!isAdminRoute && (
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
                        Olá, {cliente.nome.split(' ')[0]}!
                      </Link>
                      <button onClick={logout} className="text-xs text-gray-400 hover:text-gray-600 transition">Sair</button>
                    </div>
                  ) : (
                    <Link to="/login" className="hidden md:block text-sm font-bold text-[#0F1B3F] hover:text-pink-600 transition">
                      Entrar
                    </Link>
                  )}

                  {/* MENU MOBILE */}
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
          )}

          {/* ==================== ROTAS ==================== */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="/minha-conta" element={<MinhaConta />} />
            <Route path="/verify/:token" element={<VerifyAccount />} />
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/produto/:id" element={<ProdutoDetalhe />} />

            <Route path="/favoritos" element={
              <div className="min-h-screen bg-gray-50 py-16">
                <div className="container mx-auto px-6 max-w-5xl">
                  <h1 className="text-4xl font-bold text-[#0F1B3F] mb-10">Seus Favoritos</h1>
                  {favoritos.length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-gray-400 text-lg mb-6">Você ainda não salvou nenhum favorito</p>
                      <Link to="/" className="bg-[#0F1B3F] text-white px-8 py-3 rounded-full font-bold hover:bg-pink-600 transition text-sm">
                        Ver produtos
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {favoritos.map(p => (
                        <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                          <Link to={`/produto/${p.id}`}>
                            <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${p.imagens?.[0] || p.imagem})` }} />
                          </Link>
                          <div className="p-4">
                            <h3 className="font-bold text-sm text-[#0F1B3F] mb-1 line-clamp-2">{p.nome}</h3>
                            <p className="text-green-600 font-bold mb-3">R$ {parseFloat(p.preco).toFixed(2)}</p>
                            <button onClick={() => addToCart(p)} className="w-full bg-[#0F1B3F] text-white py-2 rounded-full font-bold text-sm hover:bg-pink-600 transition">
                              Adicionar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            } />

            {/* ADMIN */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={localStorage.getItem('admin-logado') ? <AdminDashboard /> : <Navigate to="/admin" />} />
            <Route path="/admin/cadastrar" element={localStorage.getItem('admin-logado') ? <CadastrarProduto /> : <Navigate to="/admin" />} />
            <Route path="/admin/estoque" element={localStorage.getItem('admin-logado') ? <ControleEstoque /> : <Navigate to="/admin" />} />
            <Route path="/admin/pedidos" element={localStorage.getItem('admin-logado') === 'true' ? <Pedidos /> : <Navigate to="/admin" />} />

            {/* ==================== HOME ==================== */}
            <Route path="*" element={
              <>
                {/* HERO */}
                <section className="relative h-screen flex items-end justify-start overflow-hidden">
                  <video autoPlay loop muted playsInline className="absolute w-full h-full object-cover">
                    <source src="/videos/fundo-hero.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0F1B3F]/90 via-[#0F1B3F]/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="relative z-10 container mx-auto px-8 pb-24 md:pb-32">
                    <p className="text-pink-400 font-bold uppercase tracking-[0.4em] text-sm mb-4">Cuidado Natural</p>
                    <h2 className="text-5xl md:text-7xl font-black text-white leading-none mb-6 max-w-2xl">
                      Sua pele<br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-200">
                        merece o melhor
                      </span>
                    </h2>
                    <p className="text-white/70 text-lg mb-10 max-w-md">
                      Sabonetes artesanais e geleias de banho 100% naturais, feitos com amor.
                    </p>
                    <div className="flex gap-4 flex-wrap">
                      <Link to="/#produtos" className="bg-white text-[#0F1B3F] px-8 py-4 rounded-full font-bold hover:bg-pink-100 transition shadow-xl text-sm">
                        Ver Coleção
                      </Link>
                      <Link to="/#contato" className="border border-white/40 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition text-sm">
                        Fale Conosco
                      </Link>
                    </div>
                  </div>

                  <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 text-white/40">
                    <span className="text-xs tracking-widest uppercase">Scroll</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </section>

                {/* FILTROS */}
                <section className="sticky top-[73px] z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4">
                  <div className="container mx-auto px-6">
                    <div className="flex items-center gap-3 overflow-x-auto pb-1">
                      <button
                        onClick={() => setCategoria('all')}
                        className={`shrink-0 px-6 py-2 rounded-full text-sm font-bold transition ${categoria === 'all' ? 'bg-[#0F1B3F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        Todos
                      </button>
                      {categorias.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setCategoria(cat)}
                          className={`shrink-0 px-6 py-2 rounded-full text-sm font-bold transition ${categoria === cat ? 'bg-[#0F1B3F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* PRODUTOS */}
                <section id="produtos" className="py-16 bg-white">
                  <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex justify-between items-end mb-10">
                      <div>
                        <p className="text-sm font-bold text-pink-500 uppercase tracking-widest mb-1">Coleção Premium</p>
                        <h2 className="text-4xl font-black text-[#0F1B3F]">Nossos Produtos</h2>
                      </div>
                      <p className="text-sm text-gray-400 hidden md:block">{filtered.length} produto{filtered.length !== 1 ? 's' : ''}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {filtered.map(produto => {
                        const foto = produto.imagens?.[0] || produto.imagem || 'https://i.ibb.co/0s0qQ6Q/placeholder-queen.jpg';
                        return (
                          <div key={produto.id} className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <Link to={`/produto/${produto.id}`} className="block relative overflow-hidden">
                              <div
                                className="aspect-square bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                                style={{ backgroundImage: `url(${foto})` }}
                              />
                              <div className="absolute top-3 left-3 flex flex-col gap-1">
                                {produto.badge && (
                                  <span className="bg-[#0F1B3F] text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                                    {produto.badge}
                                  </span>
                                )}
                                {produto.estoque <= 5 && produto.estoque > 0 && (
                                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                                    Últimas unidades
                                  </span>
                                )}
                              </div>
                              {produto.estoque === 0 && (
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                  <span className="text-white font-black text-lg tracking-widest">ESGOTADO</span>
                                </div>
                              )}
                              <button
                                onClick={(e) => { e.preventDefault(); toggleFavorito(produto); }}
                                className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorito(produto.id) ? '#ef4444' : 'none'} stroke={isFavorito(produto.id) ? '#ef4444' : '#374151'} strokeWidth="2">
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                </svg>
                              </button>
                            </Link>
                            <div className="p-4">
                              <h3 className="font-bold text-sm text-gray-800 line-clamp-2 mb-1">{produto.nome}</h3>
                              <p className="text-[#0F1B3F] font-black text-lg mb-3">R$ {parseFloat(produto.preco).toFixed(2)}</p>
                              <button
                                onClick={() => produto.estoque > 0 && addToCart(produto, 1)}
                                disabled={produto.estoque === 0}
                                className={`w-full py-2.5 rounded-full font-bold text-sm transition-all ${
                                  produto.estoque === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#0F1B3F] text-white hover:bg-pink-600 shadow-sm hover:shadow-md'
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

                {/* AVALIAÇÕES */}
                <section id="avaliacoes" className="py-20 bg-gray-50">
                  <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-12">
                      <p className="text-sm font-bold text-pink-500 uppercase tracking-widest mb-2">Depoimentos</p>
                      <h2 className="text-4xl font-black text-[#0F1B3F]">O que as rainhas dizem</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      {[
                        { nome: 'Ana Paula', nota: 5, texto: 'A geleia de banho é simplesmente incrível! Minha pele ficou hidratada o dia todo. Amei demais! 💜' },
                        { nome: 'Carla S.', nota: 5, texto: 'Produtos maravilhosos e cheirosos. Já comprei pela terceira vez e continuo encantada com a qualidade!' },
                        { nome: 'Fernanda M.', nota: 5, texto: 'Entrega rápida e embalagem linda. O sabonete artesanal superou minhas expectativas. Nota 10!' },
                      ].map((av, i) => (
                        <div key={i} className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                          <div className="flex items-center gap-1 mb-4">
                            {[...Array(av.nota)].map((_, j) => (
                              <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            ))}
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed mb-5">"{av.texto}"</p>
                          <p className="font-bold text-[#0F1B3F] text-sm">— {av.nome}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* CONTATO */}
                <section id="contato" className="py-20 bg-white">
                  <div className="container mx-auto px-6 max-w-3xl text-center">
                    <p className="text-sm font-bold text-pink-500 uppercase tracking-widest mb-2">Fale conosco</p>
                    <h2 className="text-4xl font-black text-[#0F1B3F] mb-4">Dúvidas? A gente responde!</h2>
                    <p className="text-gray-400 mb-10">Nossa equipe está disponível para te ajudar com qualquer dúvida sobre produtos ou pedidos.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href="https://wa.me/5531972552077"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-green-500 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 transition shadow-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </a>
                      <a
                        href="mailto:contato@queenstore.store"
                        className="flex items-center justify-center gap-3 bg-[#0F1B3F] text-white px-8 py-4 rounded-full font-bold hover:bg-pink-600 transition shadow-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        contato@queenstore.store
                      </a>
                    </div>
                  </div>
                </section>

                {/* FOOTER */}
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
              </>
            } />
          </Routes>
        </div>
      </CarrinhoContext.Provider>
    </FavoritosContext.Provider>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <AppContent />
        <SpeedInsights id={process.env.REACT_APP_VERCEL_TOKEN} />
      </Router>
    </GoogleOAuthProvider>
  );
}