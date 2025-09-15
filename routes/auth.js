const crypto = require("crypto");
const nodemailer = require("nodemailer");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isAuth } = require("../middleware/isAuth");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, isAdmin } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email déjà utilisé" });

    const hash = await bcrypt.genSalt(10).then(s => bcrypt.hash(password, s));
    const user = await User.create({
      name,
      email,
      password: hash,
      phone,
      isAdmin: !!isAdmin, // ⚠️ n’utilise true que pour TON compte admin
    });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Email ou mot de passe invalide" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: "Email ou mot de passe invalide" });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
// POST /api/auth/forgot-password
// Envoie un email avec un lien de réinitialisation (token valable 15 min)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email requis" });

    const user = await User.findOne({ email });
    // Anti-énumération: on répond 'OK' même si l'email n'existe pas
    if (!user) return res.json({ msg: "Si cet email existe, un lien a été envoyé." });

    // Créer un token aléatoire + expiration
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    // Transporter nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false, // true si 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: "Réinitialisation du mot de passe",
      html: `
        <p>Bonjour ${user.name || ""},</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Veuillez cliquer sur ce lien (valable 15 minutes) :</p>
        <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
        <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
      `,
    });

    res.json({ msg: "Email envoyé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur serveur" });
  }
});

// POST /api/auth/reset-password
// Valide le token et remplace le mot de passe par le nouveau
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ msg: "Token et nouveau mot de passe requis" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // non expiré
    });

    if (!user) return res.status(400).json({ msg: "Lien invalide ou expiré" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    // Invalider le token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: "Mot de passe mis à jour" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur serveur" });
  }
});

// GET /api/auth/me
router.get("/me", isAuth, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
