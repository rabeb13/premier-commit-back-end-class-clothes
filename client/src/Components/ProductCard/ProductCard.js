import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../JS/Actions/cart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const isAdmin = user?.isAdmin;

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Choix de l'image à afficher
  const displayedImage =
    (selectedColor && product.images?.[selectedColor]) || 
    product.image || 
    (product.images ? Object.values(product.images)[0] : "");

  // Ajouter au panier
  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Veuillez choisir une couleur et une taille !");
      return;
    }
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        color: selectedColor,
        size: selectedSize,
        quantity: 1,
        image: displayedImage,
      })
    );
    toast.success("Produit ajouté au panier ✔");
  };

  // Supprimer produit (admin)
  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      await axios.delete(`/api/products/${product._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Produit supprimé !");
      window.location.reload();
    } catch (err) {
      toast.error("Erreur lors de la suppression !");
    }
  };

  // Edit produit (admin)
  const handleEdit = () => {
    navigate(`/edit-product/${product._id}`);
  };

  return (
    <div className="product-card">
      <img src={displayedImage} alt={product.name} className="product-img" />
      <h3>{product.name}</h3>
      <p>{product.price} DT</p>

      {/* Couleurs */}
      <div className="colors">
        {product.colors?.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedColor(c)}
            style={{
              background: c,
              border: selectedColor === c ? "2px solid black" : "1px solid #ccc",
              width: 24,
              height: 24,
              margin: 4,
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* Tailles */}
      <div className="sizes">
        {product.sizes?.map((s) => (
          <button
            key={s}
            onClick={() => setSelectedSize(s)}
            className={selectedSize === s ? "active" : ""}
          >
            {s}
          </button>
        ))}
      </div>

      <button onClick={handleAddToCart} className="add-to-cart">
        Ajouter au panier
      </button>

      {isAdmin && (
        <div className="admin-actions">
          <button onClick={handleEdit} className="edit-btn">✏ Modifier</button>
          <button onClick={handleDelete} className="delete-btn">🗑 Supprimer</button>
        </div>
      )}
    </div>
  );
}
