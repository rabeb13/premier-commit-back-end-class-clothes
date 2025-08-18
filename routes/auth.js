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

// GET /api/auth/me
router.get("/me", isAuth, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
