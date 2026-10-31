const express = require("express");
const router = express.Router();

const {
  register,
  verifyAccount,
  resendVerification,
  login,
  googleLogin,
} = require("../controllers/authController");

router.post("/register", register);
router.get("/verify/:token", verifyAccount);
router.post("/resend-verification", resendVerification);
router.post("/login", login);
router.post("/google", googleLogin);

module.exports = router;
