import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../JS/Actions/cart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const isAdmin = user?.isAdmin;

  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(null);

  // ⚡ Choisir l’image correspondant à la couleur
  const getImageByColor = (color) => {
    const imgObj = product.images?.find((img) => img.color === color);
    return imgObj ? imgObj.url : product.images?.[0]?.url || "";
  };

  // ✅ Toujours une image valide (même sans couleur choisie)
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
      {/* ✅ Toujours afficher une image au lieu de [object Object] */}
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
