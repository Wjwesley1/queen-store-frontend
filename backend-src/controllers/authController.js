const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { enviarEmail, emailVerificacaoConta } = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// REGISTRO
const register = async (req, res) => {
  const { nome, email, senha, whatsapp } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
  }

  try {
    const existe = await pool.query('SELECT id FROM clientes WHERE email = $1', [email.toLowerCase()]);
    if (existe.rows.length > 0) return res.status(400).json({ erro: 'Email já cadastrado' });

    const senhaHash = await bcrypt.hash(senha, 10);
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.query(`
      INSERT INTO clientes (nome, email, senha_hash, whatsapp, verification_token, verification_expires, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6, false)
    `, [nome.trim(), email.toLowerCase(), senhaHash, whatsapp || null, token, expires]);

    const verifyLink = `https://queen-store-frontend.vercel.app/verify/${token}`;
    await enviarEmail(email, nome, 'Confirme sua conta Queen Store 💜', emailVerificacaoConta(nome, verifyLink));

    res.json({ sucesso: true, mensagem: 'Cadastro realizado! Confira seu email para confirmar a conta.' });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar', detalhe: err.message });
  }
};

// VERIFICAR CONTA
const verifyAccount = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM clientes
      WHERE verification_token = $1 AND verification_expires > NOW()
    `, [req.params.token]);

    if (result.rows.length === 0) return res.status(400).json({ erro: 'Token inválido ou expirado' });

    await pool.query(`
      UPDATE clientes
      SET is_verified = true, verification_token = NULL, verification_expires = NULL
      WHERE id = $1
    `, [result.rows[0].id]);

    res.json({ sucesso: true, mensagem: 'Conta verificada! Pode logar agora.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao verificar conta' });
  }
};

// REENVIAR VERIFICAÇÃO
const resendVerification = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ erro: 'Email obrigatório' });

  try {
    const result = await pool.query('SELECT id, nome, is_verified FROM clientes WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Email não encontrado' });

    const user = result.rows[0];
    if (user.is_verified) return res.status(400).json({ erro: 'Conta já verificada' });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.query(`
      UPDATE clientes SET verification_token = $1, verification_expires = $2 WHERE id = $3
    `, [token, expires, user.id]);

    const verifyLink = `https://queen-store-frontend.vercel.app/verify/${token}`;
    await enviarEmail(email, user.nome, 'Reenvio: Confirme sua conta Queen Store 💜', emailVerificacaoConta(user.nome, verifyLink));

    res.json({ sucesso: true, mensagem: 'Email de confirmação reenviado!' });
  } catch (err) {
    console.error('Erro no reenvio:', err);
    res.status(500).json({ erro: 'Erro ao reenviar email' });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ erro: 'Email e senha obrigatórios' });

  try {
    const result = await pool.query('SELECT * FROM clientes WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) return res.status(400).json({ erro: 'Email ou senha incorretos' });

    const cliente = result.rows[0];

    if (!cliente.senha_hash) return res.status(400).json({ erro: 'Essa conta usa login com Google' });

    if (!cliente.is_verified) return res.status(403).json({ erro: 'Confirme sua conta pelo email antes de logar' });

    const senhaValida = await bcrypt.compare(senha, cliente.senha_hash);
    if (!senhaValida) return res.status(400).json({ erro: 'Email ou senha incorretos' });

    const token = jwt.sign({ clienteId: cliente.id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ sucesso: true, token, cliente: { id: cliente.id, nome: cliente.nome, email: cliente.email } });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
};

// LOGIN COM GOOGLE
const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const googleId = payload['sub'];
    const email = payload['email'];
    const nome = payload['name'] || email.split('@')[0];

    let result = await pool.query('SELECT * FROM clientes WHERE google_id = $1 OR email = $2', [googleId, email]);
    let cliente = result.rows[0];

    if (!cliente) {
      result = await pool.query(`
        INSERT INTO clientes (nome, email, google_id, is_verified)
        VALUES ($1, $2, $3, true)
        RETURNING id, nome, email
      `, [nome, email, googleId]);
      cliente = result.rows[0];
    } else if (!cliente.google_id) {
      await pool.query('UPDATE clientes SET google_id = $1, is_verified = true WHERE id = $2', [googleId, cliente.id]);
    }

    const jwtToken = jwt.sign({ clienteId: cliente.id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ sucesso: true, token: jwtToken, cliente: { id: cliente.id, nome: cliente.nome || nome, email: cliente.email || email } });
  } catch (err) {
    console.error('Erro login Google:', err);
    res.status(400).json({ erro: 'Token Google inválido' });
  }
};

module.exports = {
  register,
  verifyAccount,
  resendVerification,
  login,
  googleLogin
};
