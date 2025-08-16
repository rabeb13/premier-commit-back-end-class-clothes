// src/Components/ProductCard/ProductCard.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../JS/Actions/cart";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert("Veuillez choisir une couleur et une taille !");
      return;
    }

    dispatch(
      addToCart({
        productId: product._id,
        color: selectedColor,
        size: selectedSize,
        quantity: 1,
      })
    );
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />

      <h3>{product.name}</h3>
      <p>{product.price} DT</p>

      {/* Boutons couleur */}
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
            }}
          />
        ))}
      </div>

      {/* Boutons taille */}
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

      <button onClick={handleAddToCart}>Ajouter au panier</button>
    </div>
  );
}
