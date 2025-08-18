const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// POST : créer une nouvelle commande
router.post("/", async (req, res) => {
  console.log("Nouvelle commande reçue :", req.body);

  try {
    const { userId, items, total, delivery, paymentMethod } = req.body;

    // Validation simple
    if (!userId || !items || !total) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    // Création de la commande
    const newOrder = new Order({
      userId,
      items,
      total,
      delivery: delivery || "standard",
      paymentMethod: paymentMethod || "card",
      status: "pending",
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Erreur création commande :", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET : récupérer toutes les commandes (optionnel pour admin)
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
