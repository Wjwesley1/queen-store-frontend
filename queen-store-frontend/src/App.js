// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Carrinho from './Carrinho';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [categoria, setCategoria] = useState('all');
  const [carrinho, setCarrinho] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    axios.get(`${API_URL}/api/produtos`)
      .then(res => {
        setProdutos(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addToCart = async (produto) => {
  try {
    const res = await axios.post(`${API_URL}/api/carrinho`, { produto_id: produto.id });
    setCarrinho(prev => [...prev, { ...produto, quantidade: 1 }]);
    showNotification(`${produto.nome} adicionado!`);
  } catch (err) {
    showNotification('Erro ao adicionar');
  }
};

  const showNotification = (msg) => {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = msg;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
  };

  const filtered = categoria === 'all' 
    ? produtos 
    : produtos.filter(p => p.categoria.toLowerCase().includes(categoria));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      await axios.post(`${API_URL}/api/contato`, { email });
      showNotification('Inscrição realizada!');
      e.target.reset();
    } catch (err) {
      showNotification('Erro ao enviar');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-2xl font-bold text-primary">Carregando...</div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-white font-inter text-dark">
        {/* HEADER */}
        <header className="sticky top-0 z-50 bg-white shadow-md">
          <div className="container mx-auto px-6 py-5 flex justify-between items-center">
            <div className="brand">
              <h1 className="text-2xl font-bold text-primary">Queen</h1>
              <p className="tagline text-xs text-gray-500 uppercase tracking-widest">Se cuidar é reinar.</p>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="#produtos" className="text-gray-700 hover:text-primary font-medium">Produtos</Link>
              <Link to="#avaliacoes" className="text-gray-700 hover:text-primary font-medium">Avaliações</Link>
              <Link to="#contato" className="text-gray-700 hover:text-primary font-medium">Contato</Link>
              <Link 
  to="/carrinho" 
  className="cart-icon bg-primary text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2"
>
  Cart {carrinho.length} itens - R$ {carrinho.reduce((t, p) => t + p.preco, 0).toFixed(2)}
</Link>
            </nav>
          </div>
        </header>

        {/* HERO */}
        <section className="hero py-20 bg-gradient-to-br from-sky-50 to-sky-100 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-5xl md:text-6xl font-bold text-dark mb-6">Cuidado Natural para Sua Pele</h2>
                <p className="text-lg text-gray-600 mb-8">Sabonetes artesanais premium com ingredientes 100% naturais e fragrâncias exclusivas.</p>
                <div className="flex gap-6 mb-10">
                  <div className="text-center">
                    <span className="block text-3xl font-bold text-primary">500+</span>
                    <span className="text-xs uppercase text-gray-500 tracking-wider">Clientes</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-3xl font-bold text-primary">100%</span>
                    <span className="text-xs uppercase text-gray-500 tracking-wider">Natural</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-3xl font-bold text-primary">15</span>
                    <span className="text-xs uppercase text-gray-500 tracking-wider">Fragrâncias</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link to="#produtos" className="btn-primary">Ver Produtos</Link>
                  <Link to="#contato" className="btn-secondary">Fale Conosco</Link>
                </div>
              </div>
              <div className="hero-soap-display relative h-96 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl shadow-xl flex items-center justify-center overflow-hidden">
                <div className="floating-soap soap-1">LAVANDA</div>
                <div className="floating-soap soap-2">CITRUS</div>
                <div className="floating-soap soap-3">ROSA</div>
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
        <section id="produtos" className="products py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="section-title text-center mb-4">Nossa Coleção Premium</h2>
            <p className="section-subtitle text-center mb-16">Cada sabonete é uma obra de arte</p>
            <div className="products-grid">
              {filtered.map(p => (
                <div key={p.id} className="product-card" data-category={p.categoria.toLowerCase()}>
                  <div className="product-image" style={{ background: p.imagem ? `url(${p.imagem}) center/cover` : 'linear-gradient(135deg, #e6e6fa, #dda0dd)' }}>
                    {p.badge && <div className="product-badge">{p.badge}</div>}
                  </div>
                  <div className="product-info p-6">
                    <div className="product-rating mb-2">★★★★★ <span className="rating-text">(99+)</span></div>
                    <h3 className="product-title">{p.nome}</h3>
                    <p className="product-description">Sabonete artesanal premium com ingredientes naturais.</p>
                    <p className="product-ingredients">Ingredientes naturais • Feito à mão</p>
                    <div className="product-pricing mb-4">
                      <span className="price-current">R$ {p.preco}</span>
                    </div>
                    <div className="product-actions">
                      <button onClick={() => addToCart(p)} className="btn-add-cart">Adicionar</button>
                      <button className="btn-wishlist">Heart</button>
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
                <h3 className="text-3xl font-bold text-dark mb-6">Entre em Contato</h3>
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
              <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group"><input placeholder="Nome" required /></div>
                <div className="form-group"><input type="email" placeholder="Email" name="email" required /></div>
                <div className="form-group"><textarea placeholder="Mensagem" required /></div>
                <button type="submit" className="btn-primary w-full">Enviar</button>
              </form>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-6 text-center">
            <h4 className="text-2xl font-bold mb-2">Queen</h4>
            <p className="text-gray-400 mb-4">Se cuidar é reinar.</p>
            <p className="text-sm">© 2025 Queen. Todos os direitos reservados.</p>
          </div>
        </footer>

        <Routes>
          <Route path="/carrinho" element={<Carrinho />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;