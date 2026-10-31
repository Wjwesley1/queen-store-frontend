const express = require("express");
const router = express.Router();

const {
  getCarrinho,
  adicionarAoCarrinho,
  atualizarCarrinho,
  removerDoCarrinho,
} = require("../controllers/cartController");

router.get("/", getCarrinho);
router.post("/", adicionarAoCarrinho);
router.put("/:produto_id", atualizarCarrinho);
router.delete("/:produto_id", removerDoCarrinho);
router.get("/:produto_id", (req, res) => {
  res.status(405).json({ erro: "Use DELETE para remover um item do carrinho" });
});

module.exports = router;
