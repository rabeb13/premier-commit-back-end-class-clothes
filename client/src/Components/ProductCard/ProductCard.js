import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../JS/Actions/cart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const isAdmin = user?.isAdmin;

  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(null);

  // états loupe
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  // calcule l'origine en fonction du curseur
  const setOriginFromEvent = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  // clic active/désactive le zoom
  const handleClickZoom = (e) => {
    if (zoomed) {
      setZoomed(false);
      setOrigin("50% 50%");
    } else {
      setZoomed(true);
      setOriginFromEvent(e);
    }
  };

  // si on est en mode zoom, on déplace la loupe en suivant la souris
  const handleMouseMove = (e) => {
    if (!zoomed) return;
    setOriginFromEvent(e);
  };

  // ⚡ image par couleur
  const getImageByColor = (color) => {
    const imgObj = product.images?.find((img) => img.color === color);
    return imgObj ? imgObj.url : product.images?.[0]?.url || "";
  };

  const displayedImage =
    selectedColor ? getImageByColor(selectedColor) : product.images?.[0]?.url || "";

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

  return (
    <div className="product-card">
      {/* Image avec effet loupe au clic */}
      <div
        className="card-img-container"
        onClick={handleClickZoom}
        onMouseMove={handleMouseMove}
      >
        <img
          src={displayedImage}
          alt={product.name}
          className={`product-img ${zoomed ? "zoomed" : ""}`}
          style={{
            transformOrigin: origin,
            transform: zoomed ? "scale(2)" : "scale(1)", // facteur de zoom
            cursor: zoomed ? "zoom-out" : "zoom-in",
            transition: zoomed ? "none" : "transform 0.25s ease",
          }}
        />
      </div>

      {/* Couleurs */}
      <div className="pc-swatches">
        {product.colors?.map((c) => (
          <span
            key={c}
            className={`pc-swatch ${selectedColor === c ? "selected" : ""}`}
            style={{ background: c }}
            onClick={() => setSelectedColor(c)}
          />
        ))}
      </div>

      {/* Tailles */}
      <div className="pc-sizes">
        {product.sizes?.map((s) => (
          <span
            key={s}
            className={`pc-size ${selectedSize === s ? "active" : ""}`}
            onClick={() => setSelectedSize(s)}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Titre */}
      <div className="pc-title">{product.name}</div>

      {/* Prix */}
      <div className="pc-price">{Number(product.price).toFixed(2)} DT</div>

      {/* Bouton panier */}
      <button onClick={handleAddToCart} className="add-to-cart">
        Ajouter au panier
      </button>
    </div>
  );
}
