const pool = require("../config/db");
const {
  enviarEmail,
  emailConfirmacaoPedido,
  emailStatusPedido,
} = require("../services/emailService");

// CRIAR PEDIDO
const criarPedido = async (req, res) => {
  const {
    cliente_nome = "Cliente",
    cliente_whatsapp = "Não informado",
    cliente_email = "Não informado",
    itens = [],
    valor_total = 0,
  } = req.body;

  if (itens.length === 0 || !valor_total)
    return res.status(400).json({ erro: "Carrinho vazio" });

  try {
    const result = await pool.query(
      `
      INSERT INTO pedidos (cliente_nome, cliente_whatsapp, cliente_email, itens, valor_total, status, criado_em)
      VALUES ($1, $2, $3, $4, $5, 'pendente', NOW())
      RETURNING id
    `,
      [
        cliente_nome,
        cliente_whatsapp,
        cliente_email,
        JSON.stringify(itens),
        valor_total,
      ],
    );

    const pedidoId = result.rows[0].id;

    if (cliente_email !== "Não informado" && cliente_email.includes("@")) {
      await enviarEmail(
        cliente_email,
        cliente_nome,
        `Confirmação de Pedido #${pedidoId} - Queen Store 💜`,
        emailConfirmacaoPedido(cliente_nome, pedidoId, itens, valor_total),
      );
    }

    res.json({ sucesso: true, pedido_id: pedidoId });
  } catch (err) {
    console.error("Erro salvando pedido:", err);
    res.status(500).json({ erro: "Erro no banco", detalhe: err.message });
  }
};

// LISTAR TODOS OS PEDIDOS (ADMIN)
const getPedidosAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM pedidos ORDER BY criado_em DESC",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro no servidor" });
  }
};

// ATUALIZAR STATUS DO PEDIDO
const atualizarPedido = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const statusValidos = [
    "pendente",
    "pago",
    "enviado",
    "entregue",
    "concluido",
  ];
  if (!statusValidos.includes(status))
    return res.status(400).json({ erro: "Status inválido" });

  try {
    await pool.query("UPDATE pedidos SET status = $1 WHERE id = $2", [
      status,
      id,
    ]);

    const result = await pool.query("SELECT * FROM pedidos WHERE id = $1", [
      id,
    ]);
    const pedido = result.rows[0];

    if (
      ["pago", "enviado", "entregue", "concluido"].includes(status) &&
      pedido.cliente_email?.includes("@")
    ) {
      await enviarEmail(
        pedido.cliente_email,
        pedido.cliente_nome,
        `Atualização do Pedido #${id} - Queen Store`,
        emailStatusPedido(pedido.cliente_nome, id, status),
      );
    }

    res.json({ sucesso: true });
  } catch (err) {
    console.error("Erro ao atualizar pedido:", err);
    res.status(500).json({ erro: "Erro no servidor" });
  }
};

module.exports = {
  criarPedido,
  getPedidosAdmin,
  atualizarPedido,
};
