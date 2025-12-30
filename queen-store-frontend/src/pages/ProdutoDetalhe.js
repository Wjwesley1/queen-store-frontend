import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCarrinho } from '../App';
import { useAuth } from '../context/AuthContext';  // ← ADICIONA ISSO PRA VERIFICAR LOGIN

const API_URL = 'https://queen-store-api.onrender.com';

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [varianteSelecionada, setVarianteSelecionada] = useState(0);
  const { addToCart } = useCarrinho();
  const { cliente } = useAuth();  // pra verificar se tá logado

  useEffect(() => {
    axios.get(`${API_URL}/api/produtos`)
      .then(res => {
        const encontrado = res.data.find(p => p.id === parseInt(id));
        setProduto(encontrado || null);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar produto:", err);
        setLoading(false);
      });
  }, [id]);

  // ÍCONE CORAÇÃO
  const HeartIcon = ({ filled }) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"}
         stroke={filled ? "#ef4444" : "#6b7280"} strokeWidth="2"
         className="transition-all hover:scale-125 cursor-pointer">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );

  // FUNÇÃO TOGGLE DESEJO (SALVA NO BACKEND QUANDO LOGADO)
  const toggleDesejo = async () => {
    if (!cliente) {
      alert('Faça login para salvar nos desejos! 💜');
      return;
    }

    try {
      // Verifica se já tá salvo (simples, sem lista local por enquanto)
      // Quando tiver rota GET desejos, a gente adiciona verificação real
      await axios.post(`${API_URL}/api/desejos`, { produto_id: produto.id });
      alert('Produto salvo nos desejos! 💜');
    } catch (err) {
      alert('Erro ao salvar desejo');
    }
  };

  // FUNÇÃO IS DESEJO (POR ENQUANTO FALSE, QUANDO TIVER LISTA REAL, VERIFICA)
  const isDesejo = () => false;  // muda pra true quando implementar a lista

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-4xl font-bold text-[#0F1B3F] animate-pulse">Carregando rainha...</div>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 text-center">
        <h2 className="text-5xl font-bold text-red-600 mb-8">Produto não encontrado</h2>
        <Link to="/" className="text-[#0F1B3F] text-xl hover:underline font-bold">Voltar para loja</Link>
      </div>
    );
  }

  const variantes = produto.variantes && produto.variantes.length > 0
    ? produto.variantes
    : [{ tamanho: "", preco: produto.preco, estoque: produto.estoque }];

  const varianteAtual = variantes[varianteSelecionada] || variantes[0];
  const estoqueEsgotado = varianteAtual.estoque <= 0;

  const fotos = produto.imagens && produto.imagens.length > 0
    ? produto.imagens
    : ['https://i.ibb.co/0jG4vK8/geleia-maracuja.jpg'];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        <Link to="/" className="inline-flex items-center text-[#0F1B3F] font-bold text-lg hover:underline mb-8 block">
          Voltar para loja
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 gap-0">

          {/* GALERIA DE FOTOS */}
          <div className="relative">
            <img
              src={fotos[fotoAtiva]}
              alt={produto.nome}
              className="w-full h-96 lg:h-full object-cover"
            />
            {produto.badge && (
              <div className="absolute top-6 left-6 bg-[#0F1B3F] text-white px-6 py-3 rounded-full font-bold shadow-lg">
                {produto.badge}
              </div>
            )}
            {estoqueEsgotado && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <span className="text-white text-5xl font-bold bg-red-600 px-10 py-6 rounded-full animate-pulse">
                  ESGOTADO
                </span>
              </div>
            )}

            {/* BOTÃO CORAÇÃO — AGORA FUNCIONA! */}
            <button 
              onClick={toggleDesejo} 
              className="absolute top-6 right-6 z-10 p-3 bg-white/80 rounded-full shadow-lg hover:bg-white transition"
            >
              <HeartIcon filled={isDesejo()} />
            </button>

            {fotos.length > 1 && (
              <div className="grid grid-cols-5 gap-3 p-6 bg-gray-50">
                {fotos.map((foto, i) => (
                  <button
                    key={i}
                    onClick={() => setFotoAtiva(i)}
                    className={`rounded-xl overflow-hidden border-4 transition-all ${
                      fotoAtiva === i ? 'border-[#0F1B3F] shadow-lg scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={foto} alt="" className="w-full h-24 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFORMAÇÕES DO PRODUTO */}
          <div className="p-8 lg:p-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#0F1B3F] mb-6">
              {produto.nome}
            </h1>

            {/* VARIANTE */}
            {variantes.length > 1 && (
              <div className="mb-10">
                <p className="text-lg font-semibold text-gray-700 mb-4">Escolha o tamanho:</p>
                <div className="grid grid-cols-3 gap-4 max-w-lg">
                  {variantes.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setVarianteSelecionada(i)}
                      disabled={v.estoque <= 0}
                      className={`py-6 rounded-2xl font-bold text-2xl transition-all border-4 shadow-lg relative overflow-hidden ${
                        varianteSelecionada === i
                          ? 'bg-[#0F1B3F] text-white border-[#0F1B3F]'
                          : v.estoque <= 0
                          ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
                          : 'bg-white text-[#0F1B3F] border-[#0F1B3F] hover:bg-[#0F1B3F] hover:text-white'
                      }`}
                    >
                      {v.tamanho}
                      {v.estoque <= 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">Esgotado</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PREÇO */}
            <div className="mb-8">
              <div className="text-5xl font-bold text-[#0F1B3F]">
                R$ {parseFloat(varianteAtual.preco).toFixed(2)}
              </div>
              <div className={`text-xl font-bold mt-3 ${estoqueEsgotado ? 'text-red-600' : 'text-green-600'}`}>
                {estoqueEsgotado ? 'Esgotado neste tamanho' : `${varianteAtual.estoque} unidades disponíveis`}
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {produto.descricao}
            </p>

            {/* BOTÃO ADICIONAR */}
            <button
              onClick={() => !estoqueEsgotado && addToCart({...produto, ...varianteAtual, tamanho: varianteAtual.tamanho})}
              disabled={estoqueEsgotado}
              className={`w-full py-6 rounded-2xl text-2xl font-bold transition-all transform hover:scale-105 shadow-2xl ${
                estoqueEsgotado
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-[#0F1B3F] text-white hover:bg-[#1a2d5e]'
              }`}
            >
              {estoqueEsgotado ? 'Esgotado' : 'Adicionar ao Carrinho'}
            </button>

            <p className="text-center text-gray-600 mt-8 text-lg">
              Frete grátis acima de R$ 150 • Entrega em todo Brasil
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}