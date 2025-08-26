const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.isAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).send({ msg: "No token, authorization denied" });

    const parts = authHeader.trim().split(/\s+/);
    const token =
      parts.length === 2 && /^Bearer$/i.test(parts[0]) ? parts[1] :
      parts.length === 1 ? parts[0] : null;

    if (!token) return res.status(401).send({ msg: "Not authorized !!" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.id || decoded.userId || decoded._id;
    if (!userId) return res.status(401).send({ msg: "Token not valid" });

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(401).send({ msg: "User not found" });

    req.user = user;          // ex: { _id, name, email, isAdmin }
    req.userId = user._id;
    next();
  } catch (error) {
    return res.status(401).send({ msg: "Token not valid" });
  }
};

// 👇 Protection admin
exports.adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) return res.status(403).send({ msg: "Admin only" });
  next();
};