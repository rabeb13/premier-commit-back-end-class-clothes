const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.isAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).send({ msg: "No token, authorization denied" });
    }

    // Accepter "Bearer <token>" OU "<token>"
    const parts = authHeader.trim().split(/\s+/);
    const token =
      parts.length === 2 && /^Bearer$/i.test(parts[0]) ? parts[1] :
      parts.length === 1 ? parts[0] : null;

    if (!token) {
      return res.status(401).send({ msg: "Not authorized !!" });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Supporte différents noms possibles dans le payload
    const userId = decoded.id || decoded.userId || decoded._id;
    if (!userId) {
      return res.status(401).send({ msg: "Token not valid" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).send({ msg: "User not found" });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    return res.status(401).send({ msg: "Token not valid" });
  }
};
