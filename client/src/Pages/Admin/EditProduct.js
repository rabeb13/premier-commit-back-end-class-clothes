import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOneProduct, editProduct } from "../../JS/Actions/product";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ⚡ Correct : utilise productToGet depuis le reducer
  const productToEdit = useSelector((state) => state.product.productToGet);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    colors: [],
    sizes: [],
    image: "",
    images: {} // pour Map ou objet images
  });

  // Récupérer le produit depuis le backend
  useEffect(() => {
    dispatch(getOneProduct(id));
  }, [dispatch, id]);

  // Mettre à jour le state local quand le produit est chargé
  useEffect(() => {
    if (productToEdit) {
      setProduct({
        name: productToEdit.name || "",
        category: productToEdit.category || "",
        price: productToEdit.price || "",
        colors: productToEdit.colors || [],
        sizes: productToEdit.sizes || [],
        image: Object.values(productToEdit.images || {})[0] || "",
        images: productToEdit.images || {},
      });
    }
  }, [productToEdit]);

  // Gestion des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Gestion du submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // ⚡ Mettre à jour images si une image unique est renseignée
    const updatedProduct = {
      ...product,
      images: product.images && Object.keys(product.images).length
        ? product.images
        : { default: product.image },
    };

    dispatch(editProduct(id, updatedProduct))
      .then(() => {
        // rediriger vers la page de la catégorie
        const categoryPath = `/${product.category.toLowerCase()}`;
        navigate(categoryPath);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="edit-product-page">
      <h2>Modifier le produit</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nom"
          value={product.name}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Catégorie"
          value={product.category}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Prix"
          value={product.price}
          onChange={handleChange}
          required
        />
        <input
          name="colors"
          placeholder="Couleurs (séparées par ,)"
          value={product.colors?.join(",")}
          onChange={(e) =>
            setProduct({ ...product, colors: e.target.value.split(",") })
          }
        />
        <input
          name="sizes"
          placeholder="Tailles (séparées par ,)"
          value={product.sizes?.join(",")}
          onChange={(e) =>
            setProduct({ ...product, sizes: e.target.value.split(",") })
          }
        />
        <input
          name="image"
          placeholder="URL image principale"
          value={product.image}
          onChange={handleChange}
        />
        <button type="submit">Modifier</button>
      </form>
    </div>
  );
};

export default EditProduct;
