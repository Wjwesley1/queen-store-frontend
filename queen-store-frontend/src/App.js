// src/App.js — QUEEN STORE FRONTEND IMORTAL (React + Router + Context + Carrinho 24/7)
import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Carrinho from './pages/Carrinho';
import ProdutoDetalhe from './pages/ProdutoDetalhe';

const CarrinhoContext = createContext();
const FavoritosContext = createContext();

export const useCarrinho = () => useContext(CarrinhoContext);
export const useFavoritos = () => useContext(FavoritosContext);

const API_URL = 'https://seasons-admissions-arctic-height.trycloudflare.com';

// SESSÃO FIXA NO LOCALSTORAGE
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
  headers: { 'x-session-id': getSessionId() } // CORRIGIDO: x-session-id
});

function AppContent() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [categoria, setCategoria] = useState('all');
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    carregarCarrinho();
  }, []);

  // ADICIONA AO CARRINHO
  const addToCart = async (produto) => {
    if (produto.estoque <= 0) {
      showNotification("Produto esgotado!");
      return;
    }

    try {
      await api.post('/api/carrinho', { produto_id: produto.id });
      carregarCarrinho();
      showNotification(`${produto.nome} adicionado!`);
    } catch (err) {
      showNotification("Erro ao adicionar");
    }
  };

  // REMOVE DO CARRINHO
  const removeFromCart = async (produto_id) => {
    try {
      await api.post('/api/carrinho', { produto_id, quantidade: 0 });
      carregarCarrinho();
    } catch (err) {
      showNotification("Erro ao remover");
    }
  };

  // ATUALIZA QUANTIDADE
  const updateQuantidade = async (produto_id, novaQuantidade) => {
    if (novaQuantidade <= 0) return removeFromCart(produto_id);
    try {
      await api.post('/api/carrinho', { produto_id, quantidade: novaQuantidade });
      carregarCarrinho();
    } catch (err) {
      showNotification("Erro ao atualizar");
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

  // FILTROS
  const filtered = categoria === 'all' 
    ? produtos 
    : produtos.filter(p => p.categoria?.toLowerCase() === categoria);

  const totalItens = carrinho.reduce((sum, i) => sum + i.quantidade, 0);
  const totalValor = carrinho.reduce((sum, i) => sum + (i.preco * i.quantidade), 0).toFixed(2);

  // NOTIFICAÇÃO
  const showNotification = (msg) => {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = msg;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
  };

  // SCROLL SUAVE
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // HEART ICON
  const HeartIcon = ({ filled }) => (
    <svg 
      width="28" 
      height="28" 
      viewBox="0 0 24 24" 
      fill={filled ? "#ef4444" : "none"} 
      stroke={filled ? "#ef4444" : "#6b7280"}
      strokeWidth="2"
      className="transition-all hover:scale-110 cursor-pointer"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );

  if (loading) return <div className="text-3xl font-bold text-primary animate-pulse text-center py-20">Carregando Queen Store...</div>;

  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavorito, isFavorito }}>
      <CarrinhoContext.Provider value={{ carrinho, addToCart, updateQuantidade, removeFromCart, carregarCarrinho }}>
        <div className="min-h-screen bg-white font-inter text-dark">

          {/* HEADER COM SCROLL SUAVE */}
          <header className="sticky top-0 z-50 bg-white shadow-lg border-b">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
              <Link to="/" className="brand">
                <h1 className="text-3xl font-bold text-primary">Queen</h1>
                <p className="tagline text-xs text-gray-500 uppercase tracking-widest">Se cuidar é reinar.</p>
              </Link>

              <nav className="hidden md:flex items-center gap-8">
                <Link to="/" onClick={() => scrollToSection('produtos')} className="text-gray-700 hover:text-primary font-medium transition">Produtos</Link>
                <Link to="/" onClick={() => scrollToSection('avaliacoes')} className="text-gray-700 hover:text-primary font-medium transition">Avaliações</Link>
                <Link to="/" onClick={() => scrollToSection('contato')} className="text-gray-700 hover:text-primary font-medium transition">Contato</Link>
                
                <Link to="/carrinho" className="bg-primary text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl hover:shadow-2xl transition transform hover:scale-105">
                  Cart {totalItens} itens - R$ {totalValor}
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
                {/* HERO */}
                <section className="hero py-20 bg-gradient-to-br from-sky-50 to-sky-100 relative overflow-hidden">
                  <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                      <div>
                        <h2 className="text-5xl md:text-6xl font-bold text-dark mb-6 leading-tight">
                          Cuidado Natural para Sua Pele
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                          Sabonetes artesanais premium com ingredientes 100% naturais e fragrâncias exclusivas.
                        </p>
                        <div className="flex gap-6 mb-10">
                          <div className="text-center">
                            <span className="block text-4xl font-bold text-primary">500+</span>
                            <span className="text-xs uppercase text-gray-500 tracking-widest">Clientes</span>
                          </div>
                          <div className="text-center">
                            <span className="block text-4xl font-bold text-primary">100%</span>
                            <span className="text-xs uppercase text-gray-500 tracking-widest">Natural</span>
                          </div>
                          <div className="text-center">
                            <span className="block text-4xl font-bold text-primary">15</span>
                            <span className="text-xs uppercase text-gray-500 tracking-widest">Fragrâncias</span>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <button onClick={() => scrollToSection('produtos')} className="btn-primary text-lg px-8 py-4">Ver Produtos</button>
                          <button onClick={() => scrollToSection('contato')} className="btn-secondary text-lg px-8 py-4">Fale Conosco</button>
                        </div>
                      </div>
                      <div className="hero-soap-display relative h-96 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden">
                        <div className="floating-soap soap-1">ARGILA BRANCA + DOLOMITA</div>
                        <div className="floating-soap soap-2">ARGILA PRETA</div>
                        <div className="floating-soap soap-3">ERVA DOCE + CAMOMILA</div>
                        <div className="floating-soap soap-4">AÇAFRÃO + MEL</div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* FILTROS */}
                <section className="filters py-8 bg-gray-50 border-b">
                  <div className="container mx-auto px-6">
                    <div className="flex justify-center gap-4 flex-wrap">
                      {['all', 'relaxante', 'energizante', 'hidratante', 'premium'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setCategoria(cat)}
                          className={`filter-btn ${categoria === cat ? 'active' : ''}`}
                        >
                          {cat === 'all' ? 'Todos' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* PRODUTOS */}
                <section id="produtos" className="py-20 bg-white">
                  <div className="container mx-auto px-6">
                    <h2 className="section-title text-center mb-4">Nossa Coleção Premium</h2>
                    <p className="section-subtitle text-center mb-16">Cada sabonete é uma obra de arte</p>
                    <div className="products-grid">
                      {filtered.filter(p => p.estoque > 0).map(p => (
                        <div key={p.id} className="product-card">
                          <Link to={`/produto/${p.id}`}>
                            <div className="product-image" style={{ 
                              background: p.imagem ? `url(${p.imagem}) center/cover` : 'linear-gradient(135deg, #e6e6fa, #dda0dd)'
                            }}>
                              {p.badge && <div className="product-badge">{p.badge}</div>}
                            </div>
                          </Link>
                          <div className="product-info p-6">
                            <div className="product-rating mb-2">★★★★★ <span className="rating-text">(99+)</span></div>
                            <h3 className="product-title">{p.nome}</h3>
                            <p className="text-sm text-green-600 font-bold">{p.estoque} em estoque</p>
                            <span className="price-current">R$ {p.preco}</span>
                            <div className="product-actions mt-4">
                              <button onClick={() => addToCart(p)} className="btn-add-cart">Adicionar</button>
                              <button onClick={() => toggleFavorito(p)}>
                                <HeartIcon filled={isFavorito(p.id)} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* AVALIAÇÕES */}
                <section id="avaliacoes" className="reviews py-20 bg-gray-50">
                  <div className="container mx-auto px-6">
                    <h2 className="section-title text-center mb-4">O Que Nossos Clientes Dizem</h2>
                    <p className="section-subtitle text-center mb-12">Mais de 500 clientes satisfeitos</p>
                    <div className="reviews-grid">
                      {[
                        { name: "Maria Silva", text: "Melhor sabonete que já usei!" },
                        { name: "João Santos", text: "Fragrância incrível e dura o dia todo." },
                        { name: "Ana Costa", text: "Pele macia e hidratada. Recomendo!" }
                      ].map((r, i) => (
                        <div key={i} className="review-card">
                          <div className="review-header">
                            <div className="reviewer-avatar">{r.name[0]}</div>
                            <div>
                              <h4>{r.name}</h4>
                              <p className="text-xs text-gray-500">Cliente verificado</p>
                              <div className="stars text-yellow-500">★★★★★</div>
                            </div>
                          </div>
                          <p className="review-text">"{r.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* CONTATO */}
                <section id="contato" className="contact py-20 bg-white">
                  <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16">
                      <div>
                        <h3 className="text-4xl font-bold text-dark mb-6">Entre em Contato</h3>
                        <p className="text-gray-600 mb-8">Dúvidas? Pedido personalizado? Estamos aqui!</p>
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="contact-icon">Email</div>
                            <div><strong>Email</strong><br />contato@queenstore.com</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="contact-icon">WhatsApp</div>
                            <div><strong>WhatsApp</strong><br />(11) 99999-9999</div>
                          </div>
                        </div>
                      </div>
                      <form className="form-container">
                        <div className="form-group"><input placeholder="Nome" required /></div>
                        <div className="form-group"><input type="email" placeholder="Email" required /></div>
                        <div className="form-group"><textarea placeholder="Mensagem" required /></div>
                        <button type="submit" className="btn-primary w-full">Enviar Mensagem</button>
                      </form>
                    </div>
                  </div>
                </section>

                <footer className="bg-gray-900 text-white py-12">
                  <div className="container mx-auto px-6 text-center">
                    <h4 className="text-3xl font-bold mb-2">Queen</h4>
                    <p className="text-gray-400 mb-4">Se cuidar é reinar.</p>
                    <p className="text-sm">© 2025 Queen Store. Todos os direitos reservados.</p>
                  </div>
                </footer>
              </>
            } />

            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/produto/:id" element={<ProdutoDetalhe />} />
            <Route path="/favoritos" element={
              <div className="min-h-screen bg-gray-50 py-20">
                <div className="container mx-auto px-6">
                  <h1 className="text-4xl font-bold text-primary text-center mb-12">Seus Favoritos</h1>
                  {favoritos.length === 0 ? (
                    <p className="text-center text-xl text-gray-600">Você ainda não tem favoritos</p>
                  ) : (
                    <div className="products-grid">
                      {favoritos.map(p => (
                        <div key={p.id} className="product-card">
                          <Link to={`/produto/${p.id}`}>
                            <div className="product-image" style={{ background: `url(${p.imagem}) center/cover` }}>
                              {p.badge && <div className="product-badge">{p.badge}</div>}
                            </div>
                          </Link>
                          <div className="product-info p-6">
                            <h3 className="product-title">{p.nome}</h3>
                            <span className="price-current">R$ {p.preco}</span>
                            <button onClick={() => addToCart(p)} className="btn-add-cart">Adicionar</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            } />
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
    </Router>
  );
}