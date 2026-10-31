// src/pages/Carrinho.jsx — VERSÃO FINAL COM INTEGRAÇÃO DE DADOS LOGADO + CONFIRMAÇÃO RÁPIDA
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCarrinho } from "../context/CarrinhoContext";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// VALIDADOR DE EMAIL
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default function Carrinho() {
  const { carrinho, carregarCarrinho } = useCarrinho();
  const { cliente } = useAuth();

  const [modalAberto, setModalAberto] = useState(false);
  const [dadosCliente, setDadosCliente] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    endereco: "",
    cep: "",
    cidade: "",
    estado: "",
    complemento: "",
  });

  const [isLoadingDados, setIsLoadingDados] = useState(false);

  // Se logado, carrega dados automaticamente
  useEffect(() => {
    if (cliente && modalAberto) {
      setIsLoadingDados(true);
      api
        .get("/api/cliente/dados")
        .then((res) => {
          setDadosCliente(res.data || {});
          setIsLoadingDados(false);
        })
        .catch((err) => {
          console.error("Erro ao carregar dados do cliente:", err);
          setIsLoadingDados(false);
        });
    }
  }, [cliente, modalAberto]);

  const updateQuantidade = async (produto_id, novaQuantidade) => {
    try {
      if (novaQuantidade < 1) {
        await api.delete(`/api/carrinho/${produto_id}`);
      } else {
        await api.put(`/api/carrinho/${produto_id}`, {
          quantidade: novaQuantidade,
        });
      }
      carregarCarrinho();
    } catch (err) {
      console.error("Erro ao atualizar quantidade:", err);
    }
  };

  const total = carrinho
    .reduce(
      (sum, item) => sum + (parseFloat(item.preco) || 0) * item.quantidade,
      0,
    )
    .toFixed(2);

  const mensagem = carrinho
    .map(
      (p) =>
        `${p.nome} × ${p.quantidade} - R$ ${(parseFloat(p.preco) * p.quantidade).toFixed(2)}`,
    )
    .join("\n");

  const salvarPedidoEFinalizar = async () => {
    if (!dadosCliente.nome || !dadosCliente.whatsapp) {
      alert("Preencha nome e WhatsApp, rainha!");
      return;
    }

    if (dadosCliente.email && !isValidEmail(dadosCliente.email)) {
      alert("Digite um e-mail válido!");
      return;
    }

    try {
      // 1. SALVA O PEDIDO NO BANCO
      await api.post("/api/pedidos", {
        cliente_nome: dadosCliente.nome,
        cliente_whatsapp: dadosCliente.whatsapp.replace(/\D/g, ""),
        cliente_email: dadosCliente.email || "Não informado",
        endereco: dadosCliente.endereco || "Não informado",
        cep: dadosCliente.cep || "Não informado",
        cidade: dadosCliente.cidade || "Não informado",
        estado: dadosCliente.estado || "Não informado",
        complemento: dadosCliente.complemento || "",
        itens: carrinho.map((i) => ({
          nome: i.nome,
          quantidade: i.quantidade,
          preco: parseFloat(i.preco),
        })),
        valor_total: parseFloat(total),
      });

      // 2. ZERA O CARRINHO NO BACKEND
      await Promise.all(
        carrinho.map((item) => api.delete(`/api/carrinho/${item.produto_id}`)),
      );

      // 3. GERA NOVA SESSÃO PRA EVITAR CONFLITO
      const novaSessao =
        "web_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("queen_session", novaSessao);

      // 4. RECARREGA O CARRINHO
      carregarCarrinho();

      // 5. ALERTA DE SUCESSO
      const alertDiv = document.createElement("div");
      alertDiv.className =
        "fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-8 py-4 rounded-full shadow-2xl z-50 text-xl font-bold animate-pulse";
      alertDiv.textContent = "PEDIDO ENVIADO COM SUCESSO!";
      document.body.appendChild(alertDiv);
      setTimeout(() => alertDiv.remove(), 5000);

      // 6. ABRE WHATSAPP PERSONALIZADO
      const mensagemFinal = encodeURIComponent(
        `Olá, Rainha! Aqui é ${dadosCliente.nome}\n\nMeu pedido:\n\n${mensagem}\n\nTotal: R$ ${total}\n\nObrigada!`,
      );
      window.open(
        `https://wa.me/5531972552077?text=${mensagemFinal}`,
        "_blank",
      );

      setModalAberto(false);
    } catch (err) {
      console.error("Erro ao finalizar:", err);
      alert("Erro ao salvar, mas o WhatsApp vai abrir para finalizar");
      window.open(
        `https://wa.me/5531972552077?text=${encodeURIComponent(mensagem)}`,
        "_blank",
      );
    }
  };

  if (carrinho.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 text-center flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl sm:text-5xl font-bold text-[#0F1B3F] mb-6">
          Seu carrinho está vazio
        </h1>
        <p className="text-gray-500 mb-8 max-w-md">
          Que tal dar uma olhadinha nas nossas geleias de banho e sabonetes
          artesanais?
        </p>
        <Link
          to="/#produtos"
          className="bg-[#0F1B3F] text-white px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-pink-600 transition shadow-xl"
        >
          Continuar Comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#0F1B3F] mb-8 sm:mb-12">
          Seu Carrinho
        </h1>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {carrinho.map((item) => (
            <div
              key={item.produto_id}
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-5 sm:p-6 border-b last:border-0 hover:bg-pink-50/40 transition"
            >
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 bg-cover bg-center rounded-2xl shadow-sm flex-shrink-0 bg-gray-100"
                style={{
                  backgroundImage: `url(${item.imagem || "https://i.ibb.co/0jG4vK8/geleia-maracuja.jpg"})`,
                }}
              />

              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                  {item.nome}
                </h3>
                <p className="text-[#0F1B3F] font-bold text-base">
                  R$ {parseFloat(item.preco).toFixed(2)} cada
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateQuantidade(item.produto_id, item.quantidade - 1)
                  }
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-lg font-bold text-gray-700 transition flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-10 text-center text-lg font-bold text-[#0F1B3F]">
                  {item.quantidade}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateQuantidade(item.produto_id, item.quantidade + 1)
                  }
                  className="w-9 h-9 rounded-full bg-[#0F1B3F] text-white hover:bg-pink-600 text-lg font-bold transition flex items-center justify-center shadow"
                >
                  +
                </button>
              </div>

              <div className="text-center sm:text-right min-w-[100px]">
                <p className="text-lg sm:text-xl font-bold text-[#0F1B3F]">
                  R$ {(parseFloat(item.preco) * item.quantidade).toFixed(2)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => updateQuantidade(item.produto_id, 0)}
                className="text-red-500 hover:text-red-700 font-semibold text-sm transition"
              >
                Remover
              </button>
            </div>
          ))}

          <div className="bg-gradient-to-r from-[#0F1B3F] to-[#1a2d5e] text-white p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
              <p className="text-xl sm:text-2xl font-bold">Total do Pedido</p>
              <p className="text-3xl sm:text-4xl font-extrabold text-pink-300">
                R$ {total}
              </p>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setModalAberto(true)}
                className="w-full sm:w-auto bg-white text-[#0F1B3F] hover:bg-pink-100 px-10 py-4 rounded-full text-lg sm:text-xl font-bold transition transform hover:scale-105 shadow-xl"
              >
                FINALIZAR PEDIDO
              </button>
            </div>

            <p className="text-center text-white/70 mt-4 text-xs sm:text-sm">
              Entrega rápida e embalagem cuidadosa para você ou para presentear
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/#produtos"
            className="text-[#0F1B3F] hover:text-pink-600 font-bold text-sm sm:text-base transition"
          >
            ← Continuar Comprando
          </Link>
        </div>
      </div>

      {/* MODAL DE DADOS DO CLIENTE */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F1B3F] text-center mb-2">
              {cliente ? "Confirme seus dados, rainha!" : "Quase lá, rainha!"}
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              {cliente
                ? "Seus dados já estão salvos. Confirme ou altere antes de finalizar."
                : "Preencha seus dados para montarmos o seu pedido no WhatsApp"}
            </p>

            {isLoadingDados ? (
              <p className="text-center py-6 text-gray-500">
                Carregando dados salvos...
              </p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={dadosCliente.nome}
                    onChange={(e) =>
                      setDadosCliente({ ...dadosCliente, nome: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F1B3F]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="DDD + Número (ex: 31988887777)"
                    value={dadosCliente.whatsapp}
                    onChange={(e) =>
                      setDadosCliente({
                        ...dadosCliente,
                        whatsapp: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F1B3F]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    E-mail (opcional)
                  </label>
                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={dadosCliente.email}
                    onChange={(e) =>
                      setDadosCliente({
                        ...dadosCliente,
                        email: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none ${
                      dadosCliente.email && !isValidEmail(dadosCliente.email)
                        ? "border-red-500"
                        : "border-gray-200 focus:border-[#0F1B3F]"
                    }`}
                  />
                  {dadosCliente.email && !isValidEmail(dadosCliente.email) && (
                    <p className="text-red-500 text-xs mt-1">E-mail inválido</p>
                  )}
                </div>

                {cliente && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                        Endereço
                      </label>
                      <input
                        type="text"
                        placeholder="Rua, número, bairro"
                        value={dadosCliente.endereco || ""}
                        onChange={(e) =>
                          setDadosCliente({
                            ...dadosCliente,
                            endereco: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F1B3F]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                          Cidade
                        </label>
                        <input
                          type="text"
                          placeholder="Cidade"
                          value={dadosCliente.cidade || ""}
                          onChange={(e) =>
                            setDadosCliente({
                              ...dadosCliente,
                              cidade: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F1B3F]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                          Estado
                        </label>
                        <input
                          type="text"
                          placeholder="UF"
                          value={dadosCliente.estado || ""}
                          onChange={(e) =>
                            setDadosCliente({
                              ...dadosCliente,
                              estado: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F1B3F]"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={salvarPedidoEFinalizar}
                disabled={
                  !dadosCliente.nome ||
                  !dadosCliente.whatsapp ||
                  (dadosCliente.email && !isValidEmail(dadosCliente.email)) ||
                  isLoadingDados
                }
                className={`flex-1 py-3.5 rounded-full text-sm font-bold transition-all ${
                  !dadosCliente.nome ||
                  !dadosCliente.whatsapp ||
                  (dadosCliente.email && !isValidEmail(dadosCliente.email)) ||
                  isLoadingDados
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#0F1B3F] text-white hover:bg-pink-600 shadow-md"
                }`}
              >
                {isLoadingDados ? "Carregando..." : "Confirmar Pedido"}
              </button>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="px-6 py-3.5 rounded-full text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
