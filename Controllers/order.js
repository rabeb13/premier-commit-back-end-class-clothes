exports.createOrder = async (req, res) => {
  console.log("Nouvelle commande reçue :", req.body);
  try {
    const { userId, items, total, delivery, paymentMethod, shippingAddress } = req.body;

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
      shippingAddress: {
        name: shippingAddress?.name || "",
        phone: shippingAddress?.phone || "",
        address: shippingAddress?.address || "",
        city: shippingAddress?.city || "",
        zip: shippingAddress?.zip || "",
      },
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Erreur création commande :", err.message);
    res.status(500).json({ error: err.message });
  }
};
// Récupérer toutes les commandes (pour Admin)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.productId") // optionnel : pour avoir le détail produit
      .sort({ createdAt: -1 });    // plus récentes d'abord

    res.status(200).json(orders);
  } catch (err) {
    console.error("Erreur getOrders:", err.message);
    res.status(500).json({ error: err.message });
  }
};
