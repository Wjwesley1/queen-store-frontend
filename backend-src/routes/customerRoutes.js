const express = require("express");
const router = express.Router();
const autenticar = require("../middlewares/auth");

const {
  getPerfil,
  getDados,
  getEnderecos,
  atualizarEnderecos,
  atualizarCadastro,
  getPedidosCliente,
  getDesejos,
} = require("../controllers/customerController");

router.get("/clientes/perfil", autenticar, getPerfil);
router.get("/cliente/dados", autenticar, getDados);
router.get("/cliente/enderecos", autenticar, getEnderecos);
router.patch("/cliente/enderecos", autenticar, atualizarEnderecos);
router.patch("/clientes/atualizar", autenticar, atualizarCadastro);
router.get("/clientes/pedidos", autenticar, getPedidosCliente);
router.get("/desejos", autenticar, getDesejos);

module.exports = router;
