const pool = require("../config/db");

// LISTAR CARRINHO DA SESSÃO
const getCarrinho = async (req, res) => {
  const sessionId = req.headers["x-session-id"] || req.headers["session"];
  if (!sessionId) return res.json([]);

  try {
    const result = await pool.query(
      `
      SELECT c.id, c.produto_id, c.quantidade,
             p.nome, p.preco, p.imagens, p.estoque AS estoque_atual
      FROM carrinho c
      JOIN produtos p ON c.produto_id = p.id
      WHERE c.sessao = $1
      ORDER BY c.id
    `,
      [sessionId],
    );

    const itens = result.rows.map((item) => ({
      ...item,
      imagem: item.imagens?.[0] || null,
    }));

    res.json(itens);
  } catch (err) {
    console.error("Erro ao carregar carrinho:", err);
    res.status(500).json({ erro: "Erro ao carregar carrinho" });
  }
};

// ADICIONAR ITEM AO CARRINHO
const adicionarAoCarrinho = async (req, res) => {
  const { produto_id, quantidade = 1 } = req.body;
  const sessionId = req.headers["x-session-id"] || req.headers["session"];

  if (!sessionId)
    return res.status(400).json({ erro: "Sessão não encontrada" });
  if (!produto_id) return res.status(400).json({ erro: "Produto inválido" });

  const produtoId = parseInt(produto_id);
  const qtd = parseInt(quantidade);
  if (qtd < 1) return res.status(400).json({ erro: "Quantidade inválida" });

  try {
    const check = await pool.query(
      "SELECT estoque, nome FROM produtos WHERE id = $1 FOR UPDATE",
      [produtoId],
    );
    if (check.rows.length === 0)
      return res.status(404).json({ erro: "Produto não encontrado" });

    const produto = check.rows[0];
    if (produto.estoque < qtd)
      return res
        .status(400)
        .json({ erro: "Estoque insuficiente", disponivel: produto.estoque });

    await pool.query(
      `
      INSERT INTO carrinho (sessao, produto_id, quantidade)
      VALUES ($1, $2, $3)
      ON CONFLICT (sessao, produto_id)
      DO UPDATE SET quantidade = carrinho.quantidade + EXCLUDED.quantidade
    `,
      [sessionId, produtoId, qtd],
    );

    await pool.query(
      "UPDATE produtos SET estoque = estoque - $1 WHERE id = $2",
      [qtd, produtoId],
    );

    res.json({
      sucesso: true,
      mensagem: `${qtd} × ${produto.nome} adicionado(s)!`,
    });
  } catch (err) {
    console.error("Erro no POST carrinho:", err);
    res.status(500).json({ erro: "Erro interno" });
  }
};

// ATUALIZAR QUANTIDADE NO CARRINHO
const atualizarCarrinho = async (req, res) => {
  const produto_id = parseInt(req.params.produto_id);
  const { quantidade } = req.body;
  const sessionId = req.headers["x-session-id"] || req.headers["session"];

  if (!sessionId)
    return res.status(400).json({ erro: "Sessão não encontrada" });
  if (quantidade === undefined || quantidade < 0)
    return res.status(400).json({ erro: "Quantidade inválida" });

  try {
    if (quantidade === 0) {
      const item = await pool.query(
        "SELECT quantidade FROM carrinho WHERE sessao = $1 AND produto_id = $2",
        [sessionId, produto_id],
      );
      if (item.rows.length > 0) {
        await pool.query(
          "UPDATE produtos SET estoque = estoque + $1 WHERE id = $2",
          [item.rows[0].quantidade, produto_id],
        );
      }
      await pool.query(
        "DELETE FROM carrinho WHERE sessao = $1 AND produto_id = $2",
        [sessionId, produto_id],
      );
      return res.json({ sucesso: true });
    }

    const result = await pool.query(
      "UPDATE carrinho SET quantidade = $1 WHERE sessao = $2 AND produto_id = $3 RETURNING *",
      [quantidade, sessionId, produto_id],
    );

    if (result.rowCount === 0)
      return res.status(404).json({ erro: "Item não encontrado" });
    res.json({ sucesso: true });
  } catch (err) {
    console.error("Erro no PUT carrinho:", err);
    res.status(500).json({ erro: "Erro interno" });
  }
};

// REMOVER DO CARRINHO
const removerDoCarrinho = async (req, res) => {
  const produto_id = parseInt(req.params.produto_id);
  const sessionId = req.headers["x-session-id"] || req.headers["session"];

  if (!sessionId)
    return res.status(400).json({ erro: "Sessão não encontrada" });

  try {
    const item = await pool.query(
      "SELECT quantidade FROM carrinho WHERE sessao = $1 AND produto_id = $2",
      [sessionId, produto_id],
    );

    if (item.rows.length === 0)
      return res.status(404).json({ erro: "Item não encontrado" });

    await pool.query(
      "DELETE FROM carrinho WHERE sessao = $1 AND produto_id = $2",
      [sessionId, produto_id],
    );
    await pool.query(
      "UPDATE produtos SET estoque = estoque + $1 WHERE id = $2",
      [item.rows[0].quantidade, produto_id],
    );

    res.json({ sucesso: true });
  } catch (err) {
    console.error("Erro ao remover do carrinho:", err);
    res.status(500).json({ erro: "Erro ao remover item" });
  }
};

module.exports = {
  getCarrinho,
  adicionarAoCarrinho,
  atualizarCarrinho,
  removerDoCarrinho,
};
