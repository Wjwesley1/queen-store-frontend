import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

export default function MinhaConta() {
  const { cliente, loading } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [desejos, setDesejos] = useState([]); // futuro

  // Estados para múltiplos endereços (lista completa)
  const [enderecos, setEnderecos] = useState([]); // ARRAY DE ENDEREÇOS
  const [showForm, setShowForm] = useState(false); // controla o form
  const [isEditing, setIsEditing] = useState(false); // modo edição ou novo
  const [formEndereco, setFormEndereco] = useState({}); // dados atuais do form

  const [openEndereco, setOpenEndereco] = useState(false);
  const [openCadastro, setOpenCadastro] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    if (cliente && openEndereco) {
      // Carrega pedidos
      axios.get(`${API_URL}/api/cliente/pedidos`)
        .then(res => setPedidos(res.data))
        .catch(err => console.error('Erro pedidos:', err));

      // Carrega lista de endereços (quando a seção é aberta)
      axios.get(`${API_URL}/api/cliente/enderecos`)
        .then(res => setEnderecos(res.data || []))
        .catch(err => console.error('Erro ao carregar endereços:', err));
    }
  }, [cliente, API_URL, openEndereco]);

  const salvarEndereco = async () => {
    setSuccessMsg('');
    setErrorMsg('');

    if (formEndereco.cep && !/^\d{5}-\d{3}$/.test(formEndereco.cep)) {
      setErrorMsg('CEP inválido! Use 00000-000');
      return;
    }

    try {
      if (isEditing) {
        await axios.patch(`${API_URL}/api/cliente/enderecos/${formEndereco.id}`, formEndereco);
      } else {
        await axios.post(`${API_URL}/api/cliente/enderecos`, formEndereco);
      }

      setSuccessMsg('Endereço salvo com sucesso! 💜');
      setShowForm(false); // Fecha o form

      // Recarrega a lista
      const res = await axios.get(`${API_URL}/api/cliente/enderecos`);
      setEnderecos(res.data || []);
    } catch (err) {
      setErrorMsg(err.response?.data?.erro || 'Erro ao salvar endereço 😔');
      console.error('Erro completo:', err);
    }
  };

  const handleExcluirEndereco = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este endereço?')) return;

    try {
      await axios.delete(`${API_URL}/api/cliente/enderecos/${id}`);
      setEnderecos(prev => prev.filter(e => e.id !== id));
      setSuccessMsg('Endereço excluído!');
    } catch (err) {
      setErrorMsg('Erro ao excluir');
      console.error('Erro ao excluir:', err);
    }
  };

  const salvarCadastro = async () => {
    setSuccessMsg('');
    setErrorMsg('');

    if (novaSenha && novaSenha !== confirmSenha) {
      setErrorMsg('As senhas não coincidem!');
      return;
    }

    if (novaSenha && novaSenha.length < 6) {
      setErrorMsg('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      await axios.patch(`${API_URL}/api/cliente/atualizar`, {
        whatsapp: formEndereco.whatsapp || undefined, // se quiser usar do form
        senha: novaSenha || undefined,
        senha_confirm: confirmSenha || undefined
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('queen_token')}`
        }
      });

      setSuccessMsg('Cadastro atualizado com sucesso! 💜');
      setNovaSenha('');
      setConfirmSenha('');
    } catch (err) {
      setErrorMsg(err.response?.data?.erro || 'Erro ao atualizar cadastro');
    }
  };

  if (loading) return <p className="text-center text-3xl mt-20">Carregando...</p>;
  if (!cliente) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* SAUDAÇÃO */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0F1B3F]">Olá, {cliente.nome}! 👑</h1>
          <p className="text-xl text-gray-700 mt-4">Bem-vinda de volta, rainha!</p>
        </div>

        {/* PEDIDOS */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-12">
          <h2 className="text-4xl font-bold text-[#0F1B3F] mb-8 text-center">Meus Pedidos</h2>
          {pedidos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-2xl text-gray-600 mb-6">Nenhum pedido ainda...</p>
              <Link to="/" className="bg-primary text-white px-12 py-6 rounded-full text-2xl font-bold hover:scale-105 transition shadow-xl">
                Vamos comprar?
              </Link>
            </div>
          ) : (
            <div className="space-y-10">
              {pedidos.map(pedido => (
                <div key={pedido.id} className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl shadow-2xl p-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h3 className="text-3xl font-bold text-[#0F1B3F]">Pedido #{pedido.id}</h3>
                    <span className={`px-8 py-4 rounded-full text-xl font-bold text-white ${
                      pedido.status === 'concluido' ? 'bg-green-600' :
                      pedido.status === 'enviado' ? 'bg-blue-600' :
                      pedido.status === 'pago' ? 'bg-yellow-600' :
                      'bg-gray-600'
                    }`}>
                      {pedido.status?.toUpperCase() || 'PENDENTE'}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-xl mb-8">
                    <p><strong>Data:</strong> {new Date(pedido.criado_em).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Valor total:</strong> R$ {parseFloat(pedido.valor_total).toFixed(2)}</p>
                    {pedido.rastreio && (
                      <p><strong>Rastreio:</strong> <a href={`https://www.linkcorreios.com.br/${pedido.rastreio}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-bold">
                        Clique aqui
                      </a></p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DESEJOS */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-12">
          <h2 className="text-4xl font-bold text-[#0F1B3F] mb-8 text-center">Meus Desejos 💜</h2>
          {desejos.length === 0 ? (
            <p className="text-center text-2xl text-gray-600">Você ainda não salvou nenhum desejo</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {/* {desejos.map(produto => ( ... ))} */}
            </div>
          )}
        </div>

        {/* SEÇÕES OCULTAS */}
        <div className="space-y-6">
          {/* MEUS ENDEREÇOS */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <button 
              onClick={() => setOpenEndereco(!openEndereco)}
              className="w-full p-8 text-left flex justify-between items-center text-3xl font-bold text-[#0F1B3F] hover:bg-gray-50 transition"
            >
              <span>Meus Endereços de Entrega</span>
              <span className="text-4xl">{openEndereco ? '−' : '+'}</span>
            </button>

            {openEndereco && (
              <div className="p-10 pt-0">
                {/* Botão Adicionar Novo */}
                <button 
                  onClick={() => {
                    setFormEndereco({}); // limpa o form
                    setIsEditing(false);
                    setShowForm(true);
                  }}
                  className="mb-8 bg-gradient-to-r from-[#0F1B3F] to-[#1a2d5e] text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition shadow-xl"
                >
                  + Adicionar Novo Endereço
                </button>

                {/* FORMULÁRIO */}
                {showForm && (
                  <div className="mb-10 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <h3 className="text-2xl font-bold text-[#0F1B3F] mb-6">
                      {isEditing ? 'Editar Endereço' : 'Novo Endereço'}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* APELIDO */}
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-bold mb-2">Apelido (opcional)</label>
                        <input 
                          type="text" 
                          value={formEndereco.apelido || ''} 
                          onChange={e => setFormEndereco({...formEndereco, apelido: e.target.value})} 
                          className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] focus:border-pink-500 transition text-xl"
                        />
                      </div>

                      {/* CEP */}
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">CEP</label>
                        <input 
                          type="text"
                          placeholder="00000-000"
                          value={formEndereco.cep || ''}
                          onChange={async (e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5);
                            setFormEndereco(prev => ({ ...prev, cep: value }));

                            if (value.replace('-', '').length === 8) {
                              try {
                                const cepLimpo = value.replace('-', '');
                                const res = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                                if (!res.data.erro) {
                                  setFormEndereco(prev => ({
                                    ...prev,
                                    endereco: res.data.logradouro || prev.endereco,
                                    cidade: res.data.localidade || prev.cidade,
                                    estado: res.data.uf || prev.estado,
                                  }));
                                }
                              } catch (err) {
                                console.error(err);
                              }
                            }
                          }}
                          maxLength={9}
                          className={`w-full px-6 py-4 rounded-xl border-4 transition text-xl ${
                            formEndereco.cep && formEndereco.cep.replace('-', '').length === 8 
                              ? 'border-green-500' 
                              : formEndereco.cep && formEndereco.cep.length > 0 
                              ? 'border-red-500' 
                              : 'border-[#0F1B3F]'
                          } focus:border-pink-500`}
                          required
                        />
                      </div>

                      {/* RUA */}
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">Rua / Número / Bairro</label>
                        <input 
                          type="text" 
                          value={formEndereco.endereco || ''} 
                          onChange={e => setFormEndereco({...formEndereco, endereco: e.target.value})} 
                          className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] focus:border-pink-500 transition text-xl"
                        />
                      </div>

                      {/* CIDADE */}
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">Cidade</label>
                        <input 
                          type="text" 
                          value={formEndereco.cidade || ''} 
                          onChange={e => setFormEndereco({...formEndereco, cidade: e.target.value})} 
                          className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] focus:border-pink-500 transition text-xl"
                        />
                      </div>

                      {/* ESTADO */}
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">Estado</label>
                        <input 
                          type="text" 
                          maxLength={2}
                          value={formEndereco.estado || ''} 
                          onChange={e => setFormEndereco({...formEndereco, estado: e.target.value.toUpperCase()})} 
                          className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] focus:border-pink-500 transition text-xl"
                        />
                      </div>

                      {/* COMPLEMENTO */}
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-bold mb-2">Complemento (opcional)</label>
                        <input 
                          type="text" 
                          value={formEndereco.complemento || ''} 
                          onChange={e => setFormEndereco({...formEndereco, complemento: e.target.value})} 
                          className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] focus:border-pink-500 transition text-xl"
                        />
                      </div>
                    </div>

                    <div className="text-center mt-10 space-x-4">
                      <button 
                        onClick={salvarEndereco}
                        className="bg-gradient-to-r from-[#0F1B3F] to-[#1a2d5e] text-white px-12 py-5 rounded-full text-xl font-bold hover:scale-105 transition shadow-xl"
                      >
                        Salvar Endereço
                      </button>
                      <button 
                        onClick={() => setShowForm(false)}
                        className="bg-gray-300 text-gray-800 px-12 py-5 rounded-full text-xl font-bold hover:bg-gray-400 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* LISTA DE ENDEREÇOS */}
                {enderecos.length === 0 ? (
                  <p className="text-center text-xl text-gray-600">Você ainda não tem endereços salvos</p>
                ) : (
                  <div className="space-y-6">
                    {enderecos.map(end => (
                      <div 
                        key={end.id} 
                        className={`p-6 rounded-2xl border-2 flex justify-between items-start ${
                          end.principal ? 'border-[#0F1B3F] bg-purple-50' : 'border-gray-200'
                        }`}
                      >
                        <div>
                          <h3 className="font-bold text-xl">{end.apelido || 'Endereço'}</h3>
                          {end.principal && <span className="text-sm text-green-600 font-bold">Principal</span>}
                          <p className="mt-2">{end.endereco}</p>
                          <p>{end.cidade}, {end.estado} - {end.cep}</p>
                          {end.complemento && <p>Complemento: {end.complemento}</p>}
                          {end.whatsapp && <p>WhatsApp: {end.whatsapp}</p>}
                        </div>
                        <div className="flex gap-4">
                          <button 
                            onClick={() => {
                              setFormEndereco(end);
                              setIsEditing(true);
                              setShowForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-2xl"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleExcluirEndereco(end.id)}
                            className="text-red-600 hover:text-red-800 text-2xl"
                            title="Excluir"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ALTERAR CADASTRO */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mt-12">
            <button 
              onClick={() => setOpenCadastro(!openCadastro)}
              className="w-full p-8 text-left flex justify-between items-center text-3xl font-bold text-[#0F1B3F] hover:bg-gray-50 transition"
            >
              <span>Alterar Meu Cadastro</span>
              <span className="text-4xl">{openCadastro ? '−' : '+'}</span>
            </button>

            {openCadastro && (
              <div className="p-10 pt-0">
                {/* CAMPOS BLOQUEADOS */}
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Nome (não editável)</label>
                    <input 
                      type="text" 
                      value={cliente.nome} 
                      disabled 
                      className="w-full px-6 py-4 rounded-xl border-4 bg-gray-100 cursor-not-allowed text-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Email (não editável)</label>
                    <input 
                      type="email" 
                      value={cliente.email} 
                      disabled 
                      className="w-full px-6 py-4 rounded-xl border-4 bg-gray-100 cursor-not-allowed text-xl"
                    />
                  </div>
                </div>

                {/* CAMPOS EDITÁVEIS */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">WhatsApp (opcional)</label>
                    <input 
                      type="tel" 
                      placeholder="(31) 99999-9999" 
                      value={novaSenha.whatsapp || ''} 
                      onChange={e => setNovaSenha({...novaSenha, whatsapp: e.target.value})} 
                      className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] focus:border-pink-500 transition text-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Nova Senha (deixe vazio pra não alterar)</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={novaSenha} 
                      onChange={e => setNovaSenha(e.target.value)} 
                      className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] focus:border-pink-500 transition text-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Confirmar Nova Senha</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={confirmSenha} 
                      onChange={e => setConfirmSenha(e.target.value)} 
                      className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] focus:border-pink-500 transition text-xl"
                    />
                  </div>
                </div>

                <div className="text-center mt-10">
                  <button 
                    onClick={salvarCadastro}
                    className="bg-gradient-to-r from-[#0F1B3F] to-[#1a2d5e] text-white px-16 py-6 rounded-full text-2xl font-bold hover:scale-105 transition shadow-2xl"
                  >
                    Salvar Alterações
                  </button>
                </div>

                {successMsg && <p className="text-green-600 text-center mt-6 font-bold text-xl">{successMsg}</p>}
                {errorMsg && <p className="text-red-600 text-center mt-6 font-bold text-xl">{errorMsg}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}