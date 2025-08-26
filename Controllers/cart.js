const Cart = require("../models/Cart");

// Vider le panier
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    if (!userId) return res.status(400).json({ message: "Utilisateur non identifié" });

    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({ message: "Panier vidé", items: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
