const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  color: String,
  size: String,
  quantity: { type: Number, default: 1 },
  image: String, // ⚡ on garde l'URL en cache
  name: String,
  price: Number
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 👈 lien user
  items: [cartItemSchema]
});

module.exports = mongoose.model("Cart", cartSchema);
