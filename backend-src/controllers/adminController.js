const pool = require("../config/db");

const getPedidosPendentes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as total FROM pedidos WHERE status IN ('pendente', 'pago') OR status IS NULL`,
    );
    res.json({ total: parseInt(result.rows[0].total) || 0 });
  } catch (err) {
    res.json({ total: 0 });
  }
};

const getEstoqueBaixo = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as total FROM produtos WHERE estoque > 0 AND estoque <= 5`,
    );
    res.json({ total: parseInt(result.rows[0].total) || 0 });
  } catch (err) {
    res.json({ total: 0 });
  }
};

const getFaturamentoHoje = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COALESCE(SUM(valor_total), 0) as total
      FROM pedidos
      WHERE DATE(criado_em) = CURRENT_DATE AND status != 'pendente'
    `);
    res.json({ total: parseFloat(result.rows[0].total) || 0 });
  } catch (err) {
    res.json({ total: 0 });
  }
};

module.exports = {
  getPedidosPendentes,
  getEstoqueBaixo,
  getFaturamentoHoje,
};
