const Order = require("../models/Order");

// Créer une nouvelle commande
exports.createOrder = async (req, res) => {
  console.log("Nouvelle commande reçue :", req.body);
  try {
    const { userId, items, total, delivery, paymentMethod } = req.body;

    // Vérification basique
    if (!userId || !items || !total) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

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
};

// Récupérer toutes les commandes (optionnel pour admin)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.productId");
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};
