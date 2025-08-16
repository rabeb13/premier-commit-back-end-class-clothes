const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  colors: [String],
  sizes: [String],
  image: String, 
  category: { type: String, required: true } // 👈 ajouté

  
});

module.exports = mongoose.model("Product", productSchema);
