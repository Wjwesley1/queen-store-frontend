import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [categoria, setCategoria] = useState('Todas');
  const [carrinho, setCarrinho] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dados mockados
  const mockProdutos = [
    { id: 1, nome: 'Sabonete de Lavanda', preco: 15.9, imagem: 'https://via.placeholder.com/200', estoque: 50, categoria: 'Sabonete' },
    { id: 2, nome: 'Creme Hidratante de Camomila', preco: 29.9, imagem: 'https://via.placeholder.com/200', estoque: 20, categoria: 'Creme' },
    { id: 3, nome: 'Óleo Essencial de Rosa', preco: 39.5, imagem: 'https://via.placeholder.com/200', estoque: 15, categoria: 'Óleo' },
  ];

  useEffect(() => {
    setProdutos(mockProdutos);
    setLoading(false);
  }, []); // Removido mockProdutos do array de dependências, já que é uma constante

  const addToCart = (produto) => {
    setCarrinho([...carrinho, produto]);
    alert(`${produto.nome} adicionado ao carrinho!`);
  };

  const categorias = ['Todas', ...new Set(mockProdutos.map(p => p.categoria))];
  const filteredProdutos = categoria === 'Todas' ? produtos : produtos.filter(p => p.categoria === categoria);

  if (loading) return <div className="text-center mt-10 text-primary">Carregando...</div>;

  return (
    <div className="min-h-screen bg-neutral">
      <header className="bg-primary text-white py-6">
        <h1 className="text-4xl font-bold text-center">Queen Store</h1>
        <p className="text-center mt-2 text-secondary">Produtos artesanais feitos com amor</p>
      </header>
      <main className="container">
        <div className="filter-buttons">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`filter-btn ${categoria === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="text-center mb-4">
          <p className="text-primary">Itens no carrinho: {carrinho.length}</p>
        </div>
        <div className="grid">
          {filteredProdutos.map(produto => (
            <div key={produto.id} className="card">
              <img src={produto.imagem} alt={produto.nome} />
              <div className="card-content">
                <h2 className="text-xl font-semibold text-primary">{produto.nome}</h2>
                <p className="text-gray-600">R$ {produto.preco.toFixed(2)}</p>
                <p className="text-sm text-secondary">{produto.categoria}</p>
                <button onClick={() => addToCart(produto)} className="btn">
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="bg-primary text-white py-4 mt-8">
        <p className="text-center">&copy; 2025 Queen Store. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;