import React, { useState } from "react";
import "./JeansCard.css";

const JeansCard = ({ product, onAddToCart }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");

  const requiresColor = (product.colors?.length ?? 0) > 0;
  const requiresSize = (product.sizes?.length ?? 0) > 0;

  const disabled =
    (requiresColor && !selectedColor) || (requiresSize && !selectedSize);

  const fmt = (n) => Number(n || 0).toFixed(2);

  const handleClick = () => {
    onAddToCart?.({ ...product, color: selectedColor || null, size: selectedSize || null });
  };

  return (
    <div className="jeans-card">
      <div className="jeans-card__img-wrapper">
        <img
          src={product.image}
          alt={product.name || "Jeans"}
          className="jeans-card__img"
        />
      </div>

      <h3 className="jeans-card__title">{product.name}</h3>
      {product.description && (
        <p className="jeans-card__desc">{product.description}</p>
      )}

      {product.price != null && (
        <div className="jeans-card__price">{fmt(product.price)} DT</div>
      )}

      {requiresColor && (
        <div className="jeans-card__colors">
          <strong>Couleurs :</strong>
          <div className="jeans-card__colors-list">
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                title={color}
                onClick={() => setSelectedColor(color)}
                className={`jeans-card__dot ${selectedColor === color ? "jeans-card__dot--active" : ""}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {requiresSize && (
        <div className="jeans-card__sizes">
          <strong>Tailles :</strong>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="jeans-card__select"
          >
            {product.sizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      )}

      <button
        className="jeans-card__btn"
        disabled={disabled}
        onClick={handleClick}
      >
        Ajouter au panier
      </button>
    </div>
  );
};

export default JeansCard;
