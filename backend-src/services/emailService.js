const brevo = require('@getbrevo/brevo');

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

async function enviarEmail(para, nome, assunto, htmlContent) {
  const sendSmtpEmail = {
    to: [{ email: para, name: nome }],
    sender: { name: 'Queen Store', email: 'contato@queenstore.store' },
    subject: assunto,
    htmlContent
  };
  await apiInstance.sendTransacEmail(sendSmtpEmail);
}

function emailConfirmacaoPedido(nome, pedidoId, itens, valorTotal) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px 20px; background: linear-gradient(#fdf2ff, #f8f0ff); border-radius: 20px; text-align: center;">
      <h1 style="color: #0F1B3F;">Queen Store</h1>
      <p style="color: #8B00D7; font-size: 22px;">Olá, <strong>${nome}</strong>!</p>
      <h2 style="color: #8B00D7;">Seu pedido foi recebido!</h2>
      <p style="font-size: 28px; color: #0F1B3F; font-weight: bold;">Pedido #${pedidoId}</p>
      <p style="font-size: 18px; color: #0F1B3F;">
        ${itens.map(i => `${i.nome} × ${i.quantidade} — R$ ${(i.preco * i.quantidade).toFixed(2)}`).join('<br>')}
      </p>
      <p style="font-size: 24px; color: #0F1B3F; font-weight: bold;">Total: R$ ${valorTotal.toFixed(2)}</p>
      <p style="font-size: 16px; color: #0F1B3F; margin-top: 30px;">Dúvidas? WhatsApp: (31) 97255-2077</p>
      <p style="color: #8B00D7; font-size: 20px;">Com carinho,<br><strong>Queen Store</strong></p>
    </div>
  `;
}

function emailVerificacaoConta(nome, verifyLink) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px 20px; background: linear-gradient(#fdf2ff, #f8f0ff); border-radius: 20px; text-align: center;">
      <h1 style="color: #0F1B3F;">Queen Store</h1>
      <p style="color: #8B00D7; font-size: 22px;">Olá, <strong>${nome}</strong>! Bem-vinda 👑</p>
      <h2 style="color: #8B00D7;">Confirme sua conta</h2>
      <p style="font-size: 18px; color: #0F1B3F;">Clique abaixo para ativar sua conta:</p>
      <a href="${verifyLink}" style="background:#0F1B3F;color:white;padding:15px 30px;border-radius:10px;text-decoration:none;font-weight:bold;display:inline-block;margin:20px 0;">
        Confirmar Conta Agora
      </a>
      <p style="font-size: 14px; color: #666;">Se o botão não funcionar, acesse: ${verifyLink}</p>
      <p style="font-size: 14px; color: #666;">Link expira em 24 horas.</p>
      <p style="color: #8B00D7; font-size: 20px;">Com carinho,<br><strong>Queen Store</strong></p>
    </div>
  `;
}

function emailStatusPedido(nome, pedidoId, status) {
  const mensagens = {
    pago: 'Seu pagamento foi confirmado! 🎉',
    enviado: 'Seu pedido foi enviado! 🚚',
    entregue: 'Seu pedido foi entregue! 💜',
    concluido: 'Pedido concluído! Obrigada pela preferência 👑'
  };
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px 20px; background: linear-gradient(#fdf2ff, #f8f0ff); border-radius: 20px; text-align: center;">
      <h1 style="color: #0F1B3F;">Queen Store</h1>
      <p style="color: #8B00D7; font-size: 22px;">Olá, <strong>${nome}</strong>!</p>
      <h2 style="color: #8B00D7;">${mensagens[status] || 'Status atualizado!'}</h2>
      <p style="font-size: 24px; color: #0F1B3F; font-weight: bold;">Pedido #${pedidoId}</p>
      <p style="font-size: 16px; color: #0F1B3F;">Dúvidas? WhatsApp: (31) 97255-2077</p>
      <p style="color: #8B00D7; font-size: 20px;">Com carinho,<br><strong>Queen Store</strong></p>
    </div>
  `;
}

module.exports = {
  enviarEmail,
  emailConfirmacaoPedido,
  emailVerificacaoConta,
  emailStatusPedido
};
