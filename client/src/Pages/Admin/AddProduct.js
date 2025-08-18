import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../JS/Actions/product";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    colors: [],
    sizes: [],
    image: "",
    images: [] // 🔹 tableau d'images
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      setProduct({
        ...product,
        image: value,
        images: [value] // 🔹 mettre à jour le tableau
      });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addProduct(product))
      .then(() => navigate("/admin"))
      .catch(err => console.error(err));
  };

  return (
    <div className="add-product-page">
      <h2>Ajouter un produit</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nom" onChange={handleChange} required />
        <input name="category" placeholder="Catégorie" onChange={handleChange} required />
        <input name="price" type="number" step="0.1" placeholder="Prix" onChange={handleChange} required />
        <input
          name="colors"
          placeholder="Couleurs (ex: red,blue)"
          onChange={(e) => setProduct({ ...product, colors: e.target.value.split(",") })}
        />
        <input
          name="sizes"
          placeholder="Tailles (ex: S,M,L)"
          onChange={(e) => setProduct({ ...product, sizes: e.target.value.split(",") })}
        />
        <input name="image" placeholder="URL image" onChange={handleChange} />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AddProduct;
