// src/pages/Admin/ControleEstoque.jsx — 100% CORRIGIDO E FUNCIONANDO
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'https://queen-store-api.onrender.com';

export default function ControleEstoque() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [novoEstoque, setNovoEstoque] = useState('');

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

  const atualizarEstoque = async (id, estoqueAtual) => {
    const novoValor = parseInt(novoEstoque);
    if (isNaN(novoValor) || novoValor < 0) {
      alert('Digite um número válido');
      return;
    }

    try {
      await axios.patch(`${API_URL}/api/produtos/${id}/estoque`, {
        estoque: novoValor
      }, {
        headers: { 'x-session-id': 'admin' }
      });

      setProdutos(prev => prev.map(p => 
        p.id === id ? { ...p, estoque: novoValor } : p
      ));
      setEditando(null);
      setNovoEstoque('');
      alert('Estoque atualizado com sucesso!');
    } catch (err) {
      alert('Erro ao atualizar estoque');
    }
  };

  // CORREÇÃO: fechava o if cedo demais — agora tá certo!
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-4xl text-[#0F1B3F]">
        Carregando estoque...
      </div>
    );
  }

  // AQUI É O RETURN PRINCIPAL — TAVA FORA DO LUGAR ANTES
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-5xl font-bold text-[#0F1B3F]">Controle de Estoque</h1>
            <Link to="/admin/dashboard" className="bg-[#0F1B3F] text-white px-8 py-4 rounded-full hover:bg-pink-600 transition">
              Voltar ao Painel
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-4 border-[#0F1B3F]">
                  <th className="text-left py-6 text-xl font-bold text-[#0F1B3F]">Produto</th>
                  <th className="text-center py-6 text-xl font-bold text-[#0F1B3F]">Estoque Atual</th>
                  <th className="text-center py-6 text-xl font-bold text-[#0F1B3F]">Status</th>
                  <th className="text-center py-6 text-xl font-bold text-[#0F1B3F]">Ação</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(produto => (
                  <tr key={produto.id} className="border-b hover:bg-pink-50 transition">
                    <td className="py-8 text-lg font-medium">{produto.nome}</td>
                    <td className="text-center text-2xl font-bold">
                      {editando === produto.id ? (
                        <input
                          type="number"
                          value={novoEstoque}
                          onChange={(e) => setNovoEstoque(e.target.value)}
                          className="w-24 px-4 py-2 border-2 border-[#0F1B3F] rounded-xl text-center"
                          autoFocus
                        />
                      ) : (
                        <span className={produto.estoque <= 5 ? 'text-red-600' : 'text-green-600'}>
                          {produto.estoque}
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      {produto.estoque === 0 ? (
                        <span className="bg-red-600 text-white px-6 py-3 rounded-full font-bold">ESGOTADO</span>
                      ) : produto.estoque <= 5 ? (
                        <span className="bg-yellow-500 text-white px-6 py-3 rounded-full font-bold">ESTOQUE BAIXO</span>
                      ) : (
                        <span className="bg-green-600 text-white px-6 py-3 rounded-full font-bold">DISPONÍVEL</span>
                      )}
                    </td>
                    <td className="text-center">
                      {editando === produto.id ? (
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => atualizarEstoque(produto.id)}
                            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => {
                              setEditando(null);
                              setNovoEstoque('');
                            }}
                            className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditando(produto.id);
                            setNovoEstoque(produto.estoque);
                          }}
                          className="bg-[#0F1B3F] text-white px-8 py-4 rounded-full hover:bg-pink-600 transition font-bold"
                        >
                          Alterar Estoque
                        </button>
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