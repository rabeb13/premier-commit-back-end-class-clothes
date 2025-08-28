const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { isAuth, adminOnly } = require("../middleware/isAuth"); // middleware auth (JWT)

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

// GET : récupérer mes commandes (user connecté)
router.get("/my", isAuth, async (req, res) => {
  try {
    const myOrders = await Order.find({ userId: req.user._id }).populate("items.productId");
    res.json(myOrders);
  } catch (err) {
    console.error("Erreur récupération mes commandes :", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET : récupérer une commande par ID (propriétaire ou admin)
router.get("/:id", isAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.productId");
    if (!order) return res.status(404).json({ error: "Commande introuvable" });

    // Vérifier si l'utilisateur est propriétaire ou admin
    if (order.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: "Accès interdit" });
    }

    res.json(order);
  } catch (err) {
    console.error("Erreur récupération commande :", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET : récupérer toutes les commandes (admin uniquement)
router.get("/", isAuth, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.productId", "name price images adress")
      .populate("userId", "name email phone"); // infos user utiles pour admin
    res.json(orders);
  } catch (err) {
    console.error("Erreur récupération commandes :", err.message);
    res.status(500).json({ error: err.message });
  }
});
// PATCH statut commande (admin)
router.patch("/:id/status", isAuth, adminOnly, async (req, res) => {
  try {
    const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    const { status } = req.body;
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Statut invalide" });
    }

    const update = { status };
    if (status === "shipped") update.shippedAt = new Date();
    if (status === "delivered") update.deliveredAt = new Date();
    if (status === "cancelled") update.cancelledAt = new Date();

    const order = await Order.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!order) return res.status(404).json({ error: "Commande introuvable" });

    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.delete("/:id", isAuth, adminOnly, async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Commande introuvable" });
    res.json({ ok: true, deletedId: req.params.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


module.exports = router;
