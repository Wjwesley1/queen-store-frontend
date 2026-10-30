import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SpeedInsights } from "@vercel/speed-insights/react";

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Favoritos from './pages/Favoritos';
import Carrinho from './pages/Carrinho';
import ProdutoDetalhe from './pages/ProdutoDetalhe';
import Login from './pages/Login';
import MinhaConta from './pages/MinhaConta';
import VerifyAccount from './pages/VerifyAccount';
import Privacidade from './pages/Privacidade';
import Termos from './pages/Termos';

import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CadastrarProduto from './pages/Admin/CadastrarProduto';
import ControleEstoque from './pages/Admin/ControleEstoque';
import Pedidos from './pages/Admin/Pedidos';

import { CarrinhoProvider } from './context/CarrinhoContext';
import { FavoritosProvider } from './context/FavoritosContext';
import useInactivityLogout from './hooks/useInactivityLogout';

function ScrollToHashElement() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [location]);

  return null;
}

function AppContent() {
  useInactivityLogout();

  return (
    <FavoritosProvider>
      <CarrinhoProvider>
        <div className="min-h-screen bg-white font-sans flex flex-col justify-between">
          <div>
            <Header />
            <ScrollToHashElement />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/favoritos" element={<Favoritos />} />
              <Route path="/carrinho" element={<Carrinho />} />
              <Route path="/produto/:id" element={<ProdutoDetalhe />} />
              <Route path="/login" element={<Login />} />
              <Route path="/minha-conta" element={<MinhaConta />} />
              <Route path="/verify/:token" element={<VerifyAccount />} />
              <Route path="/privacidade" element={<Privacidade />} />
              <Route path="/termos" element={<Termos />} />

              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/cadastrar-produto" element={<CadastrarProduto />} />
              <Route path="/admin/controle-estoque" element={<ControleEstoque />} />
              <Route path="/admin/pedidos" element={<Pedidos />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </CarrinhoProvider>
    </FavoritosProvider>
  );
}

export default function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <AppContent />
        <SpeedInsights id={process.env.REACT_APP_SPEED_INSIGHTS_ID} />
      </Router>
    </GoogleOAuthProvider>
  );
}
