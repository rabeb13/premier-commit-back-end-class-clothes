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

// Current user (renvoie les infos décodées du token)
router.get("/current", isAuth, (req, res) => {
    res.send({user: req.user});
});

// Update user profile
router.put("/update", isAuth, async (req, res) => {
    try {
        const { name, email, phone, password, address, city, zip } = req.body;
        const updatedFields = {};

        if (name) updatedFields.name = name;
        if (email) updatedFields.email = email;
        if (phone) updatedFields.phone = phone;
        if (address) updatedFields.address = address;
        if (city) updatedFields.city = city;
        if (zip) updatedFields.zip = zip;

        if (password) {
            const saltRounds = 10;
            updatedFields.password = await bcrypt.hash(password, saltRounds);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updatedFields },
            { new: true }
        ).select('-password');

        res.status(200).send({ msg: "Profil mis à jour avec succès", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Impossible de mettre à jour le profil", error });
    }
});

module.exports = router;
