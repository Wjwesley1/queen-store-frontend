import React, { useState, useEffect } from "react";
import api from "../services/api";
import ProductCard from "../components/product/ProductCard";
import LoadingQueen from "../components/LoadingQueen";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/produtos")
      .then((res) => {
        setProdutos(
          res.data.map((p) => ({ ...p, estoque: parseInt(p.estoque) || 0 })),
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));

    api
      .get("/api/categorias")
      .then((res) => {
        setCategorias(
          res.data.map((cat) =>
            cat
              .trim()
              .toLowerCase()
              .replace(/\b\w/g, (l) => l.toUpperCase()),
          ),
        );
      })
      .catch(() => setCategorias(["Geleia De Banho", "Sabonete"]));
  }, []);

  const filtered =
    categoria === "all"
      ? produtos
      : produtos.filter(
          (p) => p.categoria?.trim().toLowerCase() === categoria.toLowerCase(),
        );

  if (loading) return <LoadingQueen />;

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[75vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#0F1B3F]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105 pointer-events-none"
        >
          <source src="/videos/fundo-hero.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1B3F] via-[#0F1B3F]/40 to-transparent" />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl mx-auto flex flex-col items-center py-16">
          <span className="text-[11px] sm:text-xs font-bold text-pink-400 tracking-[0.35em] uppercase mb-4 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            Cosméticos Artesanais
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight mb-5 leading-[1.15]">
            Sinta-se uma <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              Verdadeira Rainha
            </span>
          </h1>

          <p className="text-white/80 text-base sm:text-lg mb-8 max-w-md leading-relaxed">
            Sabonetes artesanais e geleias de banho 100% naturais, feitos com
            carinho para o seu momento de autocuidado.
          </p>

          <div className="flex gap-3 sm:gap-4 flex-wrap justify-center">
            <a
              href="#produtos"
              className="bg-white text-[#0F1B3F] px-7 sm:px-8 py-3.5 rounded-full font-bold hover:bg-pink-100 transition shadow-xl text-sm"
            >
              Ver Coleção
            </a>
            <a
              href="#contato"
              className="border border-white/40 text-white px-7 sm:px-8 py-3.5 rounded-full font-bold hover:bg-white/10 transition text-sm backdrop-blur-sm"
            >
              Fale Conosco
            </a>
          </div>
        </div>

        <div className="hidden sm:flex absolute bottom-6 right-8 flex-col items-center gap-1 text-white/40 select-none">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>

      {/* FILTROS DE CATEGORIA */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-3 sm:py-4 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setCategoria("all")}
              className={`shrink-0 px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                categoria === "all"
                  ? "bg-[#0F1B3F] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Todos os Produtos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoria(cat)}
                className={`shrink-0 px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  categoria === cat
                    ? "bg-[#0F1B3F] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRADE DE PRODUTOS */}
      <section id="produtos" className="py-14 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 mb-8 sm:mb-10">
            <div>
              <p className="text-xs sm:text-sm font-bold text-pink-500 uppercase tracking-widest mb-1">
                Coleção Exclusiva
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F1B3F] tracking-tight">
                Nossos Produtos
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">
              {filtered.length} produto{filtered.length !== 1 ? "s" : ""}{" "}
              disponível{filtered.length !== 1 ? "is" : ""}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-base">
                Nenhum produto cadastrado nesta categoria no momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filtered.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section id="avaliacoes" className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-xs sm:text-sm font-bold text-pink-500 uppercase tracking-widest mb-2">
              Depoimentos Reais
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F1B3F] tracking-tight">
              O que as rainhas dizem
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                nome: "Ana Paula",
                nota: 5,
                texto:
                  "A geleia de banho é simplesmente incrível! Minha pele ficou hidratada o dia todo. Amei demais! 💜",
              },
              {
                nome: "Carla S.",
                nota: 5,
                texto:
                  "Produtos maravilhosos e cheirosos. Já comprei pela terceira vez e continuo encantada com a qualidade!",
              },
              {
                nome: "Fernanda M.",
                nota: 5,
                texto:
                  "Entrega rápida e embalagem linda. O sabonete artesanal superou minhas expectativas. Nota 10!",
              },
            ].map((av, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(av.nota)].map((_, j) => (
                      <svg
                        key={j}
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                    "{av.texto}"
                  </p>
                </div>
                <p className="font-bold text-[#0F1B3F] text-sm">— {av.nome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
          <p className="text-xs sm:text-sm font-bold text-pink-500 uppercase tracking-widest mb-2">
            Fale Conosco
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F1B3F] mb-3 tracking-tight">
            Dúvidas? A gente responde!
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mb-8 max-w-md mx-auto">
            Nossa equipe está disponível para tirar todas as dúvidas sobre
            ingredientes, prazos de envio ou encomendas personalizadas.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="https://wa.me/5531972552077"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 text-white px-7 py-3.5 rounded-full font-bold transition shadow-md hover:shadow-lg text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Conversar no WhatsApp
            </a>
            <a
              href="mailto:contato@queenstore.store"
              className="flex items-center justify-center gap-2.5 bg-[#0F1B3F] hover:bg-pink-600 text-white px-7 py-3.5 rounded-full font-bold transition shadow-md hover:shadow-lg text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              contato@queenstore.store
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
