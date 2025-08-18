const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      color: String,
      size: String,
      quantity: Number,
      price: Number,
      image: String
    }
  ],
  total: { type: Number, required: true },
  delivery: { type: String, default: "standard" },
  paymentMethod: { type: String, default: "card" },
  status: { type: String, default: "pending" }, // pending, confirmed, shipped, delivered
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
