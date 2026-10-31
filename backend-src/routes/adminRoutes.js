const express = require("express");
const router = express.Router();

const {
  getPedidosPendentes,
  getEstoqueBaixo,
  getFaturamentoHoje,
} = require("../controllers/adminController");

router.get("/admin/pedidos-pendentes", getPedidosPendentes);
router.get("/admin/estoque-baixo", getEstoqueBaixo);
router.get("/admin/faturamento-hoje", getFaturamentoHoje);

module.exports = router;
