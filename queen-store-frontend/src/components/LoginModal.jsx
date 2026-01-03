import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';


export default function LoginModal({ open, onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}${endpoint}`, form);
      if (res.data.sucesso) {
        login(res.data.token);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data.erro || 'Erro no servidor');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/google`, {
        token: credentialResponse.credential
      });
      if (res.data.sucesso) {
        login(res.data.token);
        onClose();
      }
    } catch (err) {
      setError('Erro no login com Google');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <h2 className="text-4xl font-bold text-[#0F1B3F] text-center mb-8">
          {isRegister ? 'Criar Conta' : 'Entrar na Minha Conta'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <input
              type="text"
              placeholder="Seu nome"
              value={form.nome}
              onChange={e => setForm({...form, nome: e.target.value})}
              className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] text-xl"
              required
            />
          )}
          <input
            type="email"
            placeholder="Seu email"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] text-xl"
            required
          />
          <input
            type="password"
            placeholder="Sua senha"
            value={form.senha}
            onChange={e => setForm({...form, senha: e.target.value})}
            className="w-full px-6 py-4 rounded-xl border-4 border-[#0F1B3F] text-xl"
            required
          />

          {error && <p className="text-red-600 text-center">{error}</p>}

          <button type="submit" className="w-full bg-gradient-to-r from-[#0F1B3F] to-[#1a2d5e] text-white py-5 rounded-full text-2xl font-bold hover:scale-105 transition shadow-xl">
            {isRegister ? 'Criar Conta' : 'Entrar'}
          </button>
        </form>

        <div className="my-8 text-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Erro no Google')}
            useOneTap
            theme="filled_blue"
            size="large"
            text={isRegister ? 'signup_with' : 'signin_with'}
            shape="rectangular"
          />
        </div>

        <p className="text-center text-gray-600">
          {isRegister ? 'Já tem conta?' : 'Ainda não tem conta?'}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-[#0F1B3F] font-bold ml-2 hover:underline"
          >
            {isRegister ? 'Entrar' : 'Criar conta'}
          </button>
        </p>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl"
        >
          ×
        </button>

        <div className="my-8 text-center">
  <p className="text-gray-600 mb-2">Não recebeu o email de confirmação?</p>
  <button 
    onClick={async () => {
      if (!form.email) {
        setError('Digite seu email primeiro!');
        return;
      }
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/resend-verification`, { email: form.email });
        setError('Email de confirmação reenviado! Confira caixa de entrada ou spam 💜');
      } catch (err) {
        setError(err.response?.data?.erro || 'Erro ao reenviar');
      }
    }}
    className="text-[#0F1B3F] underline font-bold hover:text-pink-600 transition"
  >
    Reenviar Email de Confirmação
  </button>
</div>
      </div>
    </div>
  );
}