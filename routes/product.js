const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { isAuth, adminOnly } = require("../middleware/isAuth");

// helper pour normaliser category/couleurs/images
function buildImagesMap(body) {
  const map = new Map();

  // 1) si body.images est un objet simple -> le transférer dans Map
  if (body.images && typeof body.images === "object") {
    for (const [k, v] of Object.entries(body.images)) {
      if (typeof v === "string" && v.trim()) map.set(k, v.trim());
    }
  }

  // 2) fallback si une seule image fournie
  if ((!map.size) && body.image && typeof body.image === "string" && body.image.trim()) {
    const firstColor = Array.isArray(body.colors) && body.colors.length ? body.colors[0] : "default";
    map.set(firstColor, body.image.trim());
  }

  return map;
}

// ✅ GET all products (ou filtrer par catégorie avec ?category=xxx)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const q = category ? { category: category.toLowerCase() } : {};
    const products = await Product.find(q).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET one product
router.get("/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Product not found" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST new product (admin)
router.post("/", isAuth, adminOnly, async (req, res) => {
  try {
    const images = buildImagesMap(req.body);

    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      colors: Array.isArray(req.body.colors) ? req.body.colors : [],
      sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [],
      images, // Map
      category: req.body.category?.toLowerCase(),
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT (edit product) (admin)
router.put("/:id", isAuth, adminOnly, async (req, res) => {
  try {
    const images = buildImagesMap(req.body);
    const $set = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      colors: Array.isArray(req.body.colors) ? req.body.colors : [],
      sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [],
      category: req.body.category?.toLowerCase(),
    };

    // ne remplace images QUE si on envoie des images dans la requête
    if (images.size) $set.images = images;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE product (admin)
router.delete("/:id", isAuth, adminOnly, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
