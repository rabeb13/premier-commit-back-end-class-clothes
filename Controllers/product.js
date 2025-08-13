const Product = require("../models/Product");

/**
 * Ajouter un produit (ADMIN uniquement)
 */
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description = "",
      price,
      category = "",
      sizes = [],
      colors = [],
      stock = 0,
      images = []
    } = req.body;

    // Validation basique
    if (!name || price == null) {
      return res.status(400).json({ msg: "Le nom et le prix sont requis" });
    }
    if (Number(price) < 0) {
      return res.status(400).json({ msg: "Le prix doit être positif" });
    }
    if (Number(stock) < 0) {
      return res.status(400).json({ msg: "Le stock doit être positif" });
    }

    const newProduct = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      sizes,
      colors,
      stock: Number(stock),
      images
    });

    return res.status(201).json({ msg: "Produit ajouté avec succès", product: newProduct });
  } catch (error) {
    console.error("Erreur addProduct:", error);
    return res.status(500).json({ msg: "Erreur serveur" });
  }
};

/**
 * Lister tous les produits (accessible à tous)
 */
exports.getAllProduct = async (req, res) => {
  try {
    const listProducts = await Product.find().sort("-createdAt");
    return res.status(200).json({ msg: "Liste des produits", products: listProducts });
  } catch (error) {
    console.error("Erreur getAllProduct:", error);
    return res.status(500).json({ msg: "Erreur serveur" });
  }
};

/**
 * Récupérer un produit par ID (accessible à tous)
 */
exports.getOneProduct = async (req, res) => {
  try {
    const productToGet = await Product.findById(req.params.id);
    if (!productToGet) {
      return res.status(404).json({ msg: "Produit introuvable" });
    }
    return res.status(200).json({ msg: "Produit trouvé", product: productToGet });
  } catch (error) {
    console.error("Erreur getOneProduct:", error);
    return res.status(400).json({ msg: "ID invalide" });
  }
};

/**
 * Supprimer un produit (ADMIN uniquement)
 */
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: "Produit introuvable" });
    }
    return res.status(200).json({ msg: "Produit supprimé" });
  } catch (error) {
    console.error("Erreur deleteProduct:", error);
    return res.status(400).json({ msg: "ID invalide" });
  }
};

/**
 * Modifier un produit (ADMIN uniquement)
 */
exports.editProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Produit introuvable" });
    }
    return res.status(200).json({ msg: "Produit mis à jour", product: updated });
  } catch (error) {
    console.error("Erreur editProduct:", error);
    return res.status(400).json({ msg: "ID invalide ou données incorrectes" });
  }
};
