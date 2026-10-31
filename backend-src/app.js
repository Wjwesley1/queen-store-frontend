const express = require("express");
const cors = require("cors");

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

const healthHandler = (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toLocaleString("pt-BR") });
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
