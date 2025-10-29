import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Carrinho from './Carrinho';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [categoria, setCategoria] = useState('Todas');
  const [carrinho, setCarrinho] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockProdutos = [
    { id: 1, nome: 'Sabonete Lavanda', preco: 24.9, imagem: 'https://via.placeholder.com/200', estoque: 50, categoria: 'Sabonete', badge: 'Mais Vendido' },
    { id: 2, nome: 'Esfoliante Mel & Aveia', preco: 32.9, imagem: 'https://via.placeholder.com/200', estoque: 20, categoria: 'Esfoliante', badge: 'Novidade' },
    { id: 3, nome: 'Hidratante Floral', preco: 38.9, imagem: 'https://via.placeholder.com/200', estoque: 15, categoria: 'Hidratante' },
    { id: 4, nome: 'Sabonete Oceano', preco: 26.9, imagem: 'https://via.placeholder.com/200', estoque: 30, categoria: 'Sabonete' },
    { id: 5, nome: 'Óleo Corporal Rosa', preco: 45.9, imagem: 'https://via.placeholder.com/200', estoque: 10, categoria: 'Óleo', badge: 'Exclusivo' },
    { id: 6, nome: 'Kit Verão Radiante', preco: 89.9, imagem: 'https://via.placeholder.com/200', estoque: 5, categoria: 'Kit' },
  ];

  useEffect(() => {
    setProdutos(mockProdutos);
    setLoading(false);
  }, [mockProdutos]);

  const addToCart = (produto) => {
    setCarrinho([...carrinho, produto]);
    alert(`${produto.nome} adicionado ao carrinho!`);
  };

  const categorias = ['Todas', ...new Set(mockProdutos.map(p => p.categoria))];
  const filteredProdutos = categoria === 'Todas' ? produtos : produtos.filter(p => p.categoria === categoria);

  const handleSubmit = (e) => {
    e.preventDefault();
    document.getElementById('successMessage').classList.remove('hidden');
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-primary">Carregando...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-neutral font-roboto">
              <header className="bg-white shadow-sm">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                  <div className="text-3xl font-bold font-helo text-primary">👑 Queen</div>
                  <div className="hidden md:flex space-x-6">
                    <Link to="/#produtos" className="text-gray-600 hover:text-primary transition-all">Produtos</Link>
                    <Link to="/#sobre" className="text-gray-600 hover:text-primary transition-all">Sobre</Link>
                    <Link to="/#contato" className="text-gray-600 hover:text-primary transition-all">Contato</Link>
                  </div>
                  <Link to="/carrinho" state={{ carrinho }} className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-secondary transition-all">
                    🛍️ ({carrinho.length})
                  </Link>
                </nav>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center bg-gradient-to-br from-primary/10 to-neutral">
                  <h1 className="text-4xl sm:text-5xl font-bold font-helo text-primary mb-4 animate-floating">
                    Se Cuidar é Reinar
                  </h1>
                  <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">Produtos artesanais para realçar sua beleza natural com cuidado e sustentabilidade</p>
                  <Link to="/#produtos" className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary hover:scale-105 transition-all">
                    Ver Coleção
                  </Link>
                </div>
              </header>

              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <section className="mb-16">
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg p-6 shadow-md text-center">
                      <div className="text-4xl mb-3">🌿</div>
                      <h3 className="text-lg font-semibold text-primary mb-2">100% Natural</h3>
                      <p className="text-gray-600 text-sm">Ingredientes orgânicos e sustentáveis</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-md text-center">
                      <div className="text-4xl mb-3">💝</div>
                      <h3 className="text-lg font-semibold text-primary mb-2">Feito com Amor</h3>
                      <p className="text-gray-600 text-sm">Produção artesanal e cuidadosa</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-md text-center">
                      <div className="text-4xl mb-3">🌸</div>
                      <h3 className="text-lg font-semibold text-primary mb-2">Fragrâncias Únicas</h3>
                      <p className="text-gray-600 text-sm">Aromas exclusivos e envolventes</p>
                    </div>
                  </div>
                </section>

                <section id="produtos" className="mb-16">
                  <h2 className="text-3xl font-bold font-helo text-center mb-4 text-primary">Nossos Produtos</h2>
                  <p className="text-center text-gray-600 mb-8">Explore nossa coleção artesanal</p>
                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {categorias.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategoria(cat)}
                        className={`px-4 py-2 rounded-full font-semibold text-white ${categoria === cat ? 'bg-primary' : 'bg-secondary'} hover:bg-accent transition-all`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredProdutos.map(produto => (
                      <div key={produto.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
                        <div
                          className="h-48 flex items-center justify-center bg-gradient-to-br"
                          style={{
                            background: `linear-gradient(135deg, ${
                              produto.categoria === 'Sabonete' ? '#e9d5ff, #f3e8ff' :
                              produto.categoria === 'Esfoliante' ? '#fefcbf, #fed7aa' :
                              produto.categoria === 'Hidratante' ? '#d1fae5, #99f6e4' :
                              produto.categoria === 'Óleo' ? '#fecdd3, #fee2e2' :
                              produto.categoria === 'Kit' ? '#fef9c3, #fef08a' : '#e0f2fe, #bae6fd'
                            })`,
                          }}
                        >
                          <div className="text-6xl">{produto.categoria === 'Sabonete' ? '🧼' : produto.categoria === 'Esfoliante' ? '🍯' : produto.categoria === 'Hidratante' ? '🌺' : produto.categoria === 'Óleo' ? '🌹' : '☀️'}</div>
                        </div>
                        <div className="p-4">
                          {produto.badge && <span className="inline-block bg-accent text-white text-xs px-2 py-1 rounded-full font-semibold mb-2">{produto.badge}</span>}
                          <h3 className="text-lg font-semibold text-primary mb-2">{produto.nome}</h3>
                          <p className="text-gray-600 text-sm mb-3">{produto.descricao || 'Produto artesanal de alta qualidade'}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-primary">R$ {produto.preco.toFixed(2)}</span>
                            <button onClick={() => addToCart(produto)} className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-secondary transition-all">
                              Adicionar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="sobre" className="mb-16 bg-white rounded-lg p-8 shadow-md">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h2 className="text-3xl font-bold font-helo mb-4 text-primary">Nossa História</h2>
                      <p className="text-gray-600 mb-4">A Queen nasceu do amor pela natureza e pelo cuidado genuíno com a pele. Cada produto é criado artesanalmente, combinando ingredientes naturais selecionados com técnicas tradicionais.</p>
                      <p className="text-gray-600">Acreditamos que a beleza vem de dentro, e nossos produtos são desenvolvidos para nutrir não apenas sua pele, mas também sua alma.</p>
                    </div>
                    <div className="text-center">
                      <div className="text-6xl mb-4">🌿✨</div>
                      <p className="text-gray-600 italic text-lg">"Se cuidar é reinar"</p>
                    </div>
                  </div>
                </section>

                <section id="contato" className="mb-16 bg-gradient-to-br from-primary/10 to-neutral rounded-lg p-8 text-center">
                  <h2 className="text-3xl font-bold font-helo mb-4 text-primary">Fique por Dentro</h2>
                  <p className="text-gray-600 mb-6">Receba novidades, promoções exclusivas e dicas de cuidados</p>
                  <form className="max-w-md mx-auto flex gap-3" onSubmit={handleSubmit}>
                    <input
                      type="email"
                      id="email"
                      placeholder="Seu melhor e-mail"
                      className="flex-1 px-4 py-2 rounded-full text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-secondary transition-all">
                      Inscrever
                    </button>
                  </form>
                  <div id="successMessage" className="hidden mt-4 bg-white text-primary px-4 py-2 rounded-full inline-block font-semibold">
                    ✓ Inscrição realizada com sucesso!
                  </div>
                </section>
              </main>

              <footer className="bg-primary text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-6">
                    <div>
                      <h3 className="text-xl font-bold font-helo mb-3">👑 Queen</h3>
                      <p className="text-gray-200 text-sm">Cuidados naturais para sua beleza essencial</p>
                      <p className="text-gray-200 text-sm mt-2">Envio para todo o Brasil. Pagamento via Pix, cartão ou boleto.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-100">Produtos</h4>
                      <ul className="space-y-2 text-gray-200 text-sm">
                        <li><Link to="/#produtos" className="hover:text-accent transition-all">Sabonetes</Link></li>
                        <li><Link to="/#produtos" className="hover:text-accent transition-all">Hidratantes</Link></li>
                        <li><Link to="/#produtos" className="hover:text-accent transition-all">Esfoliantes</Link></li>
                        <li><Link to="/#produtos" className="hover:text-accent transition-all">Kits</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-100">Empresa</h4>
                      <ul className="space-y-2 text-gray-200 text-sm">
                        <li><Link to="/#sobre" className="hover:text-accent transition-all">Sobre Nós</Link></li>
                        <li><Link to="/#sobre" className="hover:text-accent transition-all">Blog</Link></li>
                        <li><Link to="/#contato" className="hover:text-accent transition-all">Contato</Link></li>
                        <li><Link to="/#sobre" className="hover:text-accent transition-all">FAQ</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-100">Redes Sociais</h4>
                      <div className="flex space-x-4 text-xl">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-all">📱</a>
                        <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-all">💬</a>
                        <a href="mailto:contato@queenstore.com" className="hover:text-accent transition-all">📧</a>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-600 pt-6 text-center text-gray-200 text-sm">
                    <p>&copy; 2025 Queen. Todos os direitos reservados. Feito com 💝</p>
                  </div>
                </div>
              </footer>
            </div>
          }
        />
        <Route path="/carrinho" element={<Carrinho />} />
      </Routes>
    </Router>
  );
}

export default App;