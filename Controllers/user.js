const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 📌 REGISTER
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        const foundUser = await User.findOne({ email });
        if (foundUser) {
            return res.status(400).send({ msg: "Email already exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            role: role || "user"
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).send({ msg: "Register success", user: newUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Cannot register", error });
    }
};

// 📌 LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            return res.status(400).send({ msg: "Bad credentials" });
        }

        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(400).send({ msg: "Bad credentials" });
        }

        const token = jwt.sign(
            { id: foundUser._id, role: foundUser.role },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).send({ msg: "Login success", user: foundUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Cannot login", error });
    }
};

// 📌 GET CURRENT USER
exports.currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).send({ user });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Cannot get current user", error });
    }
};

// 📌 UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, phone, address, city, zip } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { name, email, phone, address, city, zip },
            { new: true }
        ).select("-password");

        res.status(200).send({ msg: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Cannot update profile", error });
    }
};
