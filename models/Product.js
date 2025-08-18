const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  colors: [String],
  sizes: [String],
  images: {
    type: Map,
    of: String, // clé = couleur, valeur = URL image
  },
  category: { type: String, required: true }
});

module.exports = mongoose.model("Product", productSchema);
