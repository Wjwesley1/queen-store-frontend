import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function VerifyAccount() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verificando');

  useEffect(() => {
    axios.get(`/api/auth/verify/${token}`)
      .then(res => {
        setStatus('sucesso');
        setTimeout(() => navigate('/login'), 3000);
      })
      .catch(err => setStatus('erro'));
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {status === 'verificando' && <p className="text-3xl">Verificando conta...</p>}
        {status === 'sucesso' && <p className="text-3xl text-green-600">Conta verificada! Redirecionando para login...</p>}
        {status === 'erro' && <p className="text-3xl text-red-600">Link inválido ou expirado</p>}
      </div>
    </div>
  );
}