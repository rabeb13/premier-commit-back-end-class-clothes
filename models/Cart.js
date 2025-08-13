const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  color: String,
  size: String,
  quantity: Number
});

const cartSchema = new mongoose.Schema({
  items: [cartItemSchema]
});

module.exports = mongoose.model("Cart", cartSchema);
