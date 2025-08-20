const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  colors: [String],
  sizes: [String],
  images: [
  {
    url: String,
    color: String,  // <-- indispensable pour la correspondance
    public_id: String,
  }],
  category: { type: String, required: true }
});

module.exports = mongoose.model("Product", productSchema);
