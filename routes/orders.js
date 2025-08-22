const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { isAuth } = require("../middleware/isAuth"); // middleware auth (JWT)

// POST : créer une nouvelle commande
router.post("/", isAuth, async (req, res) => {
  try {
    const { items, total, delivery, paymentMethod } = req.body;

    if (!items || items.length === 0 || !total) {
      return res.status(400).json({ error: "Champs requis manquants ou panier vide" });
    }

    const newOrder = new Order({
      userId: req.user._id, // récupéré via token
      items,
      total,
      delivery: delivery || "standard",
      paymentMethod: paymentMethod || "cash",
      status: "pending",
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Erreur création commande :", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET : récupérer toutes les commandes (admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("items.productId");
    res.json(orders);
  } catch (err) {
    console.error("Erreur récupération commandes :", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
