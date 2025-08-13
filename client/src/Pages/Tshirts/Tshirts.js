import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../Components/ProductCard/ProductCard";
import "./Tshirts.css";

// actions Redux
import { getProducts } from "../../JS/Actions/product";
import { addToCart } from "../../JS/Actions/cart";

const Tshirts = () => {
  const dispatch = useDispatch();
  const { listProducts = [], load, error } = useSelector((state) => state.product || {});

  useEffect(() => {
    dispatch(getProducts()); // charge depuis backend
  }, [dispatch]);

  // ⬇️ Prend le produit + les options renvoyées par ProductCard
  const handleAddToCart = (product, opts = {}) => {
    dispatch(
      addToCart({
        productId: product._id,                                  // ID Mongo
        color: opts.color ?? product.colors?.[0] ?? null,        // couleur choisie
        size:  opts.size  ?? product.sizes?.[0]  ?? null,        // taille choisie
        quantity: 1,
      })
    );
  };

  if (load) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{String(error)}</p>;

  return (
    <div className="tshirts-container">
      {listProducts.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          // ⬇️ on transmet les options (color, size) au handler
          onAddToCart={(opts) => handleAddToCart(product, opts)}
        />
      ))}
    </div>
  );
};

export default Tshirts;
