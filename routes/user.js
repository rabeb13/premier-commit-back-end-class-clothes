// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { register, login } = require("../Controllers/user");
const {
  registerValidation,
  validation,
  loginValidation,
} = require('../middleware/validation');
const { isAuth } = require('../middleware/isAuth');

// Register
router.post("/register", registerValidation(), validation, register);

// Login
router.post("/login", loginValidation(), validation, login);

// Current user (renvoie l'objet user direct)
router.get("/current", isAuth, (req, res) => {
  res.json(req.user); // ✅ plus de { user: ... }
});

// Update user profile
router.put("/update", isAuth, async (req, res) => {
  try {
    const { name, email, phone, password, address, city, zip } = req.body;
    const updatedFields = {};

    if (name !== undefined) updatedFields.name = name;
    if (email !== undefined) updatedFields.email = email;
    if (phone !== undefined) updatedFields.phone = phone;
    if (address !== undefined) updatedFields.address = address;
    if (city !== undefined) updatedFields.city = city;
    if (zip !== undefined) updatedFields.zip = zip;

    if (password) {
      const saltRounds = 10;
      updatedFields.password = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,                  // ✅ préfère _id
      { $set: updatedFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ msg: "Profil mis à jour avec succès", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Impossible de mettre à jour le profil", error });
  }
});

module.exports = router;
