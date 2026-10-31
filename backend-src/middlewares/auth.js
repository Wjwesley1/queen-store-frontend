const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET;

const autenticar = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ erro: "Token não fornecido" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query(
      "SELECT id, nome, email FROM clientes WHERE id = $1",
      [decoded.clienteId],
    );
    if (result.rows.length === 0)
      return res.status(401).json({ erro: "Cliente não encontrado" });
    req.cliente = result.rows[0];
    next();
  } catch (err) {
    res.status(401).json({ erro: "Token inválido" });
  }
};

module.exports = autenticar;
