import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../JS/Actions/cart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const displayedImage =
    selectedColor && product.images?.[selectedColor]
      ? product.images[selectedColor]
      : product.images?.[product.colors?.[0]] || product.image;

  const handleAddToCart = () => {
  if (!selectedColor || !selectedSize) {
    toast.error("Veuillez choisir une couleur et une taille !", {
      toastId: `error-${product._id}`,
      autoClose: 2000,
      pauseOnFocusLoss: false,
    });
    return;
  }

  dispatch(
    addToCart({
      productId: product._id,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
      image: displayedImage,
    })
  );

  toast.success("Produit ajouté au panier ✔", {
    toastId: `cart-${product._id}-${selectedColor}-${selectedSize}`,
    autoClose: 2000,
    pauseOnFocusLoss: false,
  });

  };

  return (
    <div className="product-card">
      <img src={displayedImage} alt={product.name} className="product-img" />

      <h3>{product.name}</h3>
      <p>{product.price} DT</p>

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
    </div>
  );
}
