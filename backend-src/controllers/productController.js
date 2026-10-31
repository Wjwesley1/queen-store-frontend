const pool = require("../config/db");
const { uploadToCloudinary } = require("../config/cloudinary");

// LISTAR TODOS OS PRODUTOS
const getProdutos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM produtos ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
    res.status(500).json({ erro: "Erro no servidor", detalhe: err.message });
  }
};

// BUSCAR UM PRODUTO
const getProdutoById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM produtos WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ erro: "Produto não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: "Erro no servidor", detalhe: err.message });
  }
};

// CADASTRAR PRODUTO
const cadastrarProduto = async (req, res) => {
  try {
    const {
      nome,
      preco,
      estoque,
      categoria,
      descricao,
      ingredientes,
      frase_promocional,
      badge,
      video_url,
    } = req.body;

    if (!nome || !preco || !categoria) {
      return res
        .status(400)
        .json({ erro: "Nome, preço e categoria são obrigatórios" });
    }

    const imagensLinks = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const link = await uploadToCloudinary(file.path, file.originalname);
        imagensLinks.push(link);
      }
    }

    const result = await pool.query(
      `
      INSERT INTO produtos (
        nome, preco, estoque, categoria, descricao, ingredientes,
        frase_promocional, imagens, badge, video_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `,
      [
        nome.trim(),
        parseFloat(preco),
        parseInt(estoque) || 0,
        categoria,
        descricao?.trim() || null,
        ingredientes?.trim() || null,
        frase_promocional?.trim() || null,
        JSON.stringify(imagensLinks),
        badge?.trim() || null,
        video_url?.trim() || null,
      ],
    );

    res.status(201).json({
      sucesso: true,
      mensagem: `Produto "${nome}" cadastrado com sucesso!`,
      id: result.rows[0].id,
      imagens: imagensLinks,
    });
  } catch (err) {
    console.error("Erro ao cadastrar produto:", err);
    res
      .status(500)
      .json({ erro: "Erro ao cadastrar produto", detalhe: err.message });
  }
};

// EDITAR PRODUTO
const editarProduto = async (req, res) => {
  const { id } = req.params;
  const campos = req.body;

  const camposPermitidos = [
    "nome",
    "preco",
    "estoque",
    "categoria",
    "descricao",
    "badge",
    "ingredientes",
    "frase_promocional",
  ];
  const updates = [];
  const values = [];
  let index = 1;

  Object.keys(campos).forEach((key) => {
    if (camposPermitidos.includes(key)) {
      updates.push(`${key} = $${index}`);
      values.push(campos[key]);
      index++;
    }
  });

  if (updates.length === 0)
    return res.status(400).json({ erro: "Nenhum campo para atualizar" });

  values.push(id);
  const query = `UPDATE produtos SET ${updates.join(", ")} WHERE id = $${index}`;

  try {
    await pool.query(query, values);
    res.json({ sucesso: true });
  } catch (err) {
    console.error("Erro ao editar produto:", err);
    res.status(500).json({ erro: "Erro no servidor" });
  }
};

// ATUALIZAR ESTOQUE
const atualizarEstoque = async (req, res) => {
  const { id } = req.params;
  const { estoque } = req.body;

  if (estoque === undefined || estoque < 0) {
    return res.status(400).json({ erro: "Estoque inválido" });
  }

  try {
    await pool.query("UPDATE produtos SET estoque = $1 WHERE id = $2", [
      estoque,
      id,
    ]);
    res.json({ sucesso: true });
  } catch (err) {
    console.error("Erro ao atualizar estoque:", err);
    res.status(500).json({ erro: "Erro no servidor" });
  }
};

// DELETAR PRODUTO
const deletarProduto = async (req, res) => {
  try {
    await pool.query("DELETE FROM produtos WHERE id = $1", [req.params.id]);
    res.json({ sucesso: true });
  } catch (err) {
    console.error("Erro ao deletar produto:", err);
    res.status(500).json({ erro: "Erro no servidor" });
  }
};

// LISTAR CATEGORIAS
const getCategorias = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT categoria FROM produtos
      WHERE categoria IS NOT NULL AND categoria != ''
      ORDER BY categoria
    `);
    res.json(result.rows.map((row) => row.categoria));
  } catch (err) {
    console.error("Erro ao carregar categorias:", err);
    res.status(500).json({ erro: "Erro no servidor", detalhe: err.message });
  }
};

module.exports = {
  getProdutos,
  getProdutoById,
  cadastrarProduto,
  editarProduto,
  atualizarEstoque,
  deletarProduto,
  getCategorias,
};
