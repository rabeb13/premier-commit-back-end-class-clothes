import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../Components/ProductCard/ProductCard";
import { getProducts } from "../../JS/Actions/product";
import { addToCart } from "../../JS/Actions/cart";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Tshirts.css"; // Fichier CSS pour la grille

const Tshirts = () => {
  const dispatch = useDispatch();
  const { listProducts, load, error } = useSelector((state) => state.product);

  // Charger tous les produits au montage
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Filtrer uniquement les tshirts
  const tshirts = listProducts.filter(
    (product) => product.category?.toLowerCase() === "tshirts"
  );

  // Ajouter un produit au panier
  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        color: product.colors?.[0] || null,
        size: product.sizes?.[0] || null,
        quantity: 1,
      })
    );

    toast.success("✅ Article ajouté au panier !", {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: true,
    });
  };

  if (load) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{String(error)}</p>;

  return (
    <div className="tshirts-page">
      <h2 className="tshirts-title">T-shirts et Chemise</h2>
      <div className="tshirts-grid">
        {tshirts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>
    </div>
  );
};

export default Tshirts;
