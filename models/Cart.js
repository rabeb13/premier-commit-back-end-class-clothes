const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  color: String,
  size: String,
  quantity: { type: Number, default: 1 }
});

const cartSchema = new mongoose.Schema({
  items: [cartItemSchema]
});

module.exports = mongoose.model("Cart", cartSchema);
