import React from 'react';
import { Link } from 'react-router-dom';

export default function Termos() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <h1 className="text-5xl font-bold text-[#0F1B3F] text-center mb-12">
            Termos de Uso
          </h1>

          <div className="space-y-8 text-lg leading-relaxed text-gray-700">
            <p className="text-center text-xl">
              Bem-vinda à <strong>Queen Store</strong>. Ao utilizar nosso site, você concorda com os termos abaixo, elaborados com transparência e carinho para proteger a todos.
            </p>

            <section>
              <h2 className="text-3xl font-bold text-[#0F1B3F] mb-4">1. Aceitação dos termos</h2>
              <p>Ao acessar ou realizar compras em queenstore.store, você aceita estes Termos de Uso e nossa Política de Privacidade.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#0F1B3F] mb-4">2. Produtos e compras</h2>
              <ul className="list-disc pl-8 space-y-2 mt-4">
                <li>Todos os produtos são artesanais, feitos com ingredientes de alta qualidade</li>
                <li>As imagens são ilustrativas; podem haver pequenas variações de cor e forma</li>
                <li>Os preços podem ser alterados sem aviso prévio, mas o valor do seu pedido é fixado no momento da compra</li>
                <li>O estoque é atualizado em tempo real,exceto geleias de banho que são feitas a pedido e por isso não temos estoque em tempo real</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#0F1B3F] mb-4">3. Pagamento</h2>
              <p>Aceitamos pagamento via Pix. O pedido só será processado após a confirmação do pagamento.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#0F1B3F] mb-4">4. Envio e entrega</h2>
              <ul className="list-disc pl-8 space-y-2 mt-4">
                <li>Prazo de produção: até 10 dias úteis após confirmação do pagamento</li>
                <li>Envio para todo o Brasil via Correios</li>
                <li>Frete grátis em compras acima de R$ 150,00</li>
                <li>O prazo de entrega varia conforme a região e modalidade escolhida</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#0F1B3F] mb-4">5. Trocas e devoluções</h2>
              <p>Você tem 7 dias corridos após o recebimento para solicitar troca ou devolução, conforme o Código de Defesa do Consumidor. O produto deve estar intacto e na embalagem original. Entraremos em contato para orientar o processo.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#0F1B3F] mb-4">6. Responsabilidades</h2>
              <p>A Queen Store não se responsabiliza por uso inadequado dos produtos. Recomendamos seguir as instruções de uso presentes em cada item.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#0F1B3F] mb-4">7. Alterações nos termos</h2>
              <p>Podemos atualizar estes termos periodicamente. Avisaremos sobre mudanças relevantes por e-mail ou aviso no site.</p>
            </section>

            <p className="text-center text-xl mt-12">
              Obrigada por escolher a Queen Store. Estamos aqui para tornar sua experiência a mais especial possível.<br />
              Qualquer dúvida, estamos sempre disponíveis com carinho.
            </p>

            <p className="text-center mt-8 text-gray-600">
              Última atualização: 20 de dezembro de 2025
            </p>
          </div>

          <div className="text-center mt-12">
            <Link to="/" className="bg-[#0F1B3F] text-white px-12 py-6 rounded-full text-2xl font-bold hover:bg-pink-600 transition shadow-2xl">
              Voltar à Loja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}