import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

export default function MinhaConta() {
  const { cliente, loading } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [desejos, setDesejos] = useState([]); // quando implementar desejos
  const [endereco, setEndereco] = useState({
    whatsapp: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    complemento: ''
  });
  const [openEndereco, setOpenEndereco] = useState(false);
  const [openCadastro, setOpenCadastro] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    if (cliente) {
      axios.get(`${API_URL}/api/cliente/pedidos`)
        .then(res => setPedidos(res.data))
        .catch(err => console.error('Erro ao carregar pedidos:', err));

      axios.get(`${API_URL}/api/cliente/endereco`)
        .then(res => setEndereco(res.data || {}))
        .catch(err => console.error('Erro ao carregar endereço:', err));
    }
  }, [cliente, API_URL]);

  const salvarEndereco = async () => {
    setSuccessMsg('');
    setErrorMsg('');

    // Valida CEP
    if (endereco.cep && !/^\d{5}-\d{3}$/.test(endereco.cep)) {
      setErrorMsg('CEP inválido! Use o formato 00000-000');
      return;
    }

    try {
      await axios.patch(`${API_URL}/api/cliente/endereco`, endereco);
      setSuccessMsg('Endereço salvo com sucesso! 💜');
    } catch (err) {
      setErrorMsg(err.response?.data?.erro || 'Erro ao salvar endereço 😔');
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

        {/* PEDIDOS - SEMPRE VISÍVEL */}
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

        {/* DESEJOS - SEMPRE VISÍVEL */}
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
          {/* MEU ENDEREÇO DE ENTREGA */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <button 
              onClick={() => setOpenEndereco(!openEndereco)}
              className="w-full p-8 text-left flex justify-between items-center text-3xl font-bold text-[#0F1B3F] hover:bg-gray-50 transition"
            >
              <span>Meu Endereço de Entrega</span>
              <span className="text-4xl">{openEndereco ? '−' : '+'}</span>
            </button>

            {openEndereco && (
              <div className="p-10 pt-0">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* WHATSAPP */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">WhatsApp</label>
                    <input 
                      type="tel" 
                      placeholder="(31) 99999-9999" 
                      value={endereco.whatsapp || ''} 
                      onChange={e => setEndereco({...endereco, whatsapp: e.target.value})} 
                      className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] focus:border-pink-500 transition text-xl"
                    />
                  </div>

                  {/* CEP COM VALIDAÇÃO E AUTO-PREENCIMENTO */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">CEP</label>
                    <input 
                      type="text"
                      placeholder="00000-000"
                      value={endereco.cep || ''}
                      onChange={async (e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5);
                        setEndereco(prev => ({ ...prev, cep: value }));

                        if (value.replace('-', '').length === 8) {
                          try {
                            const cepLimpo = value.replace('-', '');
                            const res = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                            if (!res.data.erro) {
                              setEndereco(prev => ({
                                ...prev,
                                endereco: res.data.logradouro || prev.endereco,
                                cidade: res.data.localidade || prev.cidade,
                                estado: res.data.uf || prev.estado,
                              }));
                              setSuccessMsg('Endereço encontrado! Preenchido automaticamente 💜');
                            } else {
                              setErrorMsg('CEP não encontrado');
                            }
                          } catch (err) {
                            console.error('Erro ViaCEP:', err);
                          }
                        }
                      }}
                      maxLength={9}
                      className={`w-full px-6 py-4 rounded-xl border-4 transition text-xl ${
                        endereco.cep && endereco.cep.replace('-', '').length === 8 
                          ? 'border-green-500' 
                          : endereco.cep && endereco.cep.length > 0 
                          ? 'border-red-500' 
                          : 'border-[#0F1B3F]'
                      } focus:border-pink-500`}
                      required
                    />
                    {errorMsg && <p className="text-red-600 text-sm mt-1">{errorMsg}</p>}
                    {successMsg && <p className="text-green-600 text-sm mt-1">{successMsg}</p>}
                  </div>

                  {/* RUA / NÚMERO / BAIRRO */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Rua / Número / Bairro</label>
                    <input 
                      type="text" 
                      placeholder="Rua Exemplo, 123 - Bairro" 
                      value={endereco.endereco || ''} 
                      onChange={e => setEndereco({...endereco, endereco: e.target.value})} 
                      className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] focus:border-pink-500 transition text-xl"
                    />
                  </div>

                  {/* CIDADE */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Cidade</label>
                    <input 
                      type="text" 
                      placeholder="Cidade" 
                      value={endereco.cidade || ''} 
                      onChange={e => setEndereco({...endereco, cidade: e.target.value})} 
                      className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] focus:border-pink-500 transition text-xl"
                    />
                  </div>

                  {/* ESTADO */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Estado</label>
                    <input 
                      type="text" 
                      placeholder="MG" 
                      maxLength={2}
                      value={endereco.estado || ''} 
                      onChange={e => setEndereco({...endereco, estado: e.target.value.toUpperCase()})} 
                      className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] focus:border-pink-500 transition text-xl"
                    />
                  </div>

                  {/* COMPLEMENTO */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2">Complemento (opcional)</label>
                    <input 
                      type="text" 
                      placeholder="Apt, bloco, referência" 
                      value={endereco.complemento || ''} 
                      onChange={e => setEndereco({...endereco, complemento: e.target.value})} 
                      className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] focus:border-pink-500 transition text-xl"
                    />
                  </div>
                </div>

                <div className="text-center mt-10">
                  <button 
                    onClick={salvarEndereco}
                    disabled={endereco.cep && !/^\d{5}-\d{3}$/.test(endereco.cep)}
                    className={`px-16 py-6 rounded-full text-2xl font-bold transition shadow-2xl ${
                      endereco.cep && !/^\d{5}-\d{3}$/.test(endereco.cep)
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#0F1B3F] to-[#1a2d5e] text-white hover:scale-105'
                    }`}
                  >
                    Salvar Endereço
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ALTERAR CADASTRO - OCULTO */}
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
                <p className="text-center text-xl text-gray-600">Em breve: alteração de senha e outros dados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}