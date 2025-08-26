const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { isAuth } = require("../middleware/isAuth");

// Fonction utilitaire pour normaliser les items (images)
const normalizeCart = (cart) => {
  if (!cart) return cart;
  cart.items = cart.items.map((i) => ({
    ...i._doc,
    image: i.image || i.productId?.images?.[0] || "",
  }));
  return cart;
};

// GET cart (panier de l'utilisateur connecté)
router.get("/", isAuth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
      await cart.save();
    }
    res.json(normalizeCart(cart));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add to cart
router.post("/add", isAuth, async (req, res) => {
  try {
    const { productId, color, size, quantity, image, name, price } = req.body;

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) cart = new Cart({ userId: req.user._id, items: [] });

    const existingItem = cart.items.find(
      (i) =>
        i.productId.toString() === productId &&
        i.color === color &&
        i.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, color, size, quantity, image, name, price });
    }

    await cart.save();
    cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");

    res.json(normalizeCart(cart));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update quantity
router.patch("/update/:id", isAuth, async (req, res) => {
  try {
    const { quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
    if (!cart) return res.status(404).json({ error: "Panier introuvable" });

    const item = cart.items.id(req.params.id);
    if (!item) return res.status(404).json({ error: "Article non trouvé" });

    item.quantity = quantity;
    await cart.save();

    cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
    res.json(normalizeCart(cart));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE remove item
router.delete("/remove/:id", isAuth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
    if (!cart) return res.status(404).json({ error: "Panier introuvable" });

    const item = cart.items.id(req.params.id);
    if (!item) return res.status(404).json({ error: "Article non trouvé" });

    item.deleteOne();
    await cart.save();

    cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
    res.json(normalizeCart(cart));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE clear cart après commande
router.delete("/clear", isAuth, async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { items: [] } }
    );
    res.json({ message: "Panier vidé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
