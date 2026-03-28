// src/pages/Admin/CadastrarProduto.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
    badge: '',
    video_url: ''
  });

  const [imagensFiles, setImagensFiles] = useState([]);
  const [imagensPreview, setImagensPreview] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImagensChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      alert('Máximo 4 imagens permitidas!');
      return;
    }
    setImagensFiles(files);
    setImagensPreview(files.map(file => URL.createObjectURL(file)));
  };

  const removerImagem = (index) => {
    const novosFiles = imagensFiles.filter((_, i) => i !== index);
    const novosPreviews = imagensPreview.filter((_, i) => i !== index);
    setImagensFiles(novosFiles);
    setImagensPreview(novosPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imagensFiles.length === 0) {
      setStatus('Selecione pelo menos 1 imagem!');
      return;
    }

    setLoading(true);
    setStatus('Enviando produto e imagens...');

    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    imagensFiles.forEach(file => formData.append('imagens', file));

    try {
      const response = await axios.post(`${API_URL}/api/produtos`, formData, {
        headers: { 'x-session-id': 'admin-temp' }
      });

      setStatus('sucesso');
      console.log('Links das imagens:', response.data.imagens);
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      setStatus('erro');
      console.error('Erro completo:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#0F1B3F] focus:outline-none text-base bg-white transition-colors duration-200";
  const labelClass = "block text-sm font-bold text-[#0F1B3F] uppercase tracking-widest mb-2";

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm font-bold text-pink-500 uppercase tracking-widest mb-1">Painel Admin</p>
            <h1 className="text-4xl font-bold text-[#0F1B3F]">Cadastrar Produto</h1>
          </div>
          <Link
            to="/admin/dashboard"
            title="Voltar ao Painel"
            className="bg-[#0F1B3F] text-white p-4 rounded-full hover:bg-pink-600 transition flex items-center justify-center shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* BLOCO 1 — INFORMAÇÕES BÁSICAS */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-lg font-bold text-[#0F1B3F] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#0F1B3F] text-white flex items-center justify-center text-sm font-bold">1</span>
              Informações Básicas
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>Nome do Produto</label>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="Ex: Geleia de Banho Melancia 200ml"
                />
              </div>

              <div>
                <label className={labelClass}>Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  name="preco"
                  value={form.preco}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="29.90"
                />
              </div>

              <div>
                <label className={labelClass}>Estoque</label>
                <input
                  type="number"
                  name="estoque"
                  value={form.estoque}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="15"
                />
              </div>

              <div>
                <label className={labelClass}>Categoria</label>
                <select
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>Geleia de Banho</option>
                  <option>Sabonete</option>
                  <option>Kit Presente</option>
                  <option>Edição Especial</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Badge <span className="text-gray-400 normal-case tracking-normal font-normal">(opcional)</span></label>
                <input
                  type="text"
                  name="badge"
                  value={form.badge}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="LANÇAMENTO • VERÃO 2025"
                />
              </div>
            </div>
          </div>

          {/* BLOCO 2 — DESCRIÇÃO */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-lg font-bold text-[#0F1B3F] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#0F1B3F] text-white flex items-center justify-center text-sm font-bold">2</span>
              Descrição e Detalhes
            </h2>

            <div className="space-y-6">
              <div>
                <label className={labelClass}>Descrição</label>
                <textarea
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                  rows="4"
                  className={inputClass}
                  placeholder="Fala tudo sobre esse produto incrível..."
                />
              </div>

              <div>
                <label className={labelClass}>Ingredientes</label>
                <input
                  type="text"
                  name="ingredientes"
                  value={form.ingredientes}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Mel, óleo essencial de baunilha, base glicerinada..."
                />
              </div>

              <div>
                <label className={labelClass}>Frase Promocional</label>
                <input
                  type="text"
                  name="frase_promocional"
                  value={form.frase_promocional}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Rainha, mergulhe no poder do maracujá azedo..."
                />
              </div>

              <div>
                <label className={labelClass}>Vídeo YouTube <span className="text-gray-400 normal-case tracking-normal font-normal">(opcional)</span></label>
                <input
                  type="url"
                  name="video_url"
                  value={form.video_url}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://www.youtube.com/embed/ABC123"
                />
              </div>
            </div>
          </div>

          {/* BLOCO 3 — IMAGENS */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-lg font-bold text-[#0F1B3F] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#0F1B3F] text-white flex items-center justify-center text-sm font-bold">3</span>
              Fotos do Produto
              <span className="text-sm text-gray-400 font-normal">máx. 4 imagens</span>
            </h2>

            {/* Drop zone */}
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#0F1B3F] hover:bg-gray-50 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm text-gray-500">Clique para selecionar ou arraste as imagens</p>
              <p className="text-xs text-gray-400 mt-1">{imagensFiles.length}/4 selecionada(s)</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagensChange}
                className="hidden"
              />
            </label>

            {/* Previews */}
            {imagensPreview.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagensPreview.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-36 object-cover rounded-2xl shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => removerImagem(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-[#0F1B3F] text-white text-xs px-2 py-1 rounded-full font-bold">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BOTÃO FINAL */}
          <div className="flex flex-col items-center gap-4 pt-2 pb-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0F1B3F] text-white px-16 py-5 rounded-full text-xl font-bold hover:bg-pink-600 transition-all shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Enviando...
                </>
              ) : (
                'CADASTRAR PRODUTO'
              )}
            </button>

            {status === 'sucesso' && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-2xl font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Produto cadastrado com sucesso! Redirecionando...
              </div>
            )}

            {status === 'erro' && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-2xl font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Erro ao cadastrar. Verifique o console!
              </div>
            )}

            {status && status !== 'sucesso' && status !== 'erro' && (
              <p className="text-gray-500 font-medium">{status}</p>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}