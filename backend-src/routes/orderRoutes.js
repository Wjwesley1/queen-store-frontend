const express = require("express");
const router = express.Router();

const {
  criarPedido,
  getPedidosAdmin,
  atualizarPedido,
} = require("../controllers/orderController");

router.post("/pedidos", criarPedido);
router.get("/admin/pedidos", getPedidosAdmin);
router.patch("/pedidos/:id", atualizarPedido);

module.exports = router;
