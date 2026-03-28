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

  const [imagensFiles, setImagensFiles] = useState([]); // Arquivos selecionados (File objects)
  const [imagensPreview, setImagensPreview] = useState([]); // URLs de preview para mostrar
  const [status, setStatus] = useState('');

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

    // Gerar previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagensPreview(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Enviando produto e imagens...');

    if (imagensFiles.length === 0) {
      setStatus('Selecione pelo menos 1 imagem!');
      return;
    }

    const formData = new FormData();

    // Append dos campos textuais
    Object.keys(form).forEach(key => {
      if (key !== 'imagens') { // não tem mais 'imagens' como string
        formData.append(key, form[key]);
      }
    });

    // Append das imagens (mesmo nome que o multer espera no backend)
    imagensFiles.forEach(file => {
      formData.append('imagens', file);
    });

    // Adicione headers se precisar de auth (seu x-session-id)
    try {
      const response = await axios.post(`${API_URL}/api/produtos`, formData, {
        headers: {
          'x-session-id': 'admin-temp',
          // NÃO defina 'Content-Type' manualmente — o browser cuida do multipart
        }
      });

      setStatus('Produto cadastrado com sucesso! Imagens salvas no Google Drive.');
      setTimeout(() => navigate('/admin/dashboard'), 2000);
      
      // Opcional: console.log(response.data) para ver os links retornados
      console.log('Links das imagens:', response.data.imagens);
    } catch (err) {
      setStatus('Erro ao cadastrar. Verifique o console!');
      console.error('Erro completo:', err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-5xl font-bold text-[#0F1B3F]">Cadastrar Produto</h1>
            <Link to="/admin/dashboard" className="bg-[#0F1B3F] text-white px-8 py-4 rounded-full hover:bg-pink-600 transition">
              Voltar ao Painel
            </Link>
          </div>

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

  {/* DESCRIÇÃO */}
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

  {/* INGREDIENTES */}
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

  {/* FRASE PROMOCIONAL */}
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

  {/* SEÇÃO DE IMAGENS - já está correta no seu código */}
  <div>
    <label className="block text-xl font-bold text-[#0F1B3F] mb-4">
      Fotos do Produto (máx. 4 - selecione arquivos)
    </label>
    
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={handleImagensChange}
      className="w-full px-6 py-4 rounded-xl border-2 border-[#0F1B3F] focus:border-pink-500 focus:outline-none text-lg file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0F1B3F] file:text-white hover:file:bg-pink-600"
    />

    {imagensPreview.length > 0 && (
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {imagensPreview.map((preview, index) => (
          <img
            key={index}
            src={preview}
            alt={`Preview ${index + 1}`}
            className="w-full h-40 object-cover rounded-xl shadow-md"
          />
        ))}
      </div>
    )}

    <p className="mt-2 text-sm text-gray-600">
      {imagensFiles.length} imagem(s) selecionada(s) — pronto para upload!
    </p>
  </div>

  {/* BOTÃO FINAL */}
  <div className="text-center pt-8">
    <button
      type="submit"
      className="bg-gradient-to-r from-[#0F1B3F] to-pink-600 text-white px-16 py-6 rounded-full text-3xl font-bold hover:scale-110 transition-all shadow-2xl"
    >
      CADASTRAR PRODUTO
    </button>
    {status && (
      <p className={`text-2xl font-bold mt-6 ${status.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
        {status}
      </p>
    )}
  </div>
</form>
        </div>
      </div>
    </div>
  );
} 