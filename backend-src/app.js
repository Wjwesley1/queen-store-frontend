require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ==================== CORS ====================
app.use(
  cors({
    origin: function (origin, callback) {
      const allowed = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://queen-store-frontend.vercel.app",
        "https://queen-store-frontend.onrender.com",
        "https://www.queenstore.store",
        "https://queenstore.store",
      ];
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-session-id",
      "X-Session-Id",
      "Origin",
      "Accept",
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

app.use(express.json());

// ==================== ROTAS RAIZ E HEALTH ====================
const statusHandler = (req, res) => {
  res.json({
    mensagem: "Queen Store API IMORTAL",
    status: "100% NO AR",
    data: new Date().toLocaleString("pt-BR"),
  });
};

const healthHandler = async (req, res) => {
  const hasDbUrl = Boolean(process.env.DATABASE_URL);
  if (!hasDbUrl) {
    return res.status(500).json({
      status: "ERRO",
      motivo: "DATABASE_URL não configurada no painel da Vercel",
      timestamp: new Date().toLocaleString("pt-BR"),
    });
  }

  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "OK",
      banco: "conectado",
      hora_banco: result.rows[0].now,
      timestamp: new Date().toLocaleString("pt-BR"),
    });
  } catch (err) {
    res.status(500).json({
      status: "ERRO",
      motivo: "Falha ao conectar no PostgreSQL",
      erro: err.message,
      timestamp: new Date().toLocaleString("pt-BR"),
    });
  }
};

app.get("/", statusHandler);
app.get("/api", statusHandler);
app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

// ==================== MONTAGEM DAS ROTAS ====================
app.use("/api", productRoutes);
app.use("/api/carrinho", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", customerRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminRoutes);

module.exports = app;
