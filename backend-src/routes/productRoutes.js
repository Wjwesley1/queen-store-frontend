const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  getProdutos,
  getProdutoById,
  cadastrarProduto,
  editarProduto,
  atualizarEstoque,
  deletarProduto,
  getCategorias,
} = require("../controllers/productController");

// GET /api/categorias
router.get("/categorias", getCategorias);

// GET /api/produtos
router.get("/produtos", getProdutos);

// GET /api/produtos/:id
router.get("/produtos/:id", getProdutoById);

// POST /api/produtos
router.post("/produtos", upload.array("imagens", 4), cadastrarProduto);

// PATCH /api/produtos/:id
router.patch("/produtos/:id", editarProduto);

// PATCH /api/produtos/:id/estoque
router.patch("/produtos/:id/estoque", atualizarEstoque);

// DELETE /api/produtos/:id
router.delete("/produtos/:id", deletarProduto);

module.exports = router;
