const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  colors: [String],
  sizes: [String],
  images: [String], // 👈 tableau d'URLs d'images
  category: { type: String, required: true }
});

module.exports = mongoose.model("Product", productSchema);
