// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      color: String,
      size: String,
      quantity: { type: Number, default: 1 },
      price:   { type: Number, default: 0 },
      image: String,
      name:  String, // (facultatif) utile pour historiser le nom au moment de la commande
    }
  ],

  // ✅ Adresse de livraison
  shippingAddress: {
    name:   { type: String, default: "" },
    phone:  { type: String, default: "" },
    address:{ type: String, default: "" },
    city:   { type: String, default: "" },
    zip:    { type: String, default: "" },
  },

  total: { type: Number, required: true },
  delivery: { type: String, default: "standard" },
  paymentMethod: { type: String, default: "espèces" },

  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },

  createdAt: { type: Date, default: Date.now }, // tu gardes ton champ existant
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
});

module.exports = mongoose.model("Order", orderSchema);
