const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  console.error("AVISO CRÍTICO: DATABASE_URL não foi definida nas variáveis de ambiente!");
}

let connectionString = process.env.DATABASE_URL || "";
// Remove channel_binding=require se presente, pois pode causar falhas em conexões SSL com certas versões do driver pg
if (connectionString.includes("channel_binding=require")) {
  connectionString = connectionString
    .replace("&channel_binding=require", "")
    .replace("channel_binding=require&", "")
    .replace("channel_binding=require", "");
}

const pool = new Pool({
  connectionString: connectionString || undefined,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
