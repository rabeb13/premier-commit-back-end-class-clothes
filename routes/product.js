const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { isAuth, adminOnly } = require("../middleware/isAuth");

// helper pour normaliser images
function buildImagesArray(body) {
  // si body.images est un tableau valide
  if (Array.isArray(body.images) && body.images.length) return body.images;

  // fallback si une seule image fournie
  if (body.image && typeof body.image === "string" && body.image.trim())
    return [body.image.trim()];

  return [];
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
    const images = buildImagesArray(req.body);

    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      colors: Array.isArray(req.body.colors) ? req.body.colors : [],
      sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [],
      images: images,
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
    const images = buildImagesArray(req.body);

    const $set = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      colors: Array.isArray(req.body.colors) ? req.body.colors : [],
      sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [],
      category: req.body.category?.toLowerCase(),
    };

    // mettre à jour images seulement si tableau non vide
    if (images.length) $set.images = images;

    const updated = await Product.findByIdAndUpdate(req.params.id, { $set }, { new: true });
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE product (admin)
router.delete("/:id", isAuth, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // supprimer toutes les images du produit dans Cloudinary
    for (let img of product.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted with images" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
