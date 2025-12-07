// src/pages/Admin/CadastrarProduto.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://queen-store-api.onrender.com';

export default function CadastrarProduto() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    preco: '',
    estoque: '',
    categoria: 'Geleia de Banho',
    descricao: '',
    ingredientes: '',
    frase_promocional: '',
    imagens: ['', '', '', ''], // 4 fotos
    badge: '',
    video_url: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImagemChange = (index, value) => {
    const novasImagens = [...form.imagens];
    novasImagens[index] = value;
    setForm(prev => ({ ...prev, imagens: novasImagens }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Enviando...');

    const produtoParaEnviar = {
      ...form,
      preco: parseFloat(form.preco),
      estoque: parseInt(form.estoque) || 0,
      imagens: form.imagens.filter(url => url.trim() !== ''),
    };

    try {
      await axios.post(`${API_URL}/api/produtos`, produtoParaEnviar, {
        headers: { 'x-session-id': 'admin-temp' }
      });
      setStatus('Produto cadastrado com sucesso!');
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      setStatus('Erro ao cadastrar. Tenta de novo, rainha!');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <h1 className="text-4xl font-bold text-[#0F1B3F] mb-8 text-center">
            Cadastrar Novo Produto
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* NOME E PREÇO */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xl font-bold text-[#0F1B3F] mb-3">Nome do Produto</label>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 rounded-xl border-2 border-[#0F1B3F] focus:border-pink-500 focus:outline-none text-lg"
                  placeholder="Ex: Geleia de Banho Melancia 200ml"
                />
              </div>
              <div>
                <label className="block text-xl font-bold text-[#0F1B3F] mb-3">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  name="preco"
                  value={form.preco}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 rounded-xl border-2 border-[#0F1B3F] focus:border-pink-500 focus:outline-none text-lg"
                  placeholder="29.90"
                />
              </div>
            </div>

            {/* ESTOQUE E CATEGORIA */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xl font-bold text-[#0F1B3F] mb-3">Estoque</label>
                <input
                  type="number"
                  name="estoque"
                  value={form.estoque}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 rounded-xl border-2 border-[#0F1B3F] focus:border-pink-500 focus:outline-none text-lg"
                  placeholder="15"
                />
              </div>
              <div>
                <label className="block text-xl font-bold text-[#0F1B3F] mb-3">Categoria</label>
                <select
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-xl border-2 border-[#0F1B3F] focus:border-pink-500 focus:outline-none text-lg"
                >
                  <option>Geleia de Banho</option>
                  <option>Sabonete</option>
                  <option>Kit Presente</option>
                  <option>Edição Especial</option>
                </select>
              </div>
            </div>

            {/* DESCRIÇÃO E INGREDIENTES */}
            <div>
              <label className="block text-xl font-bold text-[#0F1B3F] mb-3">Descrição</label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                rows="4"
                className="w-full px-6 py-4 rounded-xl border-2 border-[#0F1B3F] focus:border-pink-500 focus:outline-none text-lg"
                placeholder="Fala tudo sobre esse produto incrível..."
              />
            </div>

            <div>
              <label className="block text-xl font-bold text-[#0F1B3F] mb-3">Ingredientes</label>
              <input
                type="text"
                name="ingredientes"
                value={form.ingredientes}
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-xl border-2 border-[#0F1B3F] focus:border-pink-500 focus:outline-none text-lg"
                placeholder="Mel, óleo essencial de baunilha, base glicerinada..."
              />
            </div>

            <div>
              <label className="block text-xl font-bold text-[#0F1B3F] mb-3">Frase Promocional</label>
              <input
                type="text"
                name="frase_promocional"
                value={form.frase_promocional}
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-xl border-2 border-[#0F1B3F] focus:border-pink-500 focus:outline-none text-lg"
                placeholder="Rainha, mergulhe no poder do maracujá azedo..."
              />
            </div>

            {/* 4 FOTOS */}
            <div>
              <label className="block text-xl font-bold text-[#0F1B3F] mb-4">Fotos (mínimo 1, máximo 4)</label>
              <div className="grid md:grid-cols-2 gap-6">
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    type="url"
                    value={form.imagens[i]}
                    onChange={(e) => handleImagemChange(i, e.target.value)}
                    placeholder={`URL da foto ${i + 1} (ibb.co, Cloudinary, etc)`}
                    className="w-full px-6 py-4 rounded-xl border-2 border-[#0F1B3F] focus:border-pink-500 focus:outline-none text-lg"
                  />
                ))}
              </div>
            </div>

            {/* BADGE E VÍDEO (OPCIONAL) */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xl font-bold text-[#0F1B3F] mb-3">Badge (ex: LANÇAMENTO)</label>
                <input
                  type="text"
                  name="badge"
                  value={form.badge}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-xl border-2 border-[#0F1B3F] focus:border-pink-500 focus:outline-none text-lg"
                  placeholder="LANÇAMENTO • VERÃO 2025 • MAIS VENDIDO"
                />
              </div>
              <div>
                <label className="block text-xl font-bold text-[#0F1B3F] mb-3">Vídeo do YouTube (opcional)</label>
                <input
                  type="url"
                  name="video_url"
                  value={form.video_url}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-xl border-2 border-[#0F1B3F] focus:border-pink-500 focus:outline-none text-lg"
                  placeholder="https://www.youtube.com/embed/ABC123"
                />
              </div>
            </div>

            {/* BOTÃO FINAL */}
            <div className="text-center pt-8">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#0F1B3F] to-pink-600 text-white px-16 py-6 rounded-full text-3xl font-bold hover:scale-110 transition-all shadow-2xl"
              >
                CADASTRAR PRODUTO
              </button>
              {status && <p className="text-2xl font-bold text-green-600 mt-6">{status}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}