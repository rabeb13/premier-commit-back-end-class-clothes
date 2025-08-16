const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// GET cart
router.get("/", async (req, res) => {
  let cart = await Cart.findOne().populate("items.productId"); // <-- important !
  if (!cart) {
    cart = new Cart({ items: [] });
    await cart.save();
  }
  res.json(cart);
});


// POST add to cart
router.post("/add", async (req, res) => {
  const { productId, color, size, quantity } = req.body;

  let cart = await Cart.findOne();
  if (!cart) {
    cart = new Cart({ items: [] });
  }

  const existingItem = cart.items.find(
    i => i.productId.toString() === productId && 
    i.color === color && 
    i.size === size
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, color, size, quantity });
  }

  await cart.save();
  res.json(cart);
});

// PATCH update quantity
router.patch("/update/:id", async (req, res) => {
  const { quantity } = req.body;
  let cart = await Cart.findOne().populate("items.productId"); // <-- important !
  const item = cart.items.id(req.params.id);
  if (item) {
    item.quantity = quantity;
    await cart.save();
  }
  res.json(cart);
});

// DELETE remove item
router.delete("/remove/:id", async (req, res) => {
  try {
    const { id } = req.params;

  let cart = await Cart.findOne().populate("items.productId"); // <-- important !
    if (!cart) return res.status(404).json({ error: "Panier introuvable" });

    const item = cart.items.id(id);
    if (!item) return res.status(404).json({ error: "Article non trouvé" });

    item.deleteOne(); // <-- remplace .remove()
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
