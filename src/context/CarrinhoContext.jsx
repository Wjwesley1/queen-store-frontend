import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { showNotification } from '../components/common/ToastNotification';

const CarrinhoContext = createContext();

export const useCarrinho = () => useContext(CarrinhoContext);

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);

  const carregarCarrinho = useCallback(() => {
    api.get('/api/carrinho')
      .then(res => setCarrinho(res.data))
      .catch(() => setCarrinho([]));
  }, []);

  useEffect(() => {
    carregarCarrinho();
  }, [carregarCarrinho]);

  const addToCart = async (produto, quantidade = 1) => {
    if (produto.estoque < quantidade) {
      showNotification('Estoque insuficiente! 😔');
      return;
    }
    try {
      await api.post('/api/carrinho', { produto_id: produto.id, quantidade });
      carregarCarrinho();
      showNotification(`${quantidade} × ${produto.nome} adicionado! 🛒`);
    } catch {
      showNotification('Erro ao adicionar ao carrinho 😢');
    }
  };

  const removeFromCart = async (produto_id) => {
    try {
      await api.delete(`/api/carrinho/${produto_id}`);
      carregarCarrinho();
    } catch {}
  };

  const totalItens = carrinho.reduce((sum, i) => sum + i.quantidade, 0);
  const totalValor = carrinho.reduce((sum, i) => sum + (i.preco * i.quantidade), 0).toFixed(2);

  return (
    <CarrinhoContext.Provider value={{
      carrinho,
      addToCart,
      removeFromCart,
      carregarCarrinho,
      totalItens,
      totalValor
    }}>
      {children}
    </CarrinhoContext.Provider>
  );
};
