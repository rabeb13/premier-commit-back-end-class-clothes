const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ✅ GET all products (ou filtrer par catégorie avec ?category=xxx)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query; // ex: /api/products?category=dresses

    let products;
    if (category) {
      products = await Product.find({ category: category.toLowerCase() });
    } else {
      products = await Product.find();
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST new product
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      colors: req.body.colors,   // tableau ["red","blue","black"]
      sizes: req.body.sizes,     // tableau ["S","M","L"]
      images: req.body.images,   // objet { red:"url", blue:"url", black:"url" }
      category: req.body.category
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
