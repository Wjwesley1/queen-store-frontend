// src/pages/MinhaConta.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || '';

const STATUS_CONFIG = {
  pendente:  { label: 'PENDENTE',  bg: 'bg-yellow-500' },
  pago:      { label: 'PAGO',      bg: 'bg-green-500'  },
  enviado:   { label: 'ENVIADO',   bg: 'bg-blue-500'   },
  entregue:  { label: 'ENTREGUE', bg: 'bg-purple-500' },
  concluido: { label: 'CONCLUÍDO', bg: 'bg-gray-500'   },
};

const inputClass = "w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#0F1B3F] focus:outline-none text-base bg-white transition-colors duration-200";
const labelClass = "block text-xs font-bold text-[#0F1B3F] uppercase tracking-widest mb-2";

export default function MinhaConta() {
  const { cliente, loading } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [enderecos, setEnderecos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formEndereco, setFormEndereco] = useState({});
  const [deletandoEnd, setDeletandoEnd] = useState(null);
  const [openEndereco, setOpenEndereco] = useState(false);
  const [openCadastro, setOpenCadastro] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [cepBuscando, setCepBuscando] = useState(false);

  const getAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('queen_token')}` } });

  useEffect(() => {
    const authHeader = { headers: { Authorization: `Bearer ${localStorage.getItem('queen_token')}` } };
    if (!cliente) return;
    axios.get(`${API_URL}/api/clientes/pedidos`, authHeader)
      .then(res => setPedidos(res.data))
      .catch(() => {});
  }, [cliente]);

  useEffect(() => {
    const authHeader = { headers: { Authorization: `Bearer ${localStorage.getItem('queen_token')}` } };
    if (openEndereco && cliente) {
      axios.get(`${API_URL}/api/cliente/enderecos`, authHeader)
        .then(res => setEnderecos(res.data || []))
        .catch(() => {});
    }
  }, [openEndereco, cliente]);

  const handleCepChange = async (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5);
    setFormEndereco(prev => ({ ...prev, cep: value }));

    if (value.replace('-', '').length === 8) {
      setCepBuscando(true);
      try {
        const res = await axios.get(`https://viacep.com.br/ws/${value.replace('-', '')}/json/`);
        if (!res.data.erro) {
          setFormEndereco(prev => ({
            ...prev,
            endereco: res.data.logradouro || prev.endereco,
            cidade: res.data.localidade || prev.cidade,
            estado: res.data.uf || prev.estado,
          }));
        }
      } catch {}
      finally { setCepBuscando(false); }
    }
  };

  const salvarEndereco = async () => {
    setSuccessMsg(''); setErrorMsg('');
    if (formEndereco.cep && !/^\d{5}-\d{3}$/.test(formEndereco.cep)) {
      setErrorMsg('CEP inválido! Use 00000-000'); return;
    }
    try {
      if (isEditing) {
        await axios.patch(`${API_URL}/api/cliente/enderecos/${formEndereco.id}`, formEndereco, getAuth());
      } else {
        await axios.post(`${API_URL}/api/cliente/enderecos`, formEndereco, getAuth());
      }
      setSuccessMsg('Endereço salvo com sucesso!');
      setShowForm(false);
      const res = await axios.get(`${API_URL}/api/cliente/enderecos`, getAuth());
      setEnderecos(res.data || []);
    } catch (err) {
      setErrorMsg(err.response?.data?.erro || 'Erro ao salvar endereço');
    }
  };

  const excluirEndereco = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/cliente/enderecos/${id}`, getAuth());
      setEnderecos(prev => prev.filter(e => e.id !== id));
      setDeletandoEnd(null);
      setSuccessMsg('Endereço excluído!');
    } catch {
      setErrorMsg('Erro ao excluir');
    }
  };

  const salvarCadastro = async () => {
    setSuccessMsg(''); setErrorMsg('');
    if (novaSenha && novaSenha !== confirmSenha) { setErrorMsg('As senhas não coincidem!'); return; }
    if (novaSenha && novaSenha.length < 6) { setErrorMsg('Senha deve ter pelo menos 6 caracteres'); return; }
    setSalvando(true);
    try {
      await axios.patch(`${API_URL}/api/clientes/atualizar`, {
        whatsapp: whatsapp || undefined,
        senha: novaSenha || undefined,
        senha_confirm: confirmSenha || undefined
      }, getAuth());
      setSuccessMsg('Cadastro atualizado com sucesso!');
      setNovaSenha(''); setConfirmSenha('');
    } catch (err) {
      setErrorMsg(err.response?.data?.erro || 'Erro ao atualizar cadastro');
    } finally {
      setSalvando(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-2xl font-bold text-[#0F1B3F]">Carregando...</p>
    </div>
  );
  if (!cliente) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-6 max-w-3xl">

        {/* SAUDAÇÃO */}
        <div className="mb-8">
          <p className="text-sm font-bold text-pink-500 uppercase tracking-widest mb-1">Minha Conta</p>
          <h1 className="text-4xl font-bold text-[#0F1B3F]">Olá, {cliente.nome}! 👑</h1>
          <p className="text-gray-400 mt-1">Bem-vinda de volta, rainha</p>
        </div>

        {/* NOTIFICAÇÕES */}
        {successMsg && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-2xl font-bold text-sm mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-2xl font-bold text-sm mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {errorMsg}
          </div>
        )}

        <div className="space-y-5">

          {/* ==================== PEDIDOS ==================== */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#0F1B3F]">Meus Pedidos</h2>
            </div>

            <div className="p-8">
              {pedidos.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-400 mb-5">Você ainda não fez nenhum pedido</p>
                  <Link to="/" className="bg-[#0F1B3F] text-white px-8 py-3 rounded-full font-bold hover:bg-pink-600 transition text-sm">
                    Vamos comprar?
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {pedidos.map(pedido => {
                    const cfg = STATUS_CONFIG[pedido.status] || STATUS_CONFIG.pendente;
                    return (
                      <div key={pedido.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <span className="font-bold text-[#0F1B3F]">Pedido #{pedido.id}</span>
                            <p className="text-xs text-gray-400 mt-0.5">{new Date(pedido.criado_em).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${cfg.bg}`}>
                              {cfg.label}
                            </span>
                            <p className="text-sm font-bold text-green-600 mt-1">
                              R$ {parseFloat(pedido.valor_total).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        {pedido.rastreio && (
                          <a
                            href={`https://www.linkcorreios.com.br/${pedido.rastreio}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-[#0F1B3F] underline"
                          >
                            Rastrear pedido →
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ==================== ENDEREÇOS ==================== */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => { setOpenEndereco(!openEndereco); setShowForm(false); }}
              className="w-full px-8 py-6 flex justify-between items-center hover:bg-gray-50 transition"
            >
              <h2 className="text-lg font-bold text-[#0F1B3F]">Meus Endereços de Entrega</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-5 h-5 text-gray-400 transition-transform ${openEndereco ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openEndereco && (
              <div className="px-8 pb-8 border-t border-gray-100 pt-6">

                {/* Botão adicionar */}
                {!showForm && (
                  <button
                    onClick={() => { setFormEndereco({}); setIsEditing(false); setShowForm(true); }}
                    className="flex items-center gap-2 bg-[#0F1B3F] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-pink-600 transition mb-6"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Adicionar Endereço
                  </button>
                )}

                {/* FORMULÁRIO */}
                {showForm && (
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-6">
                    <h3 className="text-sm font-bold text-[#0F1B3F] uppercase tracking-widest mb-5">
                      {isEditing ? 'Editar Endereço' : 'Novo Endereço'}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className={labelClass}>Apelido <span className="text-gray-300 normal-case tracking-normal font-normal">(opcional)</span></label>
                        <input type="text" value={formEndereco.apelido || ''} onChange={e => setFormEndereco({...formEndereco, apelido: e.target.value})} className={inputClass} placeholder="Ex: Casa, Trabalho" />
                      </div>

                      <div>
                        <label className={labelClass}>CEP {cepBuscando && <span className="text-pink-400 normal-case tracking-normal font-normal">buscando...</span>}</label>
                        <input
                          type="text" maxLength={9} placeholder="00000-000"
                          value={formEndereco.cep || ''}
                          onChange={handleCepChange}
                          className={`${inputClass} ${
                            formEndereco.cep?.replace('-','').length === 8 ? 'border-green-400' :
                            formEndereco.cep?.length > 0 ? 'border-red-300' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Rua / Número / Bairro</label>
                        <input type="text" value={formEndereco.endereco || ''} onChange={e => setFormEndereco({...formEndereco, endereco: e.target.value})} className={inputClass} />
                      </div>

                      <div>
                        <label className={labelClass}>Cidade</label>
                        <input type="text" value={formEndereco.cidade || ''} onChange={e => setFormEndereco({...formEndereco, cidade: e.target.value})} className={inputClass} />
                      </div>

                      <div>
                        <label className={labelClass}>Estado</label>
                        <input type="text" maxLength={2} value={formEndereco.estado || ''} onChange={e => setFormEndereco({...formEndereco, estado: e.target.value.toUpperCase()})} className={inputClass} placeholder="MG" />
                      </div>

                      <div className="md:col-span-2">
                        <label className={labelClass}>Complemento <span className="text-gray-300 normal-case tracking-normal font-normal">(opcional)</span></label>
                        <input type="text" value={formEndereco.complemento || ''} onChange={e => setFormEndereco({...formEndereco, complemento: e.target.value})} className={inputClass} placeholder="Apto, Bloco..." />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-5">
                      <button onClick={salvarEndereco} className="bg-[#0F1B3F] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-pink-600 transition">
                        Salvar
                      </button>
                      <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-300 transition">
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* LISTA DE ENDEREÇOS */}
                {enderecos.length === 0 && !showForm ? (
                  <p className="text-sm text-gray-400">Você ainda não tem endereços salvos.</p>
                ) : (
                  <div className="space-y-3">
                    {enderecos.map(end => (
                      <div key={end.id} className={`p-5 rounded-2xl border-2 ${end.principal ? 'border-[#0F1B3F] bg-blue-50' : 'border-gray-100 bg-gray-50'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-[#0F1B3F] text-sm">{end.apelido || 'Endereço'}</p>
                              {end.principal && <span className="text-xs bg-[#0F1B3F] text-white px-2 py-0.5 rounded-full font-bold">Principal</span>}
                            </div>
                            <p className="text-sm text-gray-600">{end.endereco}</p>
                            <p className="text-sm text-gray-600">{end.cidade}, {end.estado} — {end.cep}</p>
                            {end.complemento && <p className="text-sm text-gray-400">{end.complemento}</p>}
                          </div>

                          <div className="flex gap-2 ml-4">
                            {/* Editar */}
                            <button
                              onClick={() => { setFormEndereco(end); setIsEditing(true); setShowForm(true); }}
                              title="Editar"
                              className="text-gray-400 hover:text-[#0F1B3F] transition p-2 rounded-full hover:bg-white"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2.414a2 2 0 01.586-1.414z" />
                              </svg>
                            </button>

                            {/* Excluir com confirmação inline */}
                            {deletandoEnd === end.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => excluirEndereco(end.id)} className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold hover:bg-red-600">
                                  SIM
                                </button>
                                <button onClick={() => setDeletandoEnd(null)} className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full font-bold hover:bg-gray-400">
                                  NÃO
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeletandoEnd(end.id)}
                                title="Excluir"
                                className="text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-red-50"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ==================== ALTERAR CADASTRO ==================== */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setOpenCadastro(!openCadastro)}
              className="w-full px-8 py-6 flex justify-between items-center hover:bg-gray-50 transition"
            >
              <h2 className="text-lg font-bold text-[#0F1B3F]">Alterar Meu Cadastro</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-5 h-5 text-gray-400 transition-transform ${openCadastro ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openCadastro && (
              <div className="px-8 pb-8 border-t border-gray-100 pt-6">
                <div className="grid md:grid-cols-2 gap-4">

                  {/* Bloqueados */}
                  <div>
                    <label className={labelClass}>Nome <span className="text-gray-300 normal-case tracking-normal font-normal">(não editável)</span></label>
                    <input type="text" value={cliente.nome} disabled className={`${inputClass} bg-gray-50 text-gray-400 cursor-not-allowed`} />
                  </div>
                  <div>
                    <label className={labelClass}>Email <span className="text-gray-300 normal-case tracking-normal font-normal">(não editável)</span></label>
                    <input type="email" value={cliente.email} disabled className={`${inputClass} bg-gray-50 text-gray-400 cursor-not-allowed`} />
                  </div>

                  {/* WhatsApp */}
                  <div className="md:col-span-2">
                    <label className={labelClass}>WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="(31) 99999-9999"
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  {/* Senha */}
                  <div>
                    <label className={labelClass}>Nova Senha <span className="text-gray-300 normal-case tracking-normal font-normal">(deixe vazio pra não alterar)</span></label>
                    <input type="password" placeholder="••••••••" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Confirmar Senha</label>
                    <input type="password" placeholder="••••••••" value={confirmSenha} onChange={e => setConfirmSenha(e.target.value)} className={inputClass} />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={salvarCadastro}
                    disabled={salvando}
                    className="bg-[#0F1B3F] text-white px-10 py-3 rounded-full font-bold text-sm hover:bg-pink-600 transition disabled:opacity-60 flex items-center gap-2"
                  >
                    {salvando ? (
                      <>
                        <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Salvando...
                      </>
                    ) : 'Salvar Alterações'}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}