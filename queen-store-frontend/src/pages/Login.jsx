import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', senha: '', senha_confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;
      if (isRegister) {
        if (form.senha !== form.senha_confirm) throw new Error('As senhas não coincidem!');
        res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
          nome: form.nome,
          email: form.email,
          senha: form.senha
        });
      } else {
        res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
          email: form.email,
          senha: form.senha
        });
      }

      login(res.data.token, res.data.cliente);
      navigate('/minha-conta');
    } catch (err) {
      setError(err.response?.data?.erro || err.message || 'Erro ao processar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/google`, {
        token: credentialResponse.credential
      });
      login(res.data.token, res.data.cliente);
      navigate('/minha-conta');
    } catch (err) {
      setError('Erro ao logar/cadastrar com Google.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F1B3F] via-[#1a2d5e] to-[#8B00D7]/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-[#8B00D7]/30 p-10 space-y-8 border border-[#0F1B3F]/20">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#0F1B3F] tracking-tight">
            {isRegister ? 'Crie sua conta' : 'Bem-vinda de volta'}
          </h2>
          <p className="mt-3 text-gray-600">
            {isRegister ? (
              <>
                Já tem conta?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-[#8B00D7] hover:text-[#C71585] transition"
                >
                  Faça login
                </button>
              </>
            ) : (
              <>
                Ainda não tem conta?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-[#8B00D7] hover:text-[#C71585] transition"
                >
                  Crie agora
                </button>
              </>
            )}
          </p>
        </div>

        {/* Botão Google customizado */}
        <div className="mt-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Falha ao logar com Google')}
            useOneTap
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-[#0F1B3F] rounded-full py-4 px-6 text-[#0F1B3F] font-bold hover:bg-[#0F1B3F]/5 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 shadow-md"
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.29-.98 2.38-2.07 3.09v2.65h3.35c1.96-1.81 3.09-4.46 3.09-7.99z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-1.01 7.28-2.73l-3.35-2.65c-.93.63-2.12 1-3.93 1-3.02 0-5.58-2.04-6.49-4.78H.96v2.67C2.76 20.98 6.94 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.51 14.22c-.23-.63-.36-1.3-.36-2.22s.13-1.59.36-2.22V7.07H.96C.35 8.61 0 10.27 0 12s.35 3.39.96 4.93l4.55-2.71z"/>
                  <path fill="#EA4335" d="M12 4.98c1.64 0 3.11.56 4.27 1.66l3.19-3.19C17.46 1.01 14.97 0 12 0 6.94 0 2.76 2.02.96 5.07l4.55 2.71C6.42 6.02 8.98 4.98 12 4.98z"/>
                </svg>
                {isRegister ? 'Criar conta com Google' : 'Continuar com Google'}
              </button>
            )}
          />
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500 font-medium">ou</span>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-pink-50 border border-pink-300 text-pink-800 px-4 py-3 rounded-xl relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {isRegister && (
              <input
                type="text"
                placeholder="Nome completo"
                required={isRegister}
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full px-5 py-4 rounded-full border-2 border-[#0F1B3F]/30 focus:border-[#8B00D7] focus:ring-2 focus:ring-[#8B00D7]/30 bg-white/80 backdrop-blur-sm transition-all outline-none text-gray-800 placeholder-gray-500"
              />
            )}

            <input
              type="email"
              placeholder="Seu email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-5 py-4 rounded-full border-2 border-[#0F1B3F]/30 focus:border-[#8B00D7] focus:ring-2 focus:ring-[#8B00D7]/30 bg-white/80 backdrop-blur-sm transition-all outline-none text-gray-800 placeholder-gray-500"
            />

            <input
              type="password"
              placeholder="Senha"
              required
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
              className="w-full px-5 py-4 rounded-full border-2 border-[#0F1B3F]/30 focus:border-[#8B00D7] focus:ring-2 focus:ring-[#8B00D7]/30 bg-white/80 backdrop-blur-sm transition-all outline-none text-gray-800 placeholder-gray-500"
            />

            {isRegister && (
              <input
                type="password"
                placeholder="Confirmar senha"
                required={isRegister}
                value={form.senha_confirm}
                onChange={(e) => setForm({ ...form, senha_confirm: e.target.value })}
                className="w-full px-5 py-4 rounded-full border-2 border-[#0F1B3F]/30 focus:border-[#8B00D7] focus:ring-2 focus:ring-[#8B00D7]/30 bg-white/80 backdrop-blur-sm transition-all outline-none text-gray-800 placeholder-gray-500"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-8 bg-gradient-to-r from-[#0F1B3F] to-[#1a2d5e] text-white rounded-full font-bold text-lg hover:from-[#1a2d5e] hover:to-[#0F1B3F] hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-60"
          >
            {loading ? 'Processando...' : isRegister ? 'Criar Conta' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}