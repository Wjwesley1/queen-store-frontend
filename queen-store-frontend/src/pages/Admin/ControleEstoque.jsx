// src/pages/Admin/ControleEstoque.jsx — EDIÇÃO COMPLETA DE PRODUTOS
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'https://queen-store-api.onrender.com';

export default function ControleEstoque() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});
  const [deletando, setDeletando] = useState(null); // ID do produto aguardando confirmação

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/produtos`);
      setProdutos(res.data);
      setLoading(false);
    } catch (err) {
      alert('Erro ao carregar produtos');
      setLoading(false);
    }
  };

  const iniciarEdicao = (produto) => {
    setEditando(produto.id);
    setForm({
      nome: produto.nome,
      preco: produto.preco,
      estoque: produto.estoque,
      categoria: produto.categoria,
      descricao: produto.descricao || '',
      badge: produto.badge || ''
    });
  };

  const salvarEdicao = async (id) => {
    try {
      await axios.patch(`${API_URL}/api/produtos/${id}`, form);
      setProdutos(prev => prev.map(p => p.id === editando ? { ...p, ...form } : p));
      setEditando(null);
      alert('Produto atualizado com sucesso!');
    } catch (err) {
      alert('Erro ao salvar');
    }
  };

  const cancelarEdicao = () => {
    setEditando(null);
    setForm({});
  };

  const confirmarDelete = (id) => {
    setDeletando(id);
  };

  const cancelarDelete = () => {
    setDeletando(null);
  };

  const deletarProduto = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/produtos/${id}`);
      setProdutos(prev => prev.filter(p => p.id !== id));
      setDeletando(null);
    } catch (err) {
      alert('Erro ao excluir produto');
      setDeletando(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-4xl text-[#0F1B3F]">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-5xl font-bold text-[#0F1B3F]">Controle Total de Produtos</h1>
            <Link to="/admin/dashboard" title="Voltar ao Painel" className="bg-[#0F1B3F] text-white p-4 rounded-full hover:bg-pink-600 transition flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-4 border-[#0F1B3F]">
                  <th className="text-left py-6 text-xl font-bold text-[#0F1B3F]">Produto</th>
                  <th className="text-center py-6 text-xl font-bold text-[#0F1B3F]">Preço</th>
                  <th className="text-center py-6 text-xl font-bold text-[#0F1B3F]">Estoque</th>
                  <th className="text-center py-6 text-xl font-bold text-[#0F1B3F]">Categoria</th>
                  <th className="text-center py-6 text-xl font-bold text-[#0F1B3F]">Badge</th>
                  <th className="text-center py-6 text-xl font-bold text-[#0F1B3F]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(produto => (
                  <tr key={produto.id} className="border-b hover:bg-pink-50 transition">
                    <td className="py-6">
                      {editando === produto.id ? (
                        <input
                          value={form.nome}
                          onChange={(e) => setForm({...form, nome: e.target.value})}
                          className="w-full px-4 py-2 border-2 border-[#0F1B3F] rounded-xl"
                        />
                      ) : (
                        <span className="font-bold text-lg">{produto.nome}</span>
                      )}
                    </td>

                    <td className="text-center">
                      {editando === produto.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={form.preco}
                          onChange={(e) => setForm({...form, preco: e.target.value})}
                          className="w-24 px-3 py-2 border-2 border-[#0F1B3F] rounded-xl text-center"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-green-600">
                          R$ {parseFloat(produto.preco).toFixed(2)}
                        </span>
                      )}
                    </td>

                    <td className="text-center">
                      {editando === produto.id ? (
                        <input
                          type="number"
                          value={form.estoque}
                          onChange={(e) => setForm({...form, estoque: e.target.value})}
                          className="w-20 px-3 py-2 border-2 border-[#0F1B3F] rounded-xl text-center"
                        />
                      ) : (
                        <span className={produto.estoque <= 5 ? 'text-red-600' : 'text-green-600'} 
                              style={{fontSize: '2rem', fontWeight: 'bold'}}>
                          {produto.estoque}
                        </span>
                      )}
                    </td>

                    <td className="text-center">
                      {editando === produto.id ? (
                        <select
                          value={form.categoria}
                          onChange={(e) => setForm({...form, categoria: e.target.value})}
                          className="px-4 py-2 border-2 border-[#0F1B3F] rounded-xl"
                        >
                          <option>Geleia de Banho</option>
                          <option>Sabonete</option>
                          <option>Kit Presente</option>
                          <option>Edição Especial</option>
                        </select>
                      ) : (
                        <span className="px-4 py-2 bg-[#0F1B3F] text-white rounded-full font-bold">
                          {produto.categoria}
                        </span>
                      )}
                    </td>

                    <td className="text-center">
                      {editando === produto.id ? (
                        <input
                          value={form.badge}
                          onChange={(e) => setForm({...form, badge: e.target.value})}
                          placeholder="LANÇAMENTO"
                          className="w-40 px-3 py-2 border-2 border-[#0F1B3F] rounded-xl text-center"
                        />
                      ) : (
                        <span className="px-4 py-2 bg-pink-600 text-white rounded-full font-bold">
                          {produto.badge || '—'}
                        </span>
                      )}
                    </td>

                    <td className="text-center py-6">
                      {editando === produto.id ? (
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => salvarEdicao(produto.id)}
                            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 font-bold"
                          >
                            SALVAR
                          </button>
                          <button
                            onClick={cancelarEdicao}
                            className="bg-gray-600 text-white px-6 py-3 rounded-full hover:bg-gray-700 font-bold"
                          >
                            CANCELAR
                          </button>
                        </div>
                      ) : deletando === produto.id ? (
                        // Mini confirmação inline
                        <div className="flex gap-2 justify-center items-center">
                          <span className="text-sm font-bold text-red-600">Excluir?</span>
                          <button
                            onClick={() => deletarProduto(produto.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 font-bold text-sm"
                          >
                            SIM
                          </button>
                          <button
                            onClick={cancelarDelete}
                            className="bg-gray-400 text-white px-4 py-2 rounded-full hover:bg-gray-500 font-bold text-sm"
                          >
                            NÃO
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-3 justify-center items-center">
                          <button
                            onClick={() => iniciarEdicao(produto)}
                            title="Editar produto"
                            className="text-[#0F1B3F] hover:text-pink-600 transition p-2 rounded-full hover:bg-pink-50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2.414a2 2 0 01.586-1.414z" />
                            </svg>
                          </button>
                          {/* Ícone lixeira */}
                          <button
                            onClick={() => confirmarDelete(produto.id)}
                            title="Excluir produto"
                            className="text-gray-400 hover:text-red-600 transition p-2 rounded-full hover:bg-red-50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}