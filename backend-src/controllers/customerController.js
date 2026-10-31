const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const getPerfil = async (req, res) => {
  res.json({ cliente: req.cliente });
};

const getDados = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT nome, email, whatsapp, enderecos, cidade, estado, cep, complemento FROM clientes WHERE id = $1",
      [req.cliente.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ erro: "Dados não encontrados" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno" });
  }
};

const getEnderecos = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT whatsapp, enderecos, cidade, estado, cep, complemento FROM clientes WHERE id = $1",
      [req.cliente.id],
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ erro: "Erro ao carregar endereços" });
  }
};

const atualizarEnderecos = async (req, res) => {
  const { whatsapp, enderecos, cidade, estado, cep, complemento } = req.body;
  try {
    await pool.query(
      `
      UPDATE clientes SET
        whatsapp = COALESCE($1, whatsapp),
        enderecos = COALESCE($2, enderecos),
        cidade = COALESCE($3, cidade),
        estado = COALESCE($4, estado),
        cep = COALESCE($5, cep),
        complemento = COALESCE($6, complemento)
      WHERE id = $7
    `,
      [
        whatsapp || null,
        enderecos || null,
        cidade || null,
        estado || null,
        cep || null,
        complemento || null,
        req.cliente.id,
      ],
    );
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao salvar endereços" });
  }
};

const atualizarCadastro = async (req, res) => {
  const {
    whatsapp,
    enderecos,
    cidade,
    estado,
    cep,
    complemento,
    senha,
    senha_confirm,
  } = req.body;

  if (senha && senha !== senha_confirm)
    return res.status(400).json({ erro: "Senhas não coincidem" });

  try {
    const fields = [];
    const values = [];
    let i = 1;

    const add = (col, val) => {
      fields.push(`${col} = $${i++}`);
      values.push(val);
    };

    if (whatsapp !== undefined) add("whatsapp", whatsapp);
    if (enderecos !== undefined) add("enderecos", enderecos);
    if (cidade !== undefined) add("cidade", cidade);
    if (estado !== undefined) add("estado", estado);
    if (cep !== undefined) add("cep", cep);
    if (complemento !== undefined) add("complemento", complemento);
    if (senha) add("senha_hash", await bcrypt.hash(senha, 10));

    if (fields.length === 0)
      return res.status(400).json({ erro: "Nada para atualizar" });

    values.push(req.cliente.id);
    await pool.query(
      `UPDATE clientes SET ${fields.join(", ")} WHERE id = $${i}`,
      values,
    );
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar cadastro" });
  }
};

const getPedidosCliente = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM pedidos WHERE cliente_email = $1 ORDER BY criado_em DESC",
      [req.cliente.email],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao carregar pedidos" });
  }
};

const getDesejos = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT p.* FROM desejos d
      JOIN produtos p ON d.produto_id = p.id
      WHERE d.cliente_id = $1
    `,
      [req.cliente.id],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar desejos" });
  }
};

module.exports = {
  getPerfil,
  getDados,
  getEnderecos,
  atualizarEnderecos,
  atualizarCadastro,
  getPedidosCliente,
  getDesejos,
};
