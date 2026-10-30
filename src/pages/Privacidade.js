import React from 'react';
import { Link } from 'react-router-dom';

export default function Privacidade() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <h1 className="text-5xl font-bold text-[#0F1B3F] text-center mb-12">
            Política de Privacidade
          </h1>

          <div className="space-y-8 text-lg leading-relaxed text-gray-700">
            <p className="text-center text-xl">
              Na <strong>Queen Store</strong>, valorizamos profundamente a sua privacidade e tratamos seus dados com o mesmo cuidado e carinho que dedicamos a cada produto feito à mão.
            </p>

            <section>
              <h2 className="text-3xl font-bold text-[#0F1B3F] mb-4">1. Dados que coletamos</h2>
              <p>Para oferecer a melhor experiência possível, coletamos apenas as informações necessárias:</p>
              <ul className="list-disc pl-8 space-y-2 mt-4">
                <li>Nome completo – para personalizar sua experiência e comunicação</li>
                <li>E-mail – para confirmação de pedidos e envio de novidades (somente com seu consentimento)</li>
                <li>Número de WhatsApp – para atualizações rápidas sobre seu pedido e atendimento personalizado</li>
                <li>Histórico de compras e itens do carrinho – para melhorar nosso atendimento</li>
                <li>Dados de navegação (cookies) – para entender como melhorar a loja</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#0F1B3F] mb-4">2. Como utilizamos seus dados</h2>
              <ul className="list-disc pl-8 space-y-2 mt-4">
                <li>Processar e acompanhar seus pedidos</li>
                <li>Enviar confirmações, atualizações de status e informações de entrega</li>
                <li>Oferecer atendimento personalizado via WhatsApp ou e-mail</li>
                <li>Enviar comunicações promocionais (apenas se você autorizar)</li>
                <li>Melhorar continuamente nossos produtos e serviços</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#0F1B3F] mb-4">3. Seus direitos (LGPD)</h2>
              <p>Você tem total controle sobre seus dados. A qualquer momento, pode:</p>
              <ul className="list-disc pl-8 space-y-2 mt-4">
                <li>Solicitar acesso aos dados que possuímos</li>
                <li>Pedir correção ou atualização</li>
                <li>Solicitar exclusão dos dados</li>
                <li>Revogar consentimento para comunicações promocionais</li>
              </ul>
              <p className="mt-4">Basta entrar em contato pelo e-mail <strong>contato@queenstore.store</strong> ou WhatsApp (31) 97255-2077.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#0F1B3F] mb-4">4. Segurança dos dados</h2>
              <p>Utilizamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, perda ou alteração. Seus dados são armazenados em servidores seguros e nunca são vendidos ou compartilhados com terceiros sem seu consentimento expresso.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#0F1B3F] mb-4">5. Alterações nesta política</h2>
              <p>Podemos atualizar esta política periodicamente. Sempre avisaremos sobre mudanças significativas por e-mail ou aviso na loja.</p>
            </section>

            <p className="text-center text-xl mt-12">
              Obrigada por confiar na Queen Store. Estamos aqui para cuidar de você com todo o carinho.<br />
              Qualquer dúvida, estamos sempre à disposição 💜
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